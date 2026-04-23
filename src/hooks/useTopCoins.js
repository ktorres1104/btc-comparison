import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

const MARKETS_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=5&page=1&sparkline=true'
const REFRESH_INTERVAL = 60

export function useTopCoins() {
  const [coins, setCoins] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL)
  const countdownRef = useRef(REFRESH_INTERVAL)
  const timerRef = useRef(null)

  const fetchCoins = useCallback(async () => {
    try {
      const res = await axios.get(MARKETS_URL)
      setCoins(res.data)
      setError(null)
    } catch {
      setError('Failed to fetch top coins.')
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchCoins()
    countdownRef.current = REFRESH_INTERVAL
    setCountdown(REFRESH_INTERVAL)
  }, [fetchCoins])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await fetchCoins()
      setLoading(false)
    }
    init()
  }, [fetchCoins])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      countdownRef.current -= 1
      setCountdown(countdownRef.current)
      if (countdownRef.current <= 0) {
        fetchCoins()
        countdownRef.current = REFRESH_INTERVAL
        setCountdown(REFRESH_INTERVAL)
      }
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [fetchCoins])

  return { coins, loading, error, countdown, refresh }
}
