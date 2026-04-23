import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-cyan-500/30 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur">
      <p className="mb-1 text-xs text-slate-400">{label}</p>
      <p className="text-lg font-bold text-cyan-300">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export function PriceChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Loading chart data…
      </div>
    )
  }

  const min = Math.min(...data.map((d) => d.price))
  const max = Math.max(...data.map((d) => d.price))
  const padding = (max - min) * 0.1

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
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
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#06b6d4"
          strokeWidth={2}
          fill="url(#btcGradient)"
          dot={false}
          activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
