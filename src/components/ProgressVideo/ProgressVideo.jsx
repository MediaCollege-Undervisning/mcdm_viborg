import s from "./ProgressVideo.module.css";
import cloudTimelapse from "../../assets/video/cloud-timelapse.mp4";

export function ProgressVideo() {
  return (
    <>
      <video
        className={s.video}
        src={cloudTimelapse}
        autoPlay
        muted
        loop
        playsInline
      ></video>
    </>
  );
}
