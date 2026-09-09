import { useEffect, useState } from "react";
import styles from "../timeDisplay/timeDisplay.module.css";

function Time() {
  const [time, setTime] = useState("");
  const [seconds, setSeconds] = useState("");

  useEffect(() => {
    const sendTime = () => {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      const time = `${hours}:${minutes}`;

      setTime(time);
      setSeconds(seconds);
    };

    sendTime();

    const timer = setInterval(sendTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.clock}>
      <div>
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
