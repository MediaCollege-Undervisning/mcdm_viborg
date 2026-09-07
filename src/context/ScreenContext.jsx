import { createContext } from "react";

/* Selve context-objektet ligger i sin egen fil (adskilt fra ScreenProvider),
   så Vites "fast refresh" fungerer korrekt. Provideren findes i
   ScreenProvider.jsx. */
export const ScreenContext = createContext();
