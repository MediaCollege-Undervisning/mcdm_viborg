// Fælles indstillinger for hele projektet.
// Ét sted at ændre serveradresse o.l., så vi ikke gentager den i hver loader.

// Adressen på API'et sættes via env-variablen VITE_API_BASE — ikke hardkodet.
//   Lokalt:      i en .env-fil (kopiér .env.example til .env). Se README.
//   Produktion:  som env-variabel i DigitalOcean (læses ved build).
// Fallback bruges kun, hvis variablen mangler.
const raw =
  import.meta.env.VITE_API_BASE || "https://squid-app-uaozl.ondigitalocean.app";

// Fjern evt. skråstreg(er) til sidst, så loaderne kan sætte "/schedule" direkte på.
export const serverPath = raw.replace(/\/+$/, "");

// Nyheder hentes nu gennem VORES eget API (/news-proxy), så news-nøglen bliver
// på serveren og ikke i den offentlige frontend-bundle.
