import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import NotFound from "./pages/404";
import Loading from "./components/loading/Loading";
import ErrorElement from "./components/feedbackElements/ErrorElement";
import { homeLoader } from "./loaders/DataLoaders";

/* Her defineres alle ruter. Infoskærmen har INGEN synlig navigation - der er
   hverken mus eller touch. Ruterne bruges i stedet til at strukturere skærmens
   moduler, så de kan skiftes/roteres automatisk på en timer.

   Hver rute kan have:
     loader        → henter data FØR modulet vises (se DataLoaders.jsx)
     errorElement  → vises hvis loaderen fejler, så skærmen ikke vælter
   hydrateFallbackElement viser <Loading />, mens data hentes første gang. */

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />} hydrateFallbackElement={<Loading />}>
      <Route
        index
        element={<Home />}
        loader={homeLoader}
        errorElement={<ErrorElement />}
      />

      {/* TODO (code-along): tilføj et modul som en rute, fx temperaturen:
      <Route
        path='menu'
        element={<Menu />}
        loader={menuLoader}
        errorElement={<ErrorElement />}
      /> */}

      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

export default routes;
