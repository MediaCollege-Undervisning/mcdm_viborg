import { useRouteError } from "react-router-dom";
import styles from "./errorElement.module.css";

/* Vises via 'errorElement' på vores ruter, hvis en loader fejler.
   På en infoskærm er det vigtigt, at ét modul der fejler IKKE vælter hele
   skærmen - derfor viser vi bare en neutral besked, mens resten kører videre.
   useRouteError() giver os fejlen. */

const ErrorElement = () => {
  const error = useRouteError();
  return (
    <section className={styles.error}>
      <h2>Modulet er ikke tilgængeligt lige nu</h2>
      <p>{error?.data || error?.message || "Prøver igen om lidt."}</p>
    </section>
  );
};

export default ErrorElement;
