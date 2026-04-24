import { useEffect, useState, useMemo } from 'react'
import { fetchTopCoins } from '../services/api'
import CoinCard from '../components/CoinCard'
import SearchBar from '../components/SearchBar'
import { CoinCardSkeleton } from '../components/Skeleton'
import { useWatchlist } from '../context/WatchlistContext'

export default function Home() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [sortType, setSortType] = useState('default')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [, setNow] = useState(Date.now())

  const { watchlist } = useWatchlist()

  useEffect(() => {
    let cancelled = false
    // Fast-return if we already have data
    if (coins.length) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetchTopCoins()
      .then(data => { 
        if (!cancelled) {
          setCoins(data)
          setLastUpdated(new Date())
        }
      })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    const interval = setInterval(() => {
      fetchTopCoins()
        .then(data => {
          if (!cancelled) {
            setCoins(data)
            setLastUpdated(new Date())
          }
        })
        .catch(() => {})
    }, 60000) // refresh every 60s

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000) // updates every second

    return () => clearInterval(timer)
  }, [])

  const refreshData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTopCoins()
      setCoins(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (date) => {
    if (!date) return '—'
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hr ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const normalizedQuery = query.trim().toLowerCase()

  const filteredCoins = useMemo(() => {
    return normalizedQuery
      ? coins.filter(c =>
          c.name.toLowerCase().includes(normalizedQuery) ||
          c.symbol.toLowerCase().includes(normalizedQuery)
        )
      : coins
  }, [coins, normalizedQuery])

  const sortedCoins = useMemo(() => {
    const arr = [...filteredCoins]

    // First sort normally
    if (sortType === 'low-high') {
      arr.sort((a, b) => a.current_price - b.current_price)
    } else if (sortType === 'high-low') {
      arr.sort((a, b) => b.current_price - a.current_price)
    } else {
      arr.sort((a, b) => a.market_cap_rank - b.market_cap_rank)
    }

    // Then prioritize watchlist
    if (watchlist.length) {
      const watchlistIds = new Set(watchlist.map(c => c.id))
      return arr.sort((a, b) => {
        const aFav = watchlistIds.has(a.id)
        const bFav = watchlistIds.has(b.id)
        if (aFav === bFav) return 0
        return aFav ? -1 : 1
      })
    }

    return arr
  }, [filteredCoins, sortType, watchlist])

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Crypto Dashboard
        </h1>
        <p className="text-secondary text-sm mt-1">Track crypto. Stay ahead.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Top Cryptos</h2>
          <p className="text-xs text-secondary">
            Last updated: {getTimeAgo(lastUpdated)} • Auto-refresh every 60s
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-sm"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="bg-white/5 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg text-sm outline-none hover:bg-white/10 transition"
          >
            <option value="default">Popularity</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass p-6 text-center mb-6">
          <p className="text-[var(--color-loss)] font-medium">Failed to load data</p>
          <p className="text-secondary text-sm mt-1">Please try again in a moment.</p>
          <button
            className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchTopCoins()
                .then(data => setCoins(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false))
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-500 ease-out">
          {Array.from({ length: 12 }).map((_, i) => <CoinCardSkeleton key={i} />)}
        </div>
      ) : sortedCoins.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-secondary">
            No results for "<span className="text-white font-medium">{normalizedQuery}</span>"
          </p>
          <p className="text-xs text-secondary mt-1">
            Try a different name or symbol
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-500 ease-out">
          {sortedCoins.map(coin => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      )}
    </main>
  )
}
