import { Link } from "react-router-dom";
import styles from "../scss/HomePage.module.scss";

function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.logoStatic}>
          <h1 className={styles.mainTitle}>
            <span className={styles.brandName}>Gatify</span>
          </h1>
          <p className={styles.heroTagline}>Digital Logic Circuit Simulator</p>
        </div>

        <p className={styles.description}>
          Професійна платформа для моделювання та симуляції
          <br />
          цифрових логічних схем з event-driven архітектурою
        </p>

        <Link to="/gatify" className={styles.launchBtn}>
          <span>Запустити редактор</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3L8.59 4.41 13.17 9H3v2h10.17l-4.58 4.59L10 17l7-7-7-7z" />
          </svg>
        </Link>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <img src="/GatifyEditor/flash.png" alt="" />
            </div>
            <h3>Event-Driven Simulation</h3>
            <p>Реалістична симуляція з propagation delay</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <img src="/GatifyEditor/icons/header/table.png" alt="" />
            </div>
            <h3>Truth Tables</h3>
            <p>Автоматична генерація таблиць істинності</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <img src="/GatifyEditor/icons/header/diagrams.png" alt="" />
            </div>
            <h3>Timing Diagrams</h3>
            <p>Часові діаграми з візуалізацією сигналів</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <img src="/GatifyEditor/windows.png" alt="" />
            </div>
            <h3>Floating Windows</h3>
            <p>Desktop-like інтерфейс</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
