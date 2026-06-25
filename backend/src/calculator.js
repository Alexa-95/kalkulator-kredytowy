function generateSchedule({ amount, rate, months, overpayment = 0 }) {
  const monthlyRate = rate / 100 / 12
  const payment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months))

  const schedule = []
  let balance = amount

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate
    let principal = payment - interest + overpayment

    if (principal >= balance) {
      principal = balance
      schedule.push({ month, payment: principal + interest, principal, interest, balance: 0 })
      break
    }

    balance -= principal
    schedule.push({ month, payment: principal + interest, principal, interest, balance })
  }

  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0)

  if (overpayment === 0) {
    return { schedule, totalInterest, savedInterest: 0, monthsSaved: 0 }
  }

  const base = generateSchedule({ amount, rate, months, overpayment: 0 })
  return {
    schedule,
    totalInterest,
    savedInterest: base.totalInterest - totalInterest,
    monthsSaved: months - schedule.length,
  }
}

module.exports = { generateSchedule }
