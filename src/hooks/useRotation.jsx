import { useEffect, useState } from "react";

/* Roterer gennem en liste af elementer på en timer - kernen i en infoskærm,
   der skifter indhold automatisk uden nogen til at betjene den.

   Brug:
     const modules = ["clock", "menu", "news"];
     const active = useRotation(modules, 10000); // skift hvert 10. sekund

   Bemærk (jf. retningslinjerne i README): vi rydder ALTID op efter
   setInterval i useEffect, så skærmen kan køre i døgndrift uden memory leaks. */

const useRotation = (items = [], intervalMs = 10000) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    // Oprydning: stopper timeren, når komponenten unmountes, eller når
    // items/intervalMs ændrer sig.
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  return items[index];
};

export { useRotation };
