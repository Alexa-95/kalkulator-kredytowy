# Loan Calculator

A loan calculator with a full amortization schedule, built for financial advisors. It shows the client every installment split into principal and interest, plus an interactive overpayment slider that shows how much interest and time an extra monthly payment saves.

This is a demo project for an LLM / Claude training session. It was built step by step together with an AI agent.

## Features

- Monthly payment calculated with the standard annuity formula (equal installments)
- Amortization schedule table (month, payment, principal, interest, remaining balance)
- Stacked area chart showing how the principal/interest split changes over time
- Overpayment slider: shows interest saved and how many months shorter the loan gets
- Instant recalculation as you type (150 ms debounce)
- Form values are saved in `localStorage` and restored on reload
- Polish number formatting (`pl-PL`) with tabular figures, so columns stay aligned

## Tech stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Backend  | Node.js, Express, CORS                        |
| Frontend | React 18, Vite, Tailwind CSS, Recharts        |

## Project structure

```
.
├── backend/
│   └── src/
│       ├── index.js         # Express server: POST /api/calculate, GET /health
│       └── calculator.js    # generateSchedule(): pure function, no dependencies
└── frontend/
    └── src/
        ├── App.jsx                         # Layout: form (1/3) + results (2/3)
        ├── hooks/useLoanCalculator.js      # State, debounce, API calls
        └── components/
            ├── LoanForm.jsx                # Inputs with validation and fallback on blur
            ├── ScheduleTable.jsx           # Schedule table (first 60 rows)
            ├── AmortizationChart.jsx       # Principal vs. interest chart
            └── SavingsBadge.jsx            # Overpayment savings label
```

## Getting started

Requirements: Node.js 18 or newer.

Start the backend (port 3001):

```bash
cd backend
npm install
npm start        # or: npm run dev (auto-reload with nodemon)
```

Start the frontend in a second terminal (port 5173):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` requests to `http://localhost:3001`.

## API

### `POST /api/calculate`

Request body:

| Field         | Type   | Description                                   |
| ------------- | ------ | --------------------------------------------- |
| `amount`      | number | Loan amount, must be > 0                      |
| `rate`        | number | Annual interest rate in percent, must be > 0  |
| `months`      | number | Loan term in months, from 1 to 600            |
| `overpayment` | number | Optional extra monthly payment (default `0`)  |

Example:

```bash
curl -X POST http://localhost:3001/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": 300000, "rate": 7, "months": 360, "overpayment": 500}'
```

Response:

```json
{
  "schedule": [
    { "month": 1, "payment": 2495.91, "principal": 745.91, "interest": 1750, "balance": 299254.09 },
    ...
  ],
  "totalInterest": 218291.28,
  "savedInterest": 200235.42,
  "monthsSaved": 152
}
```

Values are rounded here; the API returns unrounded numbers. `payment` includes the overpayment.

Invalid input returns `400` with an `{ "error": "..." }` message.

### `GET /health`

Returns `{ "ok": true }`.

## Design decisions

- **Overpayment shortens the loan instead of lowering the installment.** Banks offer both options; shortening is more common and makes the savings easier to see.
- **`generateSchedule` calls itself once** when an overpayment is set, to compute a baseline schedule without overpayment. The difference gives `savedInterest` and `monthsSaved`.
- **Inputs keep their own raw text.** If the user leaves a field empty or types letters, the last valid value is restored on blur, so `0` is never sent to the API by accident.
- **The savings badge is always in the DOM** and fades with `opacity`, so the CSS transition also runs when it appears.
- **The table shows at most 60 rows.** A 360-month loan would otherwise render 1,800 cells; a note under the table says how many rows are hidden.
- **The backend is stateless.** Every `/api/calculate` call is independent.

## Known limitations

- `overpayment` is not validated by the API. A negative value is accepted and reduces the payment instead of increasing it.
- The Recharts chart does not render in headless Chromium, so it looks empty in CI screenshots. It works in a normal browser.
