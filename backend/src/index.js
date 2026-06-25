const express = require('express')
const cors = require('cors')
const { generateSchedule } = require('./calculator')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

app.post('/api/calculate', (req, res) => {
  const { amount, rate, months, overpayment = 0 } = req.body

  if (!amount || !rate || !months) {
    return res.status(400).json({ error: 'Wymagane pola: amount, rate, months' })
  }

  if (typeof amount !== 'number' || typeof rate !== 'number' || typeof months !== 'number') {
    return res.status(400).json({ error: 'Pola amount, rate, months muszą być liczbami' })
  }

  if (amount <= 0 || rate <= 0 || months <= 0 || months > 600) {
    return res.status(400).json({ error: 'Nieprawidłowe wartości: amount i rate > 0, months od 1 do 600' })
  }

  const result = generateSchedule({ amount, rate, months, overpayment })
  res.json(result)
})

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
