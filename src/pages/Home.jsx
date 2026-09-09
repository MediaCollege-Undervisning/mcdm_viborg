/* Startskærmen. Her samles infoskærmens moduler (ur, menu, nyheder, vejr ...).
   Data hentet af homeLoader (se DataLoaders.jsx) læses med useLoaderData():

     import { useLoaderData } from "react-router-dom";
     const data = useLoaderData();
*/

import { useLoaderData } from "react-router-dom";
import News from "../components/news/News";

const Home = () => {

  const { news } = useLoaderData();

  return (
    <article className='home'>
      <News news={news} />
    </article>
  );
};

export default Home;
