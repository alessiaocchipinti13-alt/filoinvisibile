# AGENTS.md

Contesto per sessioni future su questo progetto.

## Cos'è

"Il Filo Invisibile" è un'installazione partecipata per Pedalart (Pedalino): una tavola
di string art collettiva. Un visitatore sceglie la fascia d'età, poi la radice che lo
lega alla propria storia; il filo risultante viene salvato e mostrato a tutti.

Il progetto è completo: frontend, API e persistenza sono in produzione. Non esiste un
PLAN.md perché non è rimasto lavoro in sospeso.

## Struttura

```
public/                 sito statico (publish directory)
  index.html            pagina unica: intro, tavola, pannello delle radici
  assets/styles.css     tutto lo stile, con le variabili di palette in :root
  assets/board.js       motore del canvas, chiamate API, pannello, toast
netlify/functions/
  threads.mts           GET/POST su /api/threads
netlify/database/migrations/   migrazioni generate da drizzle-kit
db/schema.ts            tabella `threads` (fonte di verità dello schema)
db/index.ts             client Drizzle (connessione automatica, nessuna stringa)
drizzle.config.ts       out = netlify/database/migrations (obbligatorio)
```

## Decisioni non ovvie

- **Le due liste di valori sono duplicate** in `board.js` (con etichette brevi e icone
  per il disegno) e in `threads.mts` (come allowlist di validazione). Se aggiungi una
  fascia d'età o una radice, aggiorna entrambi i file: la funzione rifiuta con `422`
  qualsiasi valore che non conosce, e il canvas ignora i fili che non riesce a
  posizionare.
- **Le curve non sono casuali a ogni frame.** `wobble(id)` deriva l'oscillazione
  dall'id del filo, così la trama è identica per tutti e stabile fra i ricaricamenti.
  Non sostituirla con `Math.random()`.
- **L'animazione parte solo quando serve.** `kick()` avvia il `requestAnimationFrame`
  e il ciclo si ferma quando tutti i fili hanno `p >= 1`; `draw()` da solo è
  sufficiente per ridisegnare dopo un resize.
- **Etichette per larghezza.** Sotto i 560 px il canvas passa alle etichette `tiny`
  (`<20`, `Lingua`, …) per non sovrapporre il testo ai fili. Il pannello mostra sempre
  la formulazione completa in italiano.
- **`GET` limita a 600 fili** (`VISIBLE_LIMIT`): abbastanza per una trama densa senza
  far crescere la risposta all'infinito. Il conteggio mostrato è quello dei fili
  visibili.
- **Nessun passaggio di build.** `public/` viene pubblicato così com'è; il CSS e il JS
  non sono compilati. Evita di introdurre un bundler senza una ragione concreta.
- **Niente emoji nell'interfaccia**: le radici usano piccole icone SVG inline definite
  in `ROOTS`.

## Regole operative

- Le migrazioni si **creano** con `npm run db:generate -- --name <nome>` e le applica
  Netlify al deploy. Non eseguire mai `drizzle-kit migrate/push` né DDL a mano.
- I testi dell'interfaccia sono in italiano: mantieni la lingua e il tono (asciutto,
  concreto, senza gergo di marketing).
- La palette vive nelle variabili CSS in `:root` e negli oggetti `AGES` di `board.js`
  (il canvas non legge il CSS): i due elenchi di colori devono restare allineati.
