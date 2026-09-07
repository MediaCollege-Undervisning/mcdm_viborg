import { useState } from "react";
import { ScreenContext } from "./ScreenContext";

/* ScreenProvider holder fælles skærm-tilstand, som alle moduler kan dele -
   fx hvilket modul der er aktivt lige nu, når indholdet roterer på en timer.
   Provideren pakkes uden om hele appen (se main.jsx), så enhver komponent kan
   læse tilstanden via useScreenContext(). */

export const ScreenProvider = ({ children }) => {
  // TODO (code-along): udbyg med den tilstand jeres skærm har brug for.
  const [activeModule, setActiveModule] = useState(null);

  return (
    <ScreenContext.Provider value={{ activeModule, setActiveModule }}>
      {children}
    </ScreenContext.Provider>
  );
};
