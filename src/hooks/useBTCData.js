import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

const PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,gbp&include_24hr_change=true'
const HISTORY_URL = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7'
const REFRESH_INTERVAL = 30

export function useBTCData() {
  const [prices, setPrices] = useState(null)
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL)
  const countdownRef = useRef(REFRESH_INTERVAL)
  const timerRef = useRef(null)

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(HISTORY_URL)
      const points = res.data.prices.map(([ts, price]) => ({
        time: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: ts,
        price: Math.round(price),
      }))
      // Thin to ~50 points max for performance
      const step = Math.max(1, Math.floor(points.length / 50))
      setHistory(points.filter((_, i) => i % step === 0))
    } catch (e) {
      // history failing is non-fatal
    }
  }, [])

  const fetchPrice = useCallback(async () => {
    try {
      const res = await axios.get(PRICE_URL)
      setPrices(res.data.bitcoin)
      setError(null)
    } catch (e) {
      setError('Failed to fetch price. CoinGecko may be rate-limiting.')
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchPrice()
    countdownRef.current = REFRESH_INTERVAL
    setCountdown(REFRESH_INTERVAL)
  }, [fetchPrice])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchPrice(), fetchHistory()])
      setLoading(false)
    }
    init()
  }, [fetchPrice, fetchHistory])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      countdownRef.current -= 1
      setCountdown(countdownRef.current)
      if (countdownRef.current <= 0) {
        fetchPrice()
        countdownRef.current = REFRESH_INTERVAL
        setCountdown(REFRESH_INTERVAL)
      }
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [fetchPrice])

  return { prices, history, loading, error, countdown, refresh }
}
