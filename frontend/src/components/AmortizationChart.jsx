import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const fmt = n => n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' PLN'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-sm">
      <p className="font-medium text-gray-600 mb-1">Rata {label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  )
}

export default function AmortizationChart({ schedule }) {
  if (!schedule.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Uzupełnij dane kredytu
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Kapitał vs odsetki w czasie</h2>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={schedule} margin={{ top: 4, right: 16, left: 16, bottom: 0 }}>
          <defs>
            <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            label={{ value: 'Miesiąc', position: 'insideBottom', offset: -2, fontSize: 11 }}
          />
          <YAxis
            tickFormatter={n => n.toLocaleString('pl-PL', { notation: 'compact' })}
            tick={{ fontSize: 11 }}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={32} />
          <Area
            type="monotone"
            dataKey="principal"
            name="Kapitał"
            stroke="#3b82f6"
            fill="url(#gradPrincipal)"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
          <Area
            type="monotone"
            dataKey="interest"
            name="Odsetki"
            stroke="#ef4444"
            fill="url(#gradInterest)"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
