import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

const CURRENCY_SYMBOLS = { usd: '$', eur: '€', gbp: '£' }
const CURRENCY_NAMES = { usd: 'US Dollar', eur: 'Euro', gbp: 'British Pound' }

export function PriceCard({ prices, currency, countdown, onRefresh }) {
  const symbol = CURRENCY_SYMBOLS[currency]
  const price = prices?.[currency]
  const change = prices?.[`${currency}_24h_change`]
  const isPositive = change >= 0

  const fmt = (n) =>
    n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl shadow-cyan-500/10">
      {/* Glow orb */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-widest text-cyan-400 uppercase">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          Bitcoin · {CURRENCY_NAMES[currency]}
        </div>

        <div className="mb-4 flex items-end gap-4">
          <span className="text-6xl font-bold tracking-tight text-white">
            {symbol}{fmt(price)}
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
            {isPositive ? '+' : ''}{change?.toFixed(2)}% (24h)
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
