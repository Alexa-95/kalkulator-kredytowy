# agents.md — Subagenty i Skills w tym projekcie

## Skills

### `/verify` — weryfikacja działania aplikacji
**Kiedy**: Krok 8 (weryfikacja end-to-end) i zawsze gdy chcesz sprawdzić czy zmiana niczego nie zepsuła.  
**Co robi**: Claude sam uruchamia serwery, otwiera przeglądarkę i przechodzi przez scenariusze testowe.  
**Zamiast**: ręcznego klikania po każdej zmianie.

```
/verify
```

### `/code-review` — przegląd kodu
**Kiedy**: po dowolnym kroku, gdy coś wygląda podejrzanie lub chcesz niezależnej oceny.  
**Co robi**: Claude analizuje diff i szuka błędów, uproszczeń, potencjalnych problemów.  
**Zamiast**: ślepego akceptowania tego co agent napisał.

```
/code-review
```

---

## Subagenty — wzorzec (nie używany w tym flow)

W tym projekcie pracujemy **krok po kroku** — subagenty tu nie pomagają, bo nie ma co zrównoleglać.

Subagenty miałyby sens gdybyśmy chcieli zbudować backend i frontend **jednocześnie**:

```
Agent 1: zbuduj backend (calculator.js + index.js)
Agent 2: zbuduj frontend (komponenty React)
→ oba działają równolegle, oszczędzamy czas
```

To dobry wzorzec do pokazania na szkoleniu jako kontrast do podejścia krok-po-kroku.
