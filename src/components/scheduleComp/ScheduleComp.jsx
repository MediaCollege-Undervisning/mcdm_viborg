import styles from "./ScheduleComp.module.css";

const Schedule = ({ schedules = [] }) => {
  const date = schedules[0]?.date
    ? new Date(schedules[0].date).toLocaleDateString("da-DK", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <section className={styles.ScheduleContainer}>
      <header className={styles.ScheduleHeader}>
        <h1>Dagens skema</h1>
        <p>{date}</p>
      </header>

      {schedules.map((schedule) => (
        <article
          key={schedule.hold}
          className={styles.ScheduleCard}
        >
          <h2>{schedule.hold}</h2>

          <div className={styles.ScheduleInfo}>
            <h3>{schedule.subject}</h3>

            <p>
              <strong>Lærer:</strong>{" "}
              {schedule.teacher || "—"}
            </p>

            <p>
              <strong>Lokale:</strong>{" "}
              {schedule.room || "—"}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Schedule;