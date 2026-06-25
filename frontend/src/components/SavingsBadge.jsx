const fmt = n => n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export default function SavingsBadge({ stats }) {
  const visible = stats?.savedInterest > 0

  return (
    <div
      style={{
        transition: 'opacity 300ms ease, transform 300ms ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3"
    >
      <p className="text-sm font-semibold text-green-800">
        Oszczędzasz{' '}
        <span className="text-green-600">{fmt(stats?.savedInterest ?? 0)} zł</span>
        {' '}i skracasz kredyt o{' '}
        <span className="text-green-600">{stats?.monthsSaved ?? 0} mies.</span>
      </p>
    </div>
  )
}
