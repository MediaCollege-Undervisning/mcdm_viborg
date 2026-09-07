import { PulseLoader } from "react-spinners";
import styles from "./loading.module.css";

// Vises som 'hydrateFallbackElement', mens vores loaders henter data.
const Loading = () => {
  return (
    <div className={styles.loading}>
      <PulseLoader color='#ffffff' />
    </div>
  );
};

export default Loading;
