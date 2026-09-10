import s from "./ProgressVideo.module.css";

async function fetchData() {
  try {
    const response = await fetch(
      "https://squid-app-uaozl.ondigitalocean.app/media",
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Issue during video fetch:", error);
  }
}

const data = await fetchData();
const video = data.media[0];

export function ProgressVideo() {
  return (
    <div className={s.frame}>
      <video
        className={s.video}
        src={video.url}
        autoPlay
        muted
        loop
        playsInline
      ></video>
    </div>
  );
}
