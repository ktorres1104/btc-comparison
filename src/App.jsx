import { useState } from 'react'
import { Bitcoin, AlertCircle } from 'lucide-react'
import { useBTCData } from './hooks/useBTCData'
import { useTopCoins } from './hooks/useTopCoins'
import { useCoinHistory } from './hooks/useCoinHistory'
import { PriceCard } from './components/PriceCard'
import { CurrencyToggle } from './components/CurrencyToggle'
import { PriceChart } from './components/PriceChart'
import { AlertSimulator } from './components/AlertSimulator'
import { TopCoins } from './components/TopCoins'
import { ComparisonCard } from './components/ComparisonCard'

const CURRENCY_SYMBOLS = { usd: '$', eur: '€', gbp: '£' }

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-44 rounded-2xl bg-slate-800" />
      <div className="h-12 rounded-xl bg-slate-800" />
      <div className="h-72 rounded-2xl bg-slate-800" />
    </div>
  )
}

export default function App() {
  const [currency, setCurrency] = useState('usd')
  const [selectedCoin, setSelectedCoin] = useState('bitcoin')

  const { prices, loading, error, countdown, refresh } = useBTCData()
  const { coins, loading: coinsLoading, error: coinsError, countdown: coinsCountdown, refresh: coinsRefresh } = useTopCoins()
  const { data: coinHistory, loading: chartLoading } = useCoinHistory(selectedCoin)

  // Derive the selected coin's display info
  const isBTC = selectedCoin === 'bitcoin'
  const selectedCoinMeta = isBTC
    ? {
        name: 'Bitcoin',
        price: prices?.[currency],
        symbol: CURRENCY_SYMBOLS[currency],
        change24h: prices?.[`${currency}_24h_change`],
      }
    : (() => {
        const coin = coins?.find((c) => c.id === selectedCoin)
        return {
          name: coin?.name ?? selectedCoin,
          price: coin?.current_price,
          symbol: '$',
          change24h: coin?.price_change_percentage_24h,
        }
      })()

  const selectedCoinName = selectedCoinMeta.name

  return (
    <div className="min-h-screen bg-[#060b18]">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
              <Bitcoin className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white">BTC Comparison</span>
              <span className="ml-2 rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs text-cyan-400">Live</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Data: CoinGecko API · Updates every 30s
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Hero label */}
        <div className="text-center pb-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Bitcoin Price{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="mt-2 text-slate-400">
            Real-time crypto prices powered by the CoinGecko API
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Price card */}
            <PriceCard
              coinName={selectedCoinMeta.name}
              price={selectedCoinMeta.price}
              symbol={selectedCoinMeta.symbol}
              change24h={selectedCoinMeta.change24h}
              countdown={countdown}
              onRefresh={refresh}
            />

            {/* Currency toggle (only meaningful for BTC) */}
            {isBTC && (
              <CurrencyToggle
                currency={currency}
                onChange={setCurrency}
                prices={prices}
              />
            )}

            {/* Chart */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">{selectedCoinName} Price History</h2>
                  <p className="text-xs text-slate-500">Last 7 days · USD</p>
                </div>
                <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                  7D
                </div>
              </div>
              <PriceChart data={coinHistory} loading={chartLoading} />
            </div>

            {/* Alert simulator (only for BTC) */}
            {isBTC && <AlertSimulator currentPrice={prices?.usd} />}
          </>
        )}

        {/* Top 5 Most Tradable Coins */}
        <TopCoins
          coins={coins}
          loading={coinsLoading}
          error={coinsError}
          countdown={coinsCountdown}
          onRefresh={coinsRefresh}
          selectedCoin={selectedCoin}
          onSelectCoin={setSelectedCoin}
        />

        {/* Comparison + Coins to Watch */}
        <ComparisonCard coins={coins} />

        <footer className="border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
          Built with React · Vite · Tailwind CSS · Recharts · CoinGecko API
          <br />
          <span className="text-slate-700">
            Prices are indicative. Not financial advice.
          </span>
        </footer>
      </main>
    </div>
  )
}
