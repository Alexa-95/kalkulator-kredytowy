import { useState } from 'react'

function NumberInput({ label, value, onChange, min, max, step }) {
  const [raw, setRaw] = useState(String(value))

  function handleChange(e) {
    const text = e.target.value
    setRaw(text)
    const num = Number(text)
    if (text !== '' && !isNaN(num) && num > 0) onChange(num)
  }

  function handleBlur() {
    const num = Number(raw)
    if (raw === '' || isNaN(num) || num <= 0) setRaw(String(value))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={raw}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default function LoanForm({ params, setParam }) {
  return (
    <div className="flex flex-col gap-5">
      <NumberInput
        label="Kwota kredytu (PLN)"
        value={params.amount}
        onChange={v => setParam('amount', v)}
        min={1000}
        step={1000}
      />

      <NumberInput
        label="Oprocentowanie (% rocznie)"
        value={params.rate}
        onChange={v => setParam('rate', v)}
        min={0.1}
        max={30}
        step={0.1}
      />

      <NumberInput
        label="Liczba rat (miesięcy)"
        value={params.months}
        onChange={v => setParam('months', v)}
        min={1}
        max={600}
        step={1}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nadpłata miesięczna
          <span className="ml-2 font-semibold text-blue-600">{params.overpayment} PLN/mies.</span>
        </label>
        <input
          type="range"
          min={0}
          max={5000}
          step={50}
          value={params.overpayment}
          onChange={e => setParam('overpayment', Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 PLN</span>
          <span>5 000 PLN</span>
        </div>
      </div>
    </div>
  )
}
