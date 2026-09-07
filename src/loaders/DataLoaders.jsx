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

// Startskærmen. Returnér et objekt, så det er nemt at udvide senere.
export const homeLoader = async () => {
  // TODO (code-along): hent rigtige data, når API'et er klar, fx:
  // const news = await getData("/news", "Kunne ikke hente nyheder");
  // return { news };
  return {};
};

// Undgår "getData er defineret men ikke brugt"-advarsel, indtil den bruges i
// jeres egne loaders ovenfor. Fjern denne linje, når I bruger getData.
void getData;
