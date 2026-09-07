# Infoskærm – Mediacollege Viborg

Fælles elevprojekt: en infoskærm der kører i fuld skærm på skolens skærme og viser
nyheder, skema, frokostmenu, ur, vejr og andre praktiske informationer til elever
og undervisere.

Skærmen kører i et loop uden nogen til at betjene den. Det er den vigtigste
præmis for alt, vi bygger: ingen klik, ingen scroll, stor typografi og
automatisk opdatering.

## Teknologi

- React 19
- Vite 8 (dev-server og build)
- ESLint

## Kom i gang

Kræver Node.js 20 eller nyere.

```bash
git clone https://github.com/AnneLund/mcdm_viborg.git
cd mcdm_viborg
npm install
npm run dev
```

Dev-serveren starter typisk på http://localhost:5173.

### Scripts

| Kommando          | Hvad den gør                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Starter udviklingsserver med hot reload       |
| `npm run build`   | Bygger produktionsversionen til `dist/`       |
| `npm run preview` | Viser den byggede version lokalt              |
| `npm run lint`    | Kører ESLint på projektet                     |

## Mappestruktur

```
public/          Statiske filer der kopieres direkte med (ikoner, favicon)
src/
  assets/        Billeder og grafik der importeres i komponenter
  App.jsx        Rodkomponenten – her samles skærmens moduler
  main.jsx       Entry point, mounter React i index.html
  index.css      Globale styles
index.html       HTML-skabelonen Vite bygger ud fra
```

Efterhånden som projektet vokser, lægger vi komponenter i `src/components/` –
én mappe pr. modul på skærmen.

## Moduler på skærmen

Skærmen består af selvstændige moduler. Hver elev/gruppe har ansvar for sine
egne moduler, så vi kan arbejde parallelt uden at træde hinanden over tæerne.

Idéer til moduler:

- Ur og dato
- Dagens skema / lokaleoversigt
- Kantinens menu
- Nyheder og beskeder fra skolen
- Vejrudsigt
- Billedkarrusel fra elevprojekter
- Nedtælling til deadlines og eksamen
- Bus- og togtider

## Retningslinjer for skærmen

- **Ingen interaktion.** Ingen knapper, links, hover-effekter eller formularer.
  Der er hverken mus eller touch på skærmen.
- **Læsbar på afstand.** Brødtekst minimum ca. 24px, overskrifter væsentligt
  større. Høj kontrast.
- **Fast format.** Design til 1920×1080 i landscape (16:9), fuld skærm.
- **Skift automatisk.** Indhold der ikke kan være der på én gang, roterer på
  timer – giv brugeren tid nok til at læse det.
- **Tåler at køre i døgndrift.** Ingen memory leaks: ryd op efter
  `setInterval`/`setTimeout` og event listeners i `useEffect`.
- **Fejl må ikke vælte skærmen.** Hvis et API ikke svarer, viser modulet
  seneste kendte data eller en neutral besked – resten af skærmen kører videre.

## Sådan arbejder vi sammen

1. Hent nyeste version: `git pull`
2. Lav en branch til din opgave: `git checkout -b modul/frokostmenu`
3. Commit i små, forståelige bidder med en beskrivende besked
4. Push din branch: `git push -u origin modul/frokostmenu`
5. Åbn en pull request på GitHub og få den reviewet, før den merges til `main`

Commit aldrig direkte til `main`, og commit ikke `node_modules/` eller `dist/`
(de står allerede i `.gitignore`).

## Kodekonventioner

- Komponenter navngives i PascalCase: `FrokostMenu.jsx`
- Én komponent pr. fil, og filen hedder det samme som komponenten
- Brug funktionskomponenter og hooks – ingen klassekomponenter
- Kør `npm run lint`, før du åbner en pull request
