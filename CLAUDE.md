# Kalkulator Kredytowy — CLAUDE.md

## O projekcie

Kalkulator kredytowy z harmonogramem spłat dla doradców finansowych. Pokazuje klientowi pełny harmonogram amortyzacji z podziałem na część kapitałową i odsetkową, z interaktywnym suwakiem nadpłaty.

Projekt demonstracyjny na szkolenie z LLM i Claude — zbudowany krok po kroku z agentem.

## Architektura

```
example2/
├── backend/
│   └── src/
│       ├── index.js         # Express, CORS, POST /api/calculate, GET /health
│       └── calculator.js    # generateSchedule() — czysta funkcja, zero zależności
├── frontend/
│   └── src/
│       ├── App.jsx                         # Layout 1/3 + 2/3
│       ├── hooks/useLoanCalculator.js      # Stan + debounce 150ms + fetch
│       └── components/
│           ├── LoanForm.jsx                # NumberInput z lokalnym raw state
│           ├── ScheduleTable.jsx           # Tabela, limit 60 wierszy
│           ├── AmortizationChart.jsx       # Recharts AreaChart, animacja 300ms
│           └── SavingsBadge.jsx            # opacity transition, zawsze w DOM
└── CLAUDE.md / agents.md / task.md / prompts.md
```

## Uruchamianie

```bash
cd backend && npm install && npm start   # port 3001
cd frontend && npm install && npm run dev # port 5173
```

## Decyzje podjęte podczas budowania

**Nadpłata skraca kredyt, nie zmniejsza raty** — `principal += overpayment` w każdej iteracji. Banki oferują oba warianty, tu wybrano skracanie jako częstsze i bardziej spektakularne wizualnie (etykieta oszczędności).

**`generateSchedule` wywołuje się rekurencyjnie** — gdy `overpayment > 0`, oblicza bazowy harmonogram bez nadpłaty żeby policzyć `savedInterest` i `monthsSaved`. Prosto i czytelnie, bez dodatkowego stanu.

**`NumberInput` z lokalnym `raw` stringiem** — input przechowuje własny tekst niezależnie od hooka. `onBlur` przywraca ostatnią dobrą wartość gdy użytkownik zostawi puste pole lub wpisze litery. Bez tego `Number("")` = 0 trafiało do API.

**`SavingsBadge` zawsze w DOM** — `opacity: 0` zamiast `{visible && <Badge />}`. Dzięki temu CSS transition działa na wejście. Odmontowanie komponentu kasuje animację.

**Tabela ograniczona do 60 wierszy** — przy 360 ratach DOM miałby 1 800 komórek. 60 wystarczy żeby pokazać rytm spłat klientowi. Informacja o ukrytych ratach na dole tabeli.

**`tabular-nums` + `toLocaleString('pl-PL')`** — cyfry jednoszerokościowe (kolumny nie skaczą) i polskie formatowanie (spacja jako separator tysięcy, przecinek dziesiętny).

## Znane ograniczenia

- `overpayment` nie jest walidowany po stronie API — ujemna nadpłata jest akceptowana (zmniejsza ratę zamiast ją zwiększyć). Nie blokuje działania.
- Recharts (`animationDuration`) nie renderuje się w headless Chromium — wykres wygląda pusty na screenshotach CI. W prawdziwej przeglądarce działa poprawnie.

## Konwencje

- `rate` wchodzi do API w % rocznie, `calculator.js` przelicza: `monthlyRate = rate / 100 / 12`
- Harmonogram: `{ month, payment, principal, interest, balance }`
- Backend bezstanowy — każde wywołanie `/api/calculate` niezależne

## Dla Claude — wskazówki

- Logika kalkulatora: `backend/src/calculator.js` — czysta funkcja, łatwa do testowania
- Debounce i fetch: `frontend/src/hooks/useLoanCalculator.js`
- Walidacja inputów: `LoanForm.jsx` — `NumberInput` komponent z `onBlur` fallback
- Wykres i tabela czytają z tego samego `schedule` z hooka — zmiana danych aktualizuje oba naraz
