import styles from "./news.module.css";

const News = ({ news }) => {
  console.log(news);

  if (!news || !news.results || news.results.length === 0) {
    return (
      <div className={styles.loadingScreen}>Henter seneste nyheder...</div>
    );
  }

  // Liste over nøgleord, der er relevante for Media College Viborg. Bruges til at filtrere nyheder.
  const mediaCollegeKeywords = [
    "arts",
    "culture",
    "tech",
    "technology",
    "it",
    "design",
    "ui",
    "ux",
    "photography",
    "photo",
    "video",
    "media",
    "film",
    "software",
    "web",
    "development",
    "programming",
    "code",
    "cybersecurity",
    "gadgets",
    "hardware",
    "products",
    "gaming",
  ];

  // Leder efter den første nyhed, der matcher nøgleordene. Hvis ingen matcher, tager vi den første nyhed i arrayet.
  const relevantNewsItem = news.results.find((item) => {
    // Hvis news ikke har nogen kategorier, springer vi den over
    if (!item.categories || item.categories.length === 0) return false;

    // Tjekker om nogen af nyheds-kategorierne matcher vores nøgleord
    return item.categories.some((category) => {
      const categoryName =
        typeof category === "object"
          ? category.id || category.name || ""
          : category;

      return mediaCollegeKeywords.includes(categoryName);
    });
  });

  // Den sidste relevante nyhed (den første i arrayet) eller den sidste
  const latestItem = relevantNewsItem || news.results[0];

  // Sikker datahåndtering
  const displayAuthor =
    latestItem.author?.name || latestItem.source?.name || "Global News";
  const sourceName =
    latestItem.source?.domain || latestItem.source?.name || "Premium Source";
  const rawCategory =
    latestItem.categories && latestItem.categories.length > 0
      ? latestItem.categories[0]
      : "NEWS";
  const displayCategory =
    typeof rawCategory === "object"
      ? rawCategory.name || rawCategory.id || "NEWS"
      : rawCategory;
  const imageUrl = latestItem.image || latestItem.lead_image;

  const publishDate = latestItem.pub_date
    ? new Date(latestItem.pub_date).toLocaleDateString("da-DK", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Lige nu";

  return (
    <div className={styles.fullscreenWrapper}>
      {imageUrl && (
        <div
          className={styles.blurBackground}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      <div className={styles.mainContent}>
        <div className={styles.topMeta}>
          <h1 className={styles.globalHeader}>Seneste nyheder</h1>
          <span className={styles.categoryBadge}>
            {displayCategory.toUpperCase()}
          </span>
          <span className={styles.langBadge}>
            {latestItem.language?.toUpperCase() || "ENG"}
          </span>
          <span className={styles.dateText}>{publishDate}</span>
        </div>

        <div className={styles.articleGrid}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>{latestItem.title}</h1>
            {latestItem.description && (
              <p className={styles.description}>
                {latestItem.description.length > 250
                  ? `${latestItem.description.substring(0, 250)}...`
                  : latestItem.description}
              </p>
            )}
          </div>

          {imageUrl && (
            <div className={styles.imageContainer}>
              <img
                src={imageUrl}
                alt={latestItem.title}
                className={styles.mainImage}
              />
            </div>
          )}
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.footerItem}>
            <span className={styles.footerLabel}>KILDE</span>
            <span className={styles.footerValue}>{sourceName}</span>
          </div>

          <div className={styles.footerDivider}></div>

          <div className={styles.footerItem}>
            <span className={styles.footerLabel}>FORFATTER</span>
            <span className={styles.footerValue}>{displayAuthor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;