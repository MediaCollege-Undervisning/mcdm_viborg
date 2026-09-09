/* Startskærmen. Her samles infoskærmens moduler (ur, menu, nyheder, vejr ...).
   Data hentet af homeLoader (se DataLoaders.jsx) læses med useLoaderData():

     import { useLoaderData } from "react-router-dom";
     const data = useLoaderData();
*/

import Time from "../components/timeDisplay/timeDisplay";

const Home = () => {
  return (
    <article className="home">
      <h1>Infoskærm – Mediacollege Viborg</h1>
      <Time />
    </article>
  );
};

export default Home;
