import { useNavigate } from 'react-router-dom'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useWatchlist } from '../context/WatchlistContext'

function Badge({ value, label }) {
  if (value == null) return null
  const positive = value >= 0
  const color = positive ? 'var(--color-gain)' : 'var(--color-loss)'
  const arrow = positive ? '↑' : '↓'

  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-md"
          style={{ color, background: positive ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)' }}>
      {arrow} {Math.abs(value).toFixed(2)}%
      {label && <span className="text-secondary ml-0.5 text-[10px]">{label}</span>}
    </span>
  )
}

function CoinCard({ coin }) {
  const navigate = useNavigate()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  const prevPriceRef = useRef(null)
  const [flash, setFlash] = useState(null) // 'up' | 'down' | null

  const handleNavigate = useCallback(() => {
    navigate(`/coin/${coin.id}`, { state: coin })
  }, [navigate, coin])

  const {
    id,
    name,
    image,
    current_price,
    price_change_percentage_24h: d1,
    price_change_percentage_7d_in_currency: d7,
  } = coin

  const inWatchlist = isInWatchlist(id)

  const handleWatchlistToggle = (e) => {
    e.stopPropagation()

    const btn = e.currentTarget
    btn.classList.add('scale-125')
    setTimeout(() => btn.classList.remove('scale-125'), 150)

    if (inWatchlist) {
      removeFromWatchlist(id)
    } else {
      addToWatchlist(coin)
    }
  }

  useEffect(() => {
    if (current_price == null) return
    const prev = prevPriceRef.current

    if (prev != null) {
      if (current_price > prev) {
        setFlash('up')
      } else if (current_price < prev) {
        setFlash('down')
      }
    }

    prevPriceRef.current = current_price

    // clear flash after short duration
    const t = setTimeout(() => setFlash(null), 600)
    return () => clearTimeout(t)
  }, [current_price])

  return (
    <div
      className={`relative glass p-4 flex flex-col gap-2.5 group cursor-pointer coin-card transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] ${
        inWatchlist
          ? 'ring-1 ring-yellow-400/40 shadow-[0_0_20px_rgba(250,204,21,0.15)] scale-[1.02]'
          : ''
      }`}
      onClick={handleNavigate}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleNavigate()
        }
      }}
      aria-label={`Open ${name} details`}
      title={`${name} (${coin.symbol?.toUpperCase()})`}
    >
      <button
        onClick={handleWatchlistToggle}
        className={`absolute top-3 right-3 z-10 text-lg transition-all duration-200 hover:scale-110 hover:text-yellow-400 ${inWatchlist ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]' : 'text-white/60'}`}
        title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        {inWatchlist ? '★' : '☆'}
      </button>
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300"
           style={{
             background: 'radial-gradient(circle at top, rgba(59,130,246,0.15), transparent 70%)'
           }}
      />
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <img
          src={image}
          alt={name}
          width={36}
          height={36}
          className="rounded-full ring-1 ring-[var(--color-border)] group-hover:ring-[var(--color-accent)] transition-all duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div>
          <h3 className="text-[13px] font-semibold leading-tight">{name}</h3>
          <p className="text-xs text-secondary mt-0.5">{coin.symbol?.toUpperCase()}</p>
        </div>
      </div>

      {/* Price */}
      <p
        className={`text-lg font-semibold tracking-tight transition-all duration-300 group-hover:text-[var(--color-accent)]
          ${flash === 'up' ? 'text-green-400 scale-105' : ''}
          ${flash === 'down' ? 'text-red-400 scale-105' : ''}
        `}
      >
        {current_price != null
          ? `$${current_price.toLocaleString(undefined, {
              minimumFractionDigits: current_price < 1 ? 4 : 2,
              maximumFractionDigits: current_price < 1 ? 6 : 2,
            })}`
          : '—'}
      </p>
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-40 group-hover:opacity-80 transition" />

      {/* Change badges */}
      <div className="flex items-center gap-1.5 flex-wrap mt-1">
        <Badge value={d1} label="24h" />
        <Badge value={d7} label="7d" />
      </div>
    </div>
  )
}

export default memo(CoinCard)
