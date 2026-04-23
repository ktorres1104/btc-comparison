import { useState } from 'react'
import { Bell, CheckCircle, X } from 'lucide-react'

export function AlertSimulator({ currentPrice }) {
  const [email, setEmail] = useState('')
  const [threshold, setThreshold] = useState('')
  const [direction, setDirection] = useState('above')
  const [toast, setToast] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !threshold) return

    const msg = `Alert set! We'll notify ${email} when BTC goes ${direction} $${Number(threshold).toLocaleString()}`
    setToast(msg)
    setEmail('')
    setThreshold('')
    setTimeout(() => setToast(null), 5000)
  }

  return (
    <div className="relative rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
      <div className="mb-5 flex items-center gap-2">
        <Bell className="h-5 w-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Price Alert Simulator</h2>
        <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
          Simulated · No real email sent
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Price Threshold (USD)
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder={currentPrice ? Math.round(currentPrice).toString() : '95000'}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Direction
            </label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="h-[42px] rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500/60"
            >
              <option value="above">Above ↑</option>
              <option value="below">Below ↓</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-blue-500 active:scale-[0.99]"
        >
          Set Alert
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div className="absolute inset-x-4 bottom-4 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 shadow-lg animate-in slide-in-from-bottom-2">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-300">{toast}</p>
          <button onClick={() => setToast(null)} className="ml-auto text-emerald-500 hover:text-emerald-300">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
