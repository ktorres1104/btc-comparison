import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

function formatPrice(price, symbol) {
  if (price === undefined || price === null) return '—'
  const fmt = price >= 1000
    ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : price >= 1
    ? price.toFixed(4)
    : price.toPrecision(4)
  return `${symbol}${fmt}`
}

export function PriceCard({ coinName, price, symbol, change24h, countdown, onRefresh }) {
  const isPositive = (change24h ?? 0) >= 0

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl shadow-cyan-500/10">
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-widest text-cyan-400 uppercase">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          {coinName} · Live Price
        </div>

        <div className="mb-4 flex items-end gap-4">
          <span className="text-6xl font-bold tracking-tight text-white">
            {formatPrice(price, symbol)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
              isPositive
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-red-500/15 text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {isPositive ? '+' : ''}{change24h?.toFixed(2)}% (24h)
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-xs text-slate-400 transition hover:border-cyan-500/50 hover:text-cyan-400"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh in {countdown}s
          </button>
        </div>
      </div>
    </div>
  )
}
