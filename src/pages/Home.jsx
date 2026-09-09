/* Startskærmen. Her samles infoskærmens moduler (ur, menu, nyheder, vejr ...).
   Data hentet af homeLoader (se DataLoaders.jsx) læses med useLoaderData():

     import { useLoaderData } from "react-router-dom";
     const data = useLoaderData();
*/

import { ProgressVideo } from "../components/ProgressVideo/ProgressVideo";

const Home = () => {
  return (
    <article className='home'>
      <h1>Infoskærm</h1>
      <p>
        Skelettet er klar. Byg jeres moduler i <code>src/components/</code> og
        vis dem her.
      </p>

      <ProgressVideo />
    </article>
  );
};

export default Home;
