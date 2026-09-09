# Infoskærm – Mediacollege Viborg

Fælles elevprojekt: en infoskærm der kører i fuld skærm på skolens skærme og viser
nyheder, skema, ur, vejr og andre praktiske informationer til elever
og undervisere.

Skærmen kører i et loop uden nogen til at betjene den. Det er den vigtigste
præmis for alt, vi bygger: ingen klik, ingen scroll, stor typografi og
automatisk opdatering.

## Teknologi

- React 19
- React Router 7 (`createBrowserRouter` med loaders)
- Vite 8 (dev-server og build)
- react-spinners (loading-indikator)
- CSS Modules til komponenter + almindelig CSS til globale styles
- ESLint

## Kom i gang

Kræver Node.js 20 eller nyere.

```bash
git clone https://github.com/AnneLund/mcdm_viborg.git
cd mcdm_viborg
npm install
cp .env.example .env
npm run dev
```

Dev-serveren starter typisk på http://localhost:5173.

### Miljøvariabler (API-adresse)

Adressen til API'et er **ikke** hardkodet — den sættes via env-variablen
`VITE_API_BASE` og læses i `src/settings.jsx`.

**Lokalt:** kopiér `.env.example` til `.env` (den peger allerede på det live API):

```bash
cp .env.example .env
```

**Produktion (DigitalOcean):** sæt `VITE_API_BASE` som env-variabel på appen.
Vite læser variablen ved **build**, så appen skal bygges/deployes igen, når du
ændrer den.

`.env` ligger i `.gitignore` og må aldrig committes — kun `.env.example` deles.
Skift env-variabler kræver en genstart af dev-serveren (`npm run dev`).

### Scripts

| Kommando          | Hvad den gør                            |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Starter udviklingsserver med hot reload |
| `npm run build`   | Bygger produktionsversionen til `dist/` |
| `npm run preview` | Viser den byggede version lokalt        |

## API-endpoints

Alle data kommer fra det fælles API (adressen sættes med `VITE_API_BASE`, se
ovenfor). Live: `https://squid-app-uaozl.ondigitalocean.app`.

Alle svar har samme form:

```json
{ "status": "ok", "message": "…", "data": { … } }
```

Loaderne læser derfor typisk `json.data`.

### Skema — det infoskærmen mest bruger (kun læsning)

| Metode | Sti                      | Returnerer                                  |
| ------ | ------------------------ | ------------------------------------------- |
| GET    | `/schedule`              | Liste over hold                             |
| GET    | `/schedule/:hold`        | Hele holdets skema (alle uger)              |
| GET    | `/schedule/:hold/today`  | Dagens fag for holdet                       |

- Hold: `WebH125-2`, `WebH126-1`, `WebGF22602`, `WebH126-2` (store/små bogstaver
  er ligegyldigt).
- `/schedule/:hold/today` har feltet `text` (færdig tekst) og `type`
  (`"class"` eller `"holiday"`). Test en anden dag med `?date=YYYY-MM-DD`.
- Skemaet er **fælles** for alle — brug ikke `?id=` her.

### Enheder (ESP32) — bruges af de fysiske moduler

Tilføj `?id=<dit-id>` til disse, så hver enhed/gruppe har sit eget "rum".

| Metode          | Sti             | Body                    | Retning         |
| --------------- | --------------- | ----------------------- | --------------- |
| GET / PUT       | `/display`      | `{ "text": "…" }`       | React → enhed   |
| GET / PUT       | `/led`          | `{ "color": "on\|off\|blink\|red\|yellow\|green" }` | React → enhed |
| GET · POST · DELETE | `/button` · `/button/press` · `/button` | — | enhed → React |
| GET / PUT       | `/sensor`       | `{ "value": 22.4 }`     | enhed → React (fx temperatur) |
| GET / PUT       | `/distance`     | `{ "value": 42.5 }`     | enhed → React (fx afstand i cm) |

### Eksempel: hent dagens fag i en loader

```js
import { serverPath } from "../settings";

export const scheduleLoader = async () => {
  const res = await fetch(`${serverPath}/schedule/WebH126-1/today`);
  if (!res.ok) throw new Response("Kunne ikke hente skema", { status: res.status });
  const json = await res.json();
  return json.data; // { hold, date, text, type, subject, teacher, room, ... }
};
```

## Mappestruktur

```
public/                     Statiske filer der serveres direkte (logo, ikoner)
src/
  assets/                   Billeder og grafik der importeres i komponenter
  components/
    layouts/AppLayout.jsx   Rammen om skærmen – renderer det aktive modul
    loading/                Loading-indikator (vist mens loaders henter data)
    feedbackElements/       ErrorElement – vises hvis en loader fejler
  context/
    ScreenContext.jsx       Selve context-objektet
    ScreenProvider.jsx      Provider med fælles skærm-tilstand
    useScreenContext.jsx    Hook til at læse tilstanden
  hooks/
    useRotation.jsx         Roterer indhold på en timer
  loaders/
    DataLoaders.jsx         Henter data, før et modul vises
  pages/
    Home.jsx                Startskærmen – her samles modulerne
    404.jsx                 Ukendte ruter
  styles/
    main.css                Samler alle css-filer med @import
    base/_base.css          Globale grundstyles
  Routes.jsx                Alle ruter defineres her
  main.jsx                  Entry point – ScreenProvider + RouterProvider
  settings.jsx              Fælles indstillinger, fx serverPath
index.html                  HTML-skabelonen Vite bygger ud fra
```

Flowet gennem appen: `main.jsx` → `Routes.jsx` → `AppLayout` → `<Outlet />`,
hvor det aktive modul renderes.

## Sådan tilføjer du et modul

Hvert modul er en selvstændig del af skærmen. Én elev/gruppe pr. modul, så vi
kan arbejde parallelt uden at træde hinanden over tæerne.

1. Lav komponenten i `src/components/ditModul/DitModul.jsx`
2. Skal modulet hente data? Tilføj en loader i `src/loaders/DataLoaders.jsx`
3. Registrér modulet som en rute i `src/Routes.jsx` med `loader` og
   `errorElement={<ErrorElement />}`
4. Læs data i komponenten med `useLoaderData()`
5. Lav en css-fil i `src/styles/` og importér den i `styles/main.css` – eller
   brug et CSS Module (`ditModul.module.css`) ved siden af komponenten
6. Vis modulet på startskærmen i `src/pages/Home.jsx`

Skal indhold skifte automatisk, kan `useRotation(items, intervalMs)` bruges –
den rydder selv op efter sin timer.

## Moduler på skærmen

Idéer til moduler:

- Ur og dato
- Dagens skema / lokaleoversigt
- Nyheder og beskeder fra skolen
- Vejrudsigt + fysisk temperatur
- Billedkarrusel fra elevprojekter
- Nedtælling til deadlines og eksamen
- Bus- og togtider

## Retningslinjer for skærmen

- **Ingen interaktion.** Ingen knapper, links, hover-effekter eller formularer.
  Der er hverken mus eller touch på skærmen.
- **Læsbar på afstand.** Brødtekst minimum ca. 24px, overskrifter væsentligt
  større. Høj kontrast.
- **Fast format.** Design til 1920×1080 i landscape (16:9), fuld skærm, uden
  scroll.
- **Skift automatisk.** Indhold der ikke kan være der på én gang, roterer på
  timer – giv brugeren tid nok til at læse det.
- **Tåler at køre i døgndrift.** Ingen memory leaks: ryd op efter
  `setInterval`/`setTimeout` og event listeners i `useEffect`.
- **Fejl må ikke vælte skærmen.** Fejler en loader, fanger `ErrorElement` det og
  viser en neutral besked – resten af skærmen kører videre.

## Sådan arbejder vi sammen

1. Hent nyeste version: `git pull`
2. Lav en branch til din opgave: `git checkout -b modul/temperature`
3. Commit i små, forståelige bidder med en beskrivende besked
4. Push din branch: `git push -u origin modul/temperature`
5. Åbn en pull request på GitHub og få den reviewet, før den merges til `main`

Commit aldrig direkte til `main`, og commit ikke `node_modules/` eller `dist/`
(de står allerede i `.gitignore`).

## Kodekonventioner

- Komponenter navngives i PascalCase: `Temperature.jsx`
- Én komponent pr. fil, og filen hedder det samme som komponenten
- Mapper i camelCase: `src/components/temperature/`
- CSS Modules navngives efter komponenten: `temperature.module.css`
- Brug funktionskomponenter og hooks – ingen klassekomponenter
