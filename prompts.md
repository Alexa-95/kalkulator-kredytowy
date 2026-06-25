# prompts.md — Snippety które pojawiły się więcej niż raz

Zasada: jeśli ten sam prompt lub komentarz do agenta pojawił się więcej niż raz
w procesie budowania — trafia tutaj jako gotowy snippet do ponownego użycia.

---

## Weryfikacja środowiska (użyte: przed każdym krokiem)

Sprawdź czy oba serwery żyją zanim zaczniesz cokolwiek testować:

```bash
curl -s http://localhost:3001/health && curl -s http://localhost:5173 | grep -o '<title>.*</title>'
```

---

## Testowanie API z czytelnym outputem (użyte: Krok 2, 3, 8)

Wzorzec `curl | node -e` do czytelnego drukowania odpowiedzi JSON:

```bash
curl -s -X POST http://localhost:3001/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount":300000,"rate":7,"months":360,"overpayment":500}' | node -e "
    const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'))
    console.log('Rat:', d.schedule.length)
    console.log('Oszczędności:', d.savedInterest?.toFixed(0), 'PLN')
    console.log('Miesięcy krócej:', d.monthsSaved)
  "
```

---

## Screenshot headless (użyte: Krok 5, 6, 7, 8)

Chromium headless czeka na załadowanie danych przed screenshotem:

```bash
chromium --headless --disable-gpu --no-sandbox \
  --screenshot="output.png" \
  --window-size=1400,900 \
  --virtual-time-budget=5000 \
  http://localhost:5173
```

> Uwaga: `animationDuration` w Recharts nie działa w headless — serie wykresu
> są niewidoczne na screenshocie, ale działają w prawdziwej przeglądarce.

---

## Pytania po każdym kroku (użyte: po każdym z 8 kroków)

Szablon do rozmowy z agentem po zakończeniu kroku:

```
Co wybrałeś i dlaczego?
Jakie zależności dodałeś — czy są potrzebne?
Co się stanie gdy użytkownik poda [edge case]?
Czy jest coś co pominąłeś albo uprosłeś?
```

---

## Uruchomienie projektu od zera (użyte: Krok 1, sesja po resecie)

```bash
# Terminal 1
cd backend && npm install && npm start

# Terminal 2
cd frontend && npm install && npm run dev

# Weryfikacja
curl -s http://localhost:3001/health
# → {"ok":true}
```

---

## Edge cases do sprawdzenia w każdym endpoincie (użyte: Krok 3, 8)

```bash
# Brak pól
curl -s -X POST http://localhost:3001/api/calculate \
  -H "Content-Type: application/json" -d '{}'

# Ujemna wartość
curl -s -X POST http://localhost:3001/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount":-1,"rate":7,"months":360}'

# Przekroczenie granicy (months > 600)
curl -s -X POST http://localhost:3001/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount":300000,"rate":7,"months":601}'

# String zamiast liczby
curl -s -X POST http://localhost:3001/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount":"abc","rate":7,"months":360}'
```
