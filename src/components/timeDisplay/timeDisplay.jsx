import { useEffect, useState } from "react";

import styles from "../timeDisplay/timeDisplay.module.css";

function Time() {
  const [time, setTime] = useState("");
  const [seconds, setSeconds] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    const sendTime = () => {
      const date = new Date();

      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      const time = `${String(hours).padStart(2, "0")}:${minutes}`;

      setTime(time);
      setSeconds(seconds);

      if (hours < 9) {
        setIcon("moon");
      } else if (hours < 17) {
        setIcon("sun");
      } else {
        setIcon("moon");
      }
    };

    sendTime();

    const timer = setInterval(sendTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.clock}>
      <div>
        {icon === "sun" && (
          <svg
            className={styles.icon}
            width="35"
            height="35"
            viewBox="0 0 35 35"
          >
            <circle cx="17.5" cy="17.5" r="6" />
            <polyline points="17.5,2 17.5,7" />
            <polyline points="17.5,28 17.5,33" />
            <polyline points="2,17.5 7,17.5" />
            <polyline points="28,17.5 33,17.5" />
            <polyline points="6.5,6.5 10,10" />
            <polyline points="25,25 28.5,28.5" />
            <polyline points="28.5,6.5 25,10" />
            <polyline points="10,25 6.5,28.5" />
          </svg>
        )}

        {icon === "moon" && (
          <svg
            className={styles.icon}
            width="35"
            height="35"
            viewBox="0 0 35 35"
          >
            <polyline points="25,5 21,7 18,11 17,16 19,21 23,25 28,27" />
            <polyline points="28,27 23,29 18,29 13,27 9,23 7,18 7,13 9,9" />
          </svg>
        )}

        <span>{time[0]}</span>
        <span>{time[1]}</span>
        <span>{time[2]}</span>
        <span>{time[3]}</span>
        <span>{time[4]}</span>

        <small className={styles.clockSeconds}>.{seconds}</small>
      </div>
    </div>
  );
}

export default Time;
