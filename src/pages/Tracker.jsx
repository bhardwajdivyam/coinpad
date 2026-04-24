import { useState } from 'react'
import { fetchAddressInfo, fetchAddressTxs } from '../services/api'
import Loader from '../components/Loader'

function satToCoin(sat) {
  return (sat / 1e8).toFixed(8)
}

function truncate(str, len = 16) {
  if (!str || str.length <= len * 2) return str
  return `${str.slice(0, len)}…${str.slice(-len)}`
}

export default function Tracker() {
  const [coin, setCoin] = useState('btc')
  const [address, setAddress] = useState('')
  const [data, setData] = useState(null)
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = address.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setData(null)
    setTxs([])

    try {
      const [info, fullData] = await Promise.all([
        fetchAddressInfo(coin, trimmed),
        fetchAddressTxs(coin, trimmed),
      ])
      setData(info)
      setTxs((fullData.txs || []).slice(0, 10))
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Invalid address or network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Address Tracker
        </h1>
        <p className="text-secondary text-sm mt-1">Look up any BTC or LTC wallet</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass p-5 flex flex-col sm:flex-row gap-3 mb-6">
        {/* Coin selector */}
        <select
          id="coin-select"
          value={coin}
          onChange={e => setCoin(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
        >
          <option value="btc">BTC</option>
          <option value="ltc">LTC</option>
        </select>

        {/* Address input */}
        <input
          id="wallet-address"
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Enter wallet address…"
          className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-secondary focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--color-accent)] text-[#0a0a0f] hover:brightness-110 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Looking up…' : 'Track'}
        </button>
      </form>

      {/* Loading */}
      {loading && <Loader message="Fetching wallet data…" />}

      {/* Error */}
      {error && (
        <div className="glass p-6 text-center">
          <p className="text-[var(--color-loss)] font-medium">Lookup failed</p>
          <p className="text-secondary text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
          {/* Balance Card */}
          <div className="glass p-6">
            <h2 className="text-xs font-medium text-secondary uppercase tracking-wider mb-4">
              Wallet Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Stat label="Balance" value={`${satToCoin(data.balance)} ${coin.toUpperCase()}`} />
              <Stat label="Total Received" value={`${satToCoin(data.total_received)} ${coin.toUpperCase()}`} />
              <Stat label="Total Sent" value={`${satToCoin(data.total_sent)} ${coin.toUpperCase()}`} />
            </div>
          </div>

          {/* Transactions */}
          {txs.length > 0 && (
            <div className="glass p-6">
              <h2 className="text-xs font-medium text-secondary uppercase tracking-wider mb-4">
                Recent Transactions
              </h2>
              <div className="space-y-3">
                {txs.map((tx, i) => (
                  <div key={tx.hash || i} className="p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-secondary">{truncate(tx.hash, 12)}</span>
                      <span className="text-xs text-secondary">
                        {tx.confirmed ? new Date(tx.confirmed).toLocaleDateString() : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {satToCoin(tx.total)} {coin.toUpperCase()}
                      </span>
                      <span className="text-xs text-secondary">
                        Fee: {satToCoin(tx.fees)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !data && (
        <div className="glass p-12 text-center">
          <p className="text-3xl mb-2">🔎</p>
          <p className="text-secondary text-sm">Enter a wallet address above to view its balance and transactions</p>
        </div>
      )}
    </main>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-secondary mb-1">{label}</p>
      <p className="text-base font-semibold tracking-tight">{value}</p>
    </div>
  )
}
