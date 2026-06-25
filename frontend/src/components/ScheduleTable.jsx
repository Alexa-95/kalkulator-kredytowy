const fmt = n => n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const COLUMNS = [
  { label: 'Rata',    key: 'month',     align: 'text-center' },
  { label: 'Płatność (PLN)', key: 'payment',  align: 'text-right' },
  { label: 'Kapitał (PLN)',  key: 'principal', align: 'text-right' },
  { label: 'Odsetki (PLN)', key: 'interest', align: 'text-right' },
  { label: 'Saldo (PLN)',   key: 'balance',  align: 'text-right' },
]

const PREVIEW = 60

export default function ScheduleTable({ schedule }) {
  if (!schedule.length) return null

  const rows = schedule.slice(0, PREVIEW)
  const hidden = schedule.length - rows.length

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Harmonogram spłat</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
            <tr>
              {COLUMNS.map(col => (
                <th key={col.key} className={`px-4 py-3 ${col.align}`}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.month} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors">
                {COLUMNS.map(col => (
                  <td key={col.key} className={`px-4 py-2 ${col.align} tabular-nums`}>
                    {col.key === 'month' ? row.month : fmt(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hidden > 0 && (
        <p className="text-xs text-gray-400 mt-2 text-right">
          Pokazano {PREVIEW} z {schedule.length} rat
        </p>
      )}
    </div>
  )
}
