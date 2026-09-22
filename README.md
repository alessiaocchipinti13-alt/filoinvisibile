# Il Filo Invisibile

Un telaio collettivo per Pedalart, Pedalino. I visitatori scelgono la propria fascia
d'età e la radice che sentono più propria ("una lingua o un dialetto", "un luogo o una
casa", …): ogni scelta tende un filo sulla tavola, e i fili di tutti restano visibili a
chi arriva dopo.

La domanda che guida l'installazione: *il filo invisibile ti lega alle tue radici?*

## Come funziona

- **La tavola** è un `<canvas>` disegnato a mano: quattro nodi a sinistra (le fasce
  d'età) e sei chiodi a destra (le radici). Ogni filo è una curva di Bézier tesa fra un
  nodo e un chiodo, con un'oscillazione stabile derivata dall'id del filo — lo stesso
  filo disegna sempre la stessa curva, su qualsiasi schermo.
- **I fili sono condivisi.** Ogni contributo viene salvato su Netlify Database
  (Postgres), quindi il conteggio in alto e la trama sulla tavola crescono con il
  pubblico reale, non si azzerano al ricaricare la pagina.
- **Si aggiorna da sé.** La pagina rilegge i fili ogni 20 secondi e quando torna in
  primo piano: utile su uno schermo lasciato acceso durante l'evento.
- **I tuoi fili** (quelli aggiunti dal tuo dispositivo) sono tracciati più spessi e più
  intensi, così ognuno ritrova il proprio.

## Tecnologie

| Cosa | Con cosa |
| --- | --- |
| Interfaccia | HTML, CSS e JavaScript (ES module), nessun framework |
| Disegno | Canvas 2D, scalato per schermi ad alta densità |
| API | Netlify Function (`netlify/functions/threads.mts`) su `/api/threads` |
| Dati | Netlify Database (Postgres) con Drizzle ORM |
| Tipografia | Bodoni Moda + Karla (Google Fonts) |

## Sviluppo locale

```bash
npm install
npm run dev        # netlify dev sulla porta 8889
```

Il sito statico è in `public/`, servito così com'è: nessun passaggio di build.

Le migrazioni vengono applicate automaticamente da Netlify durante il deploy. In locale
il database risponde solo dopo che un deploy ha creato il branch; fino a quel momento la
pagina mostra lo stato "telaio offline" e resta comunque navigabile.

Dopo ogni modifica a `db/schema.ts`:

```bash
npm run db:generate -- --name <nome_migrazione>
```

## API

| Metodo | Percorso | Cosa fa |
| --- | --- | --- |
| `GET` | `/api/threads` | Restituisce gli ultimi 600 fili in ordine cronologico |
| `POST` | `/api/threads` | Aggiunge un filo: `{ "ageGroup": …, "category": … }` |

La funzione accetta soltanto le quattro fasce d'età e le sei radici previste: qualsiasi
altro valore riceve `422`.
