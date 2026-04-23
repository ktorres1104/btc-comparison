import { Check, X, Code2, Workflow } from 'lucide-react'

const CODE_PROS = [
  'Full control over UI/UX design',
  'Custom logic & complex conditions',
  'No vendor lock-in or monthly fees',
  'Scales infinitely with your infrastructure',
  'Real-time updates via WebSocket or polling',
  'Git version control & team collaboration',
]

const CODE_CONS = [
  'Requires developer time to build & maintain',
  'You handle hosting, uptime, and security',
  'More setup for non-technical stakeholders',
]

const N8N_PROS = [
  'Visual workflow editor — no coding required',
  'Huge library of pre-built integrations',
  'Fast to prototype alert workflows',
  'Non-developers can modify flows',
]

const N8N_CONS = [
  'Limited custom UI — mostly backend workflows',
  'Complex logic gets messy with many nodes',
  'Paid tier required for production workloads',
  'Less flexible for pixel-perfect dashboards',
]

function ProConList({ items, type }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm">
          {type === 'pro' ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          )}
          <span className="text-slate-300">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ComparisonCard() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">How This Was Built</h2>
        <p className="text-sm text-slate-400">
          Code vs. No-Code — two approaches to the same problem
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Code approach */}
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
              <Code2 className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-semibold text-white">This App</div>
              <div className="text-xs text-cyan-400">React + Vite + Tailwind + Recharts</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">Strengths</div>
            <ProConList items={CODE_PROS} type="pro" />
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-400">Trade-offs</div>
            <ProConList items={CODE_CONS} type="con" />
          </div>

          <div className="mt-4 rounded-lg bg-slate-800/60 p-3 text-xs text-slate-400">
            <span className="font-medium text-white">Built with: </span>
            CoinGecko API · React hooks · Recharts · Tailwind CSS · ~300 lines of code
          </div>
        </div>

        {/* n8n approach */}
        <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-600/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
              <Workflow className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <div className="font-semibold text-white">n8n Equivalent</div>
              <div className="text-xs text-violet-400">Visual workflow automation</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">Strengths</div>
            <ProConList items={N8N_PROS} type="pro" />
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-400">Trade-offs</div>
            <ProConList items={N8N_CONS} type="con" />
          </div>

          <div className="mt-4 rounded-lg bg-slate-800/60 p-3 text-xs text-slate-400">
            <span className="font-medium text-white">Would use: </span>
            HTTP Request node · IF node · Email/Slack node · Schedule trigger · ~5 nodes
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center text-sm text-amber-300">
        <strong className="text-amber-200">Bottom line:</strong> n8n excels at backend automation pipelines (alerts, ETL, integrations).
        Code wins when you need a custom UI, real-time data, and full design control — like this dashboard.
      </div>
    </div>
  )
}
