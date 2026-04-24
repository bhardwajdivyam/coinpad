import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { fetchTopCoins, fetchCoinChart } from '../services/api'

/* ── Custom Tooltip ───────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__date">{label}</p>
      <p className="chart-tooltip__price">
        ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

/* ── Day Selector ─────────────────────────────────────── */
const DAY_OPTIONS = [1, 7, 14, 30, 90]

function DaySelector({ selected, onChange }) {
  return (
    <div className="day-selector">
      {DAY_OPTIONS.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`day-selector__btn ${selected === d ? 'day-selector__btn--active' : ''}`}
        >
          {d === 1 ? '24H' : `${d}D`}
        </button>
      ))}
    </div>
  )
}

/* ── Main Page ────────────────────────────────────────── */
export default function CoinDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [coin, setCoin] = useState(location.state || null)
  const [chartData, setChartData] = useState([])
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(true)
  const [error, setError] = useState(null)

  // Memoized derived values
  const d1 = coin?.price_change_percentage_24h ?? 0
  const d7 = coin?.price_change_percentage_7d_in_currency ?? 0
  const positive24 = d1 >= 0

  const chartColor = useMemo(
    () => (positive24 ? '#34d399' : '#f87171'),
    [positive24]
  )

  // Fetch chart data
  useEffect(() => {
    let cancelled = false
    if (!id) return

    const cacheKey = `chart-${id}-${days}`
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
      setChartData(JSON.parse(cached))
      setChartLoading(false)
      return
    }

    setChartLoading(true)
    fetchCoinChart(id, days)
      .then((data) => {
        if (cancelled) return
        setChartData(data)
        localStorage.setItem(cacheKey, JSON.stringify(data))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setChartLoading(false)
      })
    return () => { cancelled = true }
  }, [id, days])

  useEffect(() => {
    setError(null)
  }, [id])

  /* ── Error State ─────── */
  if (error) {
    return (
      <main className="coin-details">
        <button onClick={() => navigate(-1)} className="coin-details__back">
          ← Back
        </button>
        <div className="glass p-8 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-[var(--color-loss)] font-medium">Something went wrong. Please try again.</p>
          <button
            className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            onClick={() => {
              setError(null)
              setChartLoading(true)
              fetchCoinChart(id, days)
                .then((data) => setChartData(data))
                .catch((err) => setError(err.message))
                .finally(() => setChartLoading(false))
            }}
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  /* ── Loading State ─────── */
  if (!coin) {
    return (
      <main className="coin-details">
        <button onClick={() => navigate(-1)} className="coin-details__back">
          ← Back
        </button>
        <div className="coin-details__header glass">
          <div className="flex items-center gap-4">
            <div className="skeleton w-14 h-14 rounded-full shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="skeleton h-6 w-40" />
              <div className="skeleton h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="glass coin-details__chart-card">
          <div className="skeleton w-full" style={{ height: 320 }} />
        </div>
      </main>
    )
  }


  return (
    <main className="coin-details">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="coin-details__back">
        ← Back
      </button>

      {/* Header Card */}
      <div className="coin-details__header glass">
        <div className="flex items-center gap-4">
          <img
            src={coin.image}
            alt={coin.name}
            width={56}
            height={56}
            className="rounded-full ring-2 ring-[var(--color-border)]"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {coin.name}
              <span className="text-sm text-secondary font-normal">{coin.symbol?.toUpperCase()}</span>
            </h1>
            <p className="text-sm text-secondary mt-0.5">Rank #{coin.market_cap_rank}</p>
          </div>
        </div>

        <div className="coin-details__price-row">
          <p className="text-3xl sm:text-4xl font-bold tracking-tight">
            ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {d1 != null && (
              <span
                className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg"
                style={{
                  color: positive24 ? 'var(--color-gain)' : 'var(--color-loss)',
                  background: positive24 ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                }}
              >
                {positive24 ? '↑' : '↓'} {Math.abs(d1).toFixed(2)}%
                <span className="text-xs font-normal opacity-60">24h</span>
              </span>
            )}
            {d7 != null && (
              <span
                className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg"
                style={{
                  color: d7 >= 0 ? 'var(--color-gain)' : 'var(--color-loss)',
                  background: d7 >= 0 ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                }}
              >
                {d7 >= 0 ? '↑' : '↓'} {Math.abs(d7).toFixed(2)}%
                <span className="text-xs font-normal opacity-60">7d</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="glass coin-details__chart-card">
        <div className="coin-details__chart-header">
          <h2 className="text-lg font-semibold">Price Chart</h2>
          <DaySelector selected={days} onChange={setDays} />
        </div>

        {chartLoading ? (
          <div className="skeleton w-full" style={{ height: 320, borderRadius: 12 }} />
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center" style={{ height: 320 }}>
            <p className="text-secondary">No chart data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(2)}`
                }
                width={72}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotoneX"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: chartColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats Grid */}
      <div className="coin-details__stats">
        <StatCard label="Market Cap" value={`$${(coin.market_cap ?? 0).toLocaleString()}`} />
        <StatCard label="24h Volume" value={`$${(coin.total_volume ?? 0).toLocaleString()}`} />
        <StatCard label="Circulating Supply" value={`${(coin.circulating_supply ?? 0).toLocaleString()} ${coin.symbol?.toUpperCase()}`} />
        <StatCard label="All-Time High" value={`$${(coin.ath ?? 0).toLocaleString()}`} />
      </div>
    </main>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="glass p-4">
      <p className="text-xs text-secondary mb-1">{label}</p>
      <p className="text-sm font-semibold truncate" title={value}>
        {value}
      </p>
    </div>
  )
}
