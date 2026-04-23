import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export function useCoinHistory(coinId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setData(null)
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      )
      const points = res.data.prices.map(([ts, price]) => ({
        time: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: ts,
        price,
      }))
      const step = Math.max(1, Math.floor(points.length / 50))
      setData(points.filter((_, i) => i % step === 0))
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [coinId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { data, loading }
}
