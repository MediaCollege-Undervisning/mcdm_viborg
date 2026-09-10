import { serverPath } from "../settings";

/* Loaders HENTER data, før et modul vises (kaldes automatisk af React Router).
   Resultatet læses i komponenten med useLoaderData().

   På en infoskærm er det vigtigt, at data hentes robust: fejler et kald, så
   kaster vi en Response, som modulets errorElement fanger - resten af skærmen
   kører videre. */

// Lille hjælper, så vi ikke gentager fetch + fejltjek overalt.
const getData = async (path, errorText = "Fejl ved hentning") => {
  const res = await fetch(`${serverPath}${path}`);
  if (!res.ok) throw new Response(errorText, { status: res.status });
  return res.json();
};

// Nyheder hentes gennem VORES eget API (/news-proxy), så news-nøglen bliver på
// serveren og ikke i frontend-bundlen.
//
// VIGTIGT (infoskærm-princip): en fejl her må IKKE vælte hele skærmen. Derfor
// kaster vi ikke - vi returnerer null, hvis kaldet fejler, så resten af
// modulerne roterer videre. News-komponenten viser da bare sin egen
// "Henter seneste nyheder..."-tilstand.
const getNewsData = async () => {
  try {
    const res = await fetch(`${serverPath}/news`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data; // API'et pakker svaret i { status, message, data }
  } catch {
    return null;
  }
};

// Holdene, hvis skema vi viser på startskærmen.
const holds = ["WebH125-2", "WebH126-1", "WebGF22602", "WebH126-2"];

// Startskærmen. Returnér et objekt, så det er nemt at udvide senere.
export const homeLoader = async () => {
  const [news, scheduleResults] = await Promise.all([
    getNewsData(),
    Promise.all(
      holds.map((hold) =>
        getData(
          `/schedule/${encodeURIComponent(hold)}/today`,
          `Kunne ikke hente skema for ${hold}`,
        ),
      ),
    ),
  ]);

  const schedules = scheduleResults
    .filter((result) => result.status === "ok")
    .map((result) => result.data);

  return { news, schedules };
};
