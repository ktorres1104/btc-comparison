import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function smartFormat(value, maxPrice) {
  if (maxPrice >= 1000) return `$${Math.round(value).toLocaleString()}`
  if (maxPrice >= 1) return `$${value.toFixed(4)}`
  return `$${value.toPrecision(4)}`
}

function CustomTooltip({ active, payload, label, maxPrice }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-cyan-500/30 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur">
      <p className="mb-1 text-xs text-slate-400">{label}</p>
      <p className="text-lg font-bold text-cyan-300">
        {smartFormat(payload[0].value, maxPrice)}
      </p>
    </div>
  )
}

export function PriceChart({ data, loading }) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-slate-400">
        <svg className="h-5 w-5 animate-spin text-cyan-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading chart…
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        No chart data available.
      </div>
    )
  }

  const prices = data.map((d) => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const padding = (max - min) * 0.1

  const tickFmt = max >= 1000
    ? (v) => `$${(v / 1000).toFixed(0)}k`
    : max >= 1
    ? (v) => `$${v.toFixed(2)}`
    : (v) => `$${v.toPrecision(3)}`

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="coinGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.08)" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[min - padding, max + padding]}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFmt}
          width={55}
        />
        <Tooltip content={<CustomTooltip maxPrice={max} />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#06b6d4"
          strokeWidth={2}
          fill="url(#coinGradient)"
          dot={false}
          activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
