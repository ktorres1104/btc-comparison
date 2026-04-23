const CURRENCIES = [
  { id: 'usd', label: 'USD', symbol: '$' },
  { id: 'eur', label: 'EUR', symbol: '€' },
  { id: 'gbp', label: 'GBP', symbol: '£' },
]

export function CurrencyToggle({ currency, onChange, prices }) {
  const fmt = (n) =>
    n?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <div className="flex gap-3">
      {CURRENCIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`flex-1 rounded-xl border p-4 text-left transition-all duration-200 ${
            currency === c.id
              ? 'border-cyan-500/60 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10'
              : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
          }`}
        >
          <div className="mb-1 text-xl font-bold">
            {c.symbol}{fmt(prices?.[c.id])}
          </div>
          <div className={`text-xs font-semibold tracking-widest uppercase ${currency === c.id ? 'text-cyan-400' : 'text-slate-500'}`}>
            {c.label}
          </div>
        </button>
      ))}
    </div>
  )
}
