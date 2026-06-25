# Kalkulator Kredytowy — Plan projektu

## Co budujemy

Narzędzie dla doradców finansowych do prezentacji kredytu klientowi.
Klient podaje kwotę, oprocentowanie i liczbę rat — narzędzie generuje harmonogram spłat
z podziałem na kapitał i odsetki. Kluczowy element: suwak nadpłaty miesięcznej,
który na żywo pokazuje o ile skróci się kredyt i ile odsetek klient zaoszczędzi.

**Frontend**: React  
**Backend**: prosta REST API (Node.js/Express) — na tyle prosta, żeby rozumiał ją frontend developer

---

## Jak pracujemy

Jeden krok naraz. Po każdym kroku:
1. Pytamy agenta co zrobił i dlaczego (nie zakładamy — rozmawiamy)
2. Aktualizujemy `CLAUDE.md` i `agents.md` o to, czego się dowiedzieliśmy
3. Zastanawiamy się: czy ten prompt lub komentarz pojawi się znowu?
   Jeśli tak — zapisujemy go jako gotowy snippet do ponownego użycia

---

## Specyfikacja funkcjonalna

### Widok główny (dwukolumnowy)
- **Lewa kolumna**: formularz parametrów kredytu + etykieta oszczędności
- **Prawa kolumna**: wykres (kapitał vs odsetki w czasie) + tabela harmonogramu

### Parametry wejściowe
- Kwota kredytu (PLN)
- Oprocentowanie (% rocznie)
- Liczba rat (miesięcy)
- Suwak: nadpłata miesięczna (0–5000 PLN)

### Harmonogram spłat
Tabela z kolumnami: numer raty, łączna płatność, część kapitałowa, część odsetkowa, pozostałe saldo

### Wykres
Dwie serie w czasie: skumulowany kapitał i skumulowane odsetki. Płynna animacja przy zmianie suwaka.

### Etykieta oszczędności
Pojawia się gdy nadpłata > 0: "Oszczędzasz X zł i skracasz kredyt o Y miesięcy"
Wartości muszą animować się płynnie przy przesuwaniu suwaka.

---

## Kroki do wykonania

### Krok 1 — Szkielet projektu
Utwórz strukturę katalogów i pliki konfiguracyjne dla backendu i frontendu.
Bez logiki — tylko scaffolding: `package.json`, konfiguracja narzędzi, puste pliki wejściowe.

> **Po tym kroku zapytaj**: Co wybrał i dlaczego? Jakie zależności dodał? Czy czegoś nie ma?

### Krok 2 — Logika kalkulatora (backend)
Zaimplementuj obliczenia: harmonogram amortyzacji, obsługa nadpłaty, liczenie oszczędności.
To jest czysta funkcja — bez serwera HTTP.

> **Po tym kroku zapytaj**: Jak liczy ratę annuitetową? Jak obsługuje nadpłatę? Przetestuj ją ręcznie.

### Krok 3 — API (backend)
Owiń logikę z Kroku 2 w endpoint HTTP. Walidacja danych wejściowych, obsługa błędów.

> **Po tym kroku zapytaj**: Jaki format body przyjmuje? Co zwraca przy błędzie? Uruchom `curl` i sprawdź.

### Krok 4 — Formularz i hook (frontend)
Formularz parametrów + custom hook łączący formularz z API (debounce na suwaku).
Bez wykresu i tabeli — tylko przepływ danych.

> **Po tym kroku zapytaj**: Gdzie żyje stan? Jak działa debounce? Co hook zwraca komponentom?

### Krok 5 — Tabela harmonogramu (frontend)
Wyrenderuj dane z hooka w tabeli. Formatowanie PLN, responsywność.

> **Po tym kroku zapytaj**: Sprawdź w przeglądarce z prawdziwymi danymi. Czy wygląda czytelnie?

### Krok 6 — Wykres (frontend)
Dwie serie (kapitał / odsetki) z animacją. Podłącz do tych samych danych co tabela.

> **Po tym kroku zapytaj**: Czy animacja działa przy zmianie suwaka? Jak płynna jest?

### Krok 7 — Etykieta oszczędności (frontend)
Komponent pojawiający się gdy nadpłata > 0. Animacja wejścia/zmiany wartości.

> **Po tym kroku zapytaj**: Czy etykieta pojawia się i znika poprawnie? Jak wygląda animacja?

### Krok 8 — Weryfikacja end-to-end
Uruchom całość i przejdź przez scenariusze testowe.

```
/verify
```

> **Scenariusze**: kredyt 300k PLN / 7% / 360 rat bez nadpłaty, potem z nadpłatą 500 PLN.

> **Opcjonalnie po dowolnym kroku** — jeśli coś wygląda podejrzanie:
> ```
> /code-review
> ```

---

## Dokumenty do utrzymywania na bieżąco

| Plik | Co tam trafia |
|---|---|
| `CLAUDE.md` | Architektura, konwencje, decyzje techniczne |
| `agents.md` | Jak i kiedy używamy subagentów w tym projekcie |
| `prompts.md` | Snippety promptów które pojawiły się więcej niż raz |

---

## Definicja ukończenia

- [ ] Backend odpowiada na `POST /api/calculate` z poprawnym harmonogramem
- [ ] Suwak nadpłaty zmienia wyniki w czasie rzeczywistym (debounce)
- [ ] Wykres animuje się płynnie przy zmianie nadpłaty
- [ ] Etykieta "Oszczędzasz X" pojawia się i aktualizuje
- [ ] `CLAUDE.md`, `agents.md` i `prompts.md` są uzupełnione
