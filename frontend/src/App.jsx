import { useLoanCalculator } from './hooks/useLoanCalculator'
import LoanForm from './components/LoanForm'
import ScheduleTable from './components/ScheduleTable'
import AmortizationChart from './components/AmortizationChart'
import SavingsBadge from './components/SavingsBadge'

export default function App() {
  const { params, setParam, schedule, stats, loading, error } = useLoanCalculator()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Kalkulator Kredytowy</h1>
      </header>

      <div className="flex gap-6 p-6">
        <aside className="w-80 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <LoanForm params={params} setParam={setParam} />
            <SavingsBadge stats={stats} />
          </div>
        </aside>

        <main className="flex-1">
          {loading && <p className="text-gray-400">Obliczam...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <AmortizationChart schedule={schedule} />
          <div className="mt-6">
            <ScheduleTable schedule={schedule} />
          </div>
        </main>
      </div>
    </div>
  )
}
