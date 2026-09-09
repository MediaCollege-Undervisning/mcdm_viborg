/* Startskærmen. Her samles infoskærmens moduler (ur, menu, nyheder, vejr ...).
   Data hentet af homeLoader (se DataLoaders.jsx) læses med useLoaderData():

     import { useLoaderData } from "react-router-dom";
     const data = useLoaderData();
*/
import { useLoaderData } from "react-router-dom";
import Schedule from "../components/scheduleComp/ScheduleComp";
import { ProgressVideo } from "../components/ProgressVideo/ProgressVideo";
import Time from "../components/timeDisplay/timeDisplay";
import News from "../components/news/News";

const Home = () => {
  const { news, schedules } = useLoaderData();

  return (
    <article className="home">
      <Time />
      <h1>Infoskærm</h1>
      <Schedule schedules={schedules} />
      <ProgressVideo />
      <News news={news} />
    </article>
  );
};

export default Home;
