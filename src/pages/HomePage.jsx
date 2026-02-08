import { Link } from "react-router-dom";
import styles from "../scss/HomePage.module.scss";

function HomePage() {
  return (
    <div className={styles.home}>
      <h1>Моделюючий комплекс</h1>
      <p>Оберіть інструмент:</p>
      <Link to="/gatify">Перейти до Gatify</Link>
    </div>
  );
}

export default HomePage;
