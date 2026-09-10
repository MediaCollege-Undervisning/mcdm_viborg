import { useEffect, useState } from "react";
import { getWebudvikler } from "./server/api";
import "./faelles.css";

const Web = () => {
  const [education, setEducation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    getWebudvikler(controller.signal)
      .then(setEducation)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return <div className="uddannelse-fejl">{error}</div>;
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
          {duration} ({grundforlobWeeks} uger)
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
};

export default Web;
