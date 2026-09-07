import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./Routes";
import { ScreenProvider } from "./context/ScreenProvider";
import "./index.css";

/* RouterProvider er 'containeren' for hele projektet.
   Den fungerer som en 'provider', der renderer forskelligt indhold
   (vores moduler) baseret på url'en.

   ScreenProvider ligger udenom, så alle moduler kan dele fælles skærm-tilstand
   (fx hvilket modul der er aktivt lige nu). */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ScreenProvider>
      <RouterProvider router={routes} />
    </ScreenProvider>
  </StrictMode>
);
