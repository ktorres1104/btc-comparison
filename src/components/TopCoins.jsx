import { RefreshCw, TrendingUp, TrendingDown, Flame } from 'lucide-react'

function formatPrice(price) {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (price >= 1) return `$${price.toFixed(2)}`
  return `$${price.toPrecision(4)}`
}

function formatVolume(vol) {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(1)}M`
  return `$${vol.toLocaleString()}`
}

function Sparkline({ data, positive }) {
  if (!data || data.length < 2) return null

  const step = Math.max(1, Math.floor(data.length / 40))
  const pts = data.filter((_, i) => i % step === 0)
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const range = max - min || 1
  const W = 100
  const H = 36

  const points = pts
    .map((val, i) => {
      const x = (i / (pts.length - 1)) * W
      const y = H - ((val - min) / range) * (H - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const color = positive ? '#10b981' : '#ef4444'

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  )
}

function CoinRow({ coin, rank, isSelected, onSelect }) {
  const positive = coin.price_change_percentage_24h >= 0
  const sparkData = coin.sparkline_in_7d?.price

  return (
    <div
      onClick={onSelect}
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
        isSelected
          ? 'border-cyan-500/70 bg-slate-800/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
          : 'border-slate-700/60 bg-slate-800/40 hover:border-cyan-500/30 hover:bg-slate-800/70'
      }`}
    >
      {/* Rank */}
      <span className="w-5 shrink-0 text-center text-sm font-bold text-slate-500">
        {rank}
      </span>

      {/* Logo + Name */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <img
          src={coin.image}
          alt={coin.name}
          className="h-8 w-8 shrink-0 rounded-full"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{coin.name}</div>
          <div className="text-xs uppercase text-slate-500">{coin.symbol}</div>
        </div>
      </div>

      {/* Price */}
      <div className="hidden text-right sm:block">
        <div className="text-sm font-semibold text-white">{formatPrice(coin.current_price)}</div>
        <div className="text-xs text-slate-500">price</div>
      </div>

      {/* 24h change badge */}
      <div
        className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
          positive
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-red-500/15 text-red-400'
        }`}
      >
        {positive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {positive ? '+' : ''}
        {coin.price_change_percentage_24h?.toFixed(2)}%
      </div>

      {/* Volume */}
      <div className="hidden text-right md:block">
        <div className="text-sm font-medium text-slate-300">{formatVolume(coin.total_volume)}</div>
        <div className="text-xs text-slate-500">24h vol</div>
      </div>

      {/* Sparkline */}
      <div className="hidden lg:block">
        <Sparkline data={sparkData} positive={positive} />
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-700/40 bg-slate-800/30 px-4 py-3">
      <div className="h-4 w-4 animate-pulse rounded bg-slate-700" />
      <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-700" />
        <div className="h-2.5 w-12 animate-pulse rounded bg-slate-700" />
      </div>
      <div className="h-6 w-14 animate-pulse rounded-full bg-slate-700" />
      <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-700 md:block" />
    </div>
  )
}

export function TopCoins({ coins, loading, error, countdown, onRefresh, selectedCoin, onSelectCoin }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <h2 className="font-semibold text-white">Top 5 Most Tradable Coins</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">Ranked by 24h trading volume · Click a coin to view its chart</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Refreshes in{' '}
            <span className="tabular-nums text-cyan-400">{countdown}s</span>
          </span>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-cyan-500/40 hover:text-cyan-400"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>
      </div>

      {/* Column headers (desktop) */}
      <div className="mb-2 hidden items-center gap-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-600 lg:flex">
        <span className="w-5 text-center">#</span>
        <span className="flex-1">Coin</span>
        <span className="w-24 text-right">Price</span>
        <span className="w-20 text-center">24h</span>
        <span className="w-28 text-right">Volume</span>
        <span className="w-24 text-center">7-day</span>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : coins?.map((coin, i) => (
              <CoinRow
                key={coin.id}
                coin={coin}
                rank={i + 1}
                isSelected={selectedCoin === coin.id}
                onSelect={() => onSelectCoin(coin.id)}
              />
            ))}
      </div>

      {/* Volume note */}
      {!loading && coins && (
        <p className="mt-3 text-right text-xs text-slate-600">
          Volumes are 24h rolling totals from CoinGecko
        </p>
      )}
    </div>
  )
}
