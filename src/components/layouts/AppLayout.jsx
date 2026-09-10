import { Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
import Loading from "../loading/Loading";

/* Hele projektet: #root --> .app --> .screen --> <Outlet />
   <Outlet /> renderer det aktive modul (defineret i Routes.jsx).

   Bemærk: Infoskærmen har INGEN navigation, footer eller knapper - derfor
   holder layoutet sig bevidst simpelt. Alt indhold skal kunne læses på afstand
   og fylde hele skærmen (1920×1080). */

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="app">
      <main className="screen">
        {isLoading ? <Loading /> : <Outlet />}
        <ScrollRestoration />
      </main>
    </div>
  );
};

export default AppLayout;
