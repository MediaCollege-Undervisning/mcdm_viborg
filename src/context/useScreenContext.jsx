import { useContext } from "react";
import { ScreenContext } from "./ScreenContext";

// Lille hjælpe-hook, så komponenter kan skrive useScreenContext() i stedet for
// useContext(ScreenContext).
export const useScreenContext = () => useContext(ScreenContext);
