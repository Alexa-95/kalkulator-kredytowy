import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'loan-calculator-params'
const DEFAULTS = { amount: 300000, rate: 7, months: 360, overpayment: 0 }

function loadParams() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function useLoanCalculator() {
  const [params, setParamsState] = useState(loadParams)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  function setParam(key, value) {
    setParamsState(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    const { amount, rate, months } = params
    if (!amount || !rate || !months) return

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setResult(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 150)

    return () => clearTimeout(debounceRef.current)
  }, [params])

  return {
    params,
    setParam,
    schedule: result?.schedule ?? [],
    stats: result,
    loading,
    error,
  }
}
