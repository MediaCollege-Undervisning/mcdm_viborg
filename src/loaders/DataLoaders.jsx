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

const holds = [
  "WebH125-2",
  "WebH126-1",
  "WebGF22602",
  "WebH126-2",
];

// Startskærmen. Returnér et objekt, så det er nemt at udvide senere.
export const homeLoader = async () => {
  // TODO (code-along): hent rigtige data, når API'et er klar, fx:
  // const news = await getData("/news", "Kunne ikke hente nyheder");
  // return { news };

  const scheduleResults = await Promise.all(
    holds.map((hold) =>
      getData(
        `/schedule/${encodeURIComponent(hold)}/today`,
        `Kunne ikke hente skema for ${hold}`
      )
    )
  );

  const schedules = scheduleResults
    .filter((result) => result.status === "ok")
    .map((result) => result.data);
    
  return { schedules };
};


// Undgår "getData er defineret men ikke brugt"-advarsel, indtil den bruges i
// jeres egne loaders ovenfor. Fjern denne linje, når I bruger getData.
void getData;
