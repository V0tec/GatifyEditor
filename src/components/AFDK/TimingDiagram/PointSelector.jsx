import React from "react";
import styles from "./PointSelector.module.scss";

function PointSelector({ points, selectedPoints, onTogglePoint }) {
  const inputPoints = points.filter((p) => p.type === "input");
  const outputPoints = points.filter((p) => p.type === "output");

  return (
    <div className={styles.pointSelector}>
      <h4>Оберіть точки для відображення:</h4>

      {inputPoints.length > 0 && (
        <div className={styles.section}>
          <h5>🟢 Вхідні сигнали (INPUT)</h5>
          <div className={styles.pointsList}>
            {inputPoints.map((point) => (
              <label key={point.id} className={styles.pointItem}>
                <input
                  type="checkbox"
                  checked={selectedPoints.includes(point.id)}
                  onChange={() => onTogglePoint(point.id)}
                />
                <span
                  className={styles.pointLabel}
                  style={{ color: "#4CAF50" }}
                >
                  {point.label}
                </span>
                <span className={styles.pointValue}>
                  (поточне значення: {point.value})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {outputPoints.length > 0 && (
        <div className={styles.section}>
          <h5>🟡 Вихідні сигнали (OUTPUT)</h5>
          <div className={styles.pointsList}>
            {outputPoints.map((point) => (
              <label key={point.id} className={styles.pointItem}>
                <input
                  type="checkbox"
                  checked={selectedPoints.includes(point.id)}
                  onChange={() => onTogglePoint(point.id)}
                />
                <span
                  className={styles.pointLabel}
                  style={{ color: "#FFC107" }}
                >
                  {point.label}
                </span>
                <span className={styles.pointValue}>
                  (поточне значення: {point.value})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {points.length === 0 && (
        <p className={styles.noPoints}>
          Немає точок на схемі. Додайте INPUT/OUTPUT точки!
        </p>
      )}

      {selectedPoints.length > 0 && (
        <div className={styles.info}>
          <p>
            Обрано точок: <strong>{selectedPoints.length}</strong>
          </p>
          <p className={styles.hint}>
            💡 Клікайте на зелені точки щоб змінити їх значення
          </p>
          <p className={styles.hint}>
            ⌨️ Натисніть пробіл щоб зафіксувати поточний стан
          </p>
        </div>
      )}
    </div>
  );
}

export default PointSelector;
