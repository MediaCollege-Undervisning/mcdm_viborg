/* Startskærmen. Modulerne roterer automatisk: der vises ét modul ad gangen,
   og hvert 10. sekund skiftes til det næste.

   Vil du tilføje et modul til rotationen, så importér det og læg det ind i
   'modules'-listen nedenfor (rækkefølgen her = rækkefølgen de vises i). */

import { useLoaderData } from "react-router-dom";
import { useRotation } from "../hooks/useRotation";
import Schedule from "../components/scheduleComp/ScheduleComp";
import { ProgressVideo } from "../components/ProgressVideo/ProgressVideo";
import Time from "../components/timeDisplay/timeDisplay";
import News from "../components/news/News";
import Web from "../components/uddannelse-tid/web";
import FTP from "../components/uddannelse-tid/FTP";
import Foto from "../components/uddannelse-tid/Foto";

const Home = () => {
  // Data hentet af homeLoader (se DataLoaders.jsx).
  const { news, schedules } = useLoaderData();

  // Modulerne der skifter på skærmen. 'key' sikrer, at hvert modul mountes på
  // ny, når det kommer frem (fx så en video starter forfra).
  const modules = [
    <Time key="time" />,
    <Schedule key="schedule" schedules={schedules} />,
    <ProgressVideo key="video" />,
    <News key="news" news={news} />,
    <Web key="web"/>,
    <FTP key="ftp"/>,
    <Foto key="foto"/>
  ];

  // Viser ét modul ad gangen og skifter hvert 10. sekund (10000 ms).
  const active = useRotation(modules, 10000);

  // Overskriften ligger UDEN FOR rotationen, så den bevares på alle slides.
  // Kun {active} skifter hvert 10. sekund nedenunder.
  return (
    <article className="home">
      <h1>MediaCollege Denmark</h1>
      {active}
    </article>
  );
};

export default Home;
