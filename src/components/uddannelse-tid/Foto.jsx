import { useEffect, useState } from "react";
import { getFotograf } from "../uddannelse-tid/server/api";
import "./faelles.css";
const images = [
  {
    src: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1800&q=85",
    alt: "Fotograf med kamera",
  },
];

function Foto() {
  const [education, setEducation] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getFotograf(controller.signal)
      .then(setEducation)
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading)
    return (
      <main className="state-message">
        <p>Henter fotograf-uddannelsen...</p>
      </main>
    );
  if (error || !education)
    return (
      <main className="state-message error-state">
        <p>Vi kunne ikke hente uddannelsen.</p>
        <button type="button" onClick={() => window.location.reload()}>
          Prøv igen
        </button>
      </main>
    );

  const subjects = education.subjects ?? [];
  const nextImage = () =>
    setActiveImage((current) => (current + 1) % images.length);
  const previousImage = () =>
    setActiveImage((current) => (current - 1 + images.length) % images.length);

  return (
    <div className="photographer-site">
      <main>
        <section className="photographer-hero">
          <div className="hero-copy">
            <p className="section-label">01 / Kreativ uddannelse</p>
            <h1>
              Se verden
              <br />
              <em>på ny.</em>
            </h1>
            <p className="hero-text">
              {education.name} lærer dig at fortælle historier med lys,
              komposition og det blik, der gør et øjeblik uforglemmeligt.
            </p>
            <a
              className="yellow-link"
              href={education.link}
              target="_blank"
              rel="noreferrer"
            >
              Læs mere om uddannelsen <span>↗</span>
            </a>
          </div>
          <div className="hero-number">01</div>
        </section>
        <section
          className="image-story"
          aria-label="Billeder fra fotografuddannelsen"
        >
          <div className="image-stage">
            <img src={images[activeImage].src} alt={images[activeImage].alt} />
            <div className="image-index">
              0{activeImage + 1} <span>/ 0{images.length}</span>
            </div>
          </div>
          <div className="image-toolbar">
            <p className="section-label">Billedserie / Fotograf</p>
            <div className="image-controls">
              <button
                type="button"
                aria-label="Forrige billede"
                onClick={previousImage}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Næste billede"
                onClick={nextImage}
              >
                →
              </button>
            </div>
          </div>
        </section>
        <section className="facts-section">
          <div className="section-intro">
            <p className="section-label">02 / Det praktiske</p>
            <h2>
              En uddannelse
              <br />
              med <em>plads til dig.</em>
            </h2>
          </div>
          <div className="facts-grid">
            <div className="fact-item">
              <strong>{education.grundforlobWeeks}</strong>
              <span>uger på grundforløbet</span>
            </div>
            <div className="fact-item">
              <strong>01</strong>
              <span>kreativt fag med praktik</span>
            </div>
            <div className="fact-item">
              <strong>∞</strong>
              <span>muligheder for at fortælle</span>
            </div>
          </div>
        </section>
        <section className="subjects-section">
          <div className="section-intro">
            <p className="section-label">03 / Du lærer</p>
            <h2>
              Fra første
              <br />
              <em>klik.</em>
            </h2>
          </div>
          <div className="subjects-list">
            {subjects.map((subject, index) => (
              <div className="subject-row" key={subject}>
                <span>0{index + 1}</span>
                <strong>{subject}</strong>
                <b>↗</b>
              </div>
            ))}
          </div>
        </section>
        <section className="closing-section">
          <p className="section-label">04 / Dit næste kapitel</p>
          <h2>
            Har du
            <br />
            <em>blikket?</em>
          </h2>
          <a
            className="dark-link"
            href={education.link}
            target="_blank"
            rel="noreferrer"
          >
            Gå til uddannelsen <span>↗</span>
          </a>
        </section>
      </main>
    </div>
  );
}

export default Foto;
