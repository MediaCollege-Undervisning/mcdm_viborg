import { useEffect, useState } from "react";
import { getFotograf } from "../uddannelse-tid/server/api";
import "./faelles.css";

// Modul der viser en kort præsentation af fotograf-uddannelsen. Bruger samme
// kompakte slide-layout som de øvrige uddannelses-moduler, så det passer i ét
// skærmbillede i rotationen.
function Foto() {
  const [education, setEducation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getFotograf(controller.signal)
      .then(setEducation)
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      });
    return () => controller.abort();
  }, []);

  if (error) {
    return <div className="uddannelse-fejl">Kunne ikke hente uddannelsen.</div>;
  }

  if (!education) {
    return <div className="uddannelse-loading">Henter uddannelse...</div>;
  }

  const { name, duration, grundforlobWeeks, subjects } = education;

  return (
    <section className="uddannelse-wrapper">
      <header className="uddannelse-header">
        <span className="uddannelse-badge">Uddannelse</span>
        <h1 className="uddannelse-titel">{name}</h1>
        <p className="uddannelse-varighed">
          {duration}
          {grundforlobWeeks ? ` (${grundforlobWeeks} uger)` : ""}
        </p>
      </header>

      {subjects && subjects.length > 0 && (
        <ul className="uddannelse-fag">
          {subjects.map((subject) => (
            <li key={subject} className="uddannelse-fag-item">
              {subject}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Foto;
