/* Startskærmen. Her samles infoskærmens moduler (ur, menu, nyheder, vejr ...).
   Data hentet af homeLoader (se DataLoaders.jsx) læses med useLoaderData():

     import { useLoaderData } from "react-router-dom";
     const data = useLoaderData();
*/
import { useLoaderData } from "react-router-dom";
import Schedule from "../components/scheduleComp/ScheduleComp";

import { ProgressVideo } from "../components/ProgressVideo/ProgressVideo";
import Time from "../components/timeDisplay/timeDisplay";

const Home = () => {
    const data = useLoaderData();

  return (
    <article className="home">
     <Time />
      <h1>Infoskærm</h1>
      <Schedule schedules={data.schedules} />
      <ProgressVideo />
    </article>
  );
};

export default Home;
