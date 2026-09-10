import { useEffect, useState } from "react";
import { getFilmproduktion } from "./server/api";
import "./faelles.css";

// Modul der viser en kort præsentation af uddannelsen Film- og TV-produktion.
// Henter data direkte fra API'et (server/api.js), da modulet endnu ikke
// indgår i en route-loader.
const FTP = () => {
  const [education, setEducation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    getFilmproduktion(controller.signal)
      .then(setEducation)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <div className="eduLoading">Kunne ikke hente uddannelsen lige nu.</div>
    );
  }

  if (!education) {
    return <div className="eduLoading">Henter uddannelsen...</div>;
  }

  return (
    <div className="eduWrapper">
      <div className="eduHeader">
        <span className="eduLabel">Uddannelse</span>
        <h1 className="eduTitle">{education.name}</h1>
        <p className="eduDuration">{education.duration}</p>
        {education.link && (
          <a
            className="eduLink"
            href={education.link}
            target="_blank"
            rel="noreferrer"
          >
            Læs mere om uddannelsen
          </a>
        )}
      </div>

      {education.subjects && education.subjects.length > 0 && (
        <div className="eduSubjects">
          <h2 className="eduSubjectsTitle">Det lærer du</h2>
          <ul className="eduSubjectsList">
            {education.subjects.map((subject) => (
              <li key={subject}>{subject}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FTP;
