import React, { useState, useEffect } from "react";
import styles from "./TruthTableConfig.module.scss";

function TruthTableConfig({ points, onGenerate, onCancel }) {
  const inputPoints = points.filter((p) => p.type === "input");
  const outputPoints = points.filter((p) => p.type === "output");

  const [selectedInputs, setSelectedInputs] = useState(
    inputPoints.map((p) => p.id),
  );
  const [selectedOutputs, setSelectedOutputs] = useState(
    outputPoints.map((p) => p.id),
  );

  // Автоматично вибираємо всі точки при завантаженні
  useEffect(() => {
    setSelectedInputs(inputPoints.map((p) => p.id));
    setSelectedOutputs(outputPoints.map((p) => p.id));
  }, [points]);

  const toggleInput = (id) => {
    setSelectedInputs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleOutput = (id) => {
    setSelectedOutputs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleGenerate = () => {
    if (selectedInputs.length === 0) {
      alert("⚠️ Оберіть хоча б одну вхідну точку!");
      return;
    }

    if (selectedOutputs.length === 0) {
      alert("⚠️ Оберіть хоча б одну вихідну точку!");
      return;
    }

    const selectedInputPoints = inputPoints.filter((p) =>
      selectedInputs.includes(p.id),
    );
    const selectedOutputPoints = outputPoints.filter((p) =>
      selectedOutputs.includes(p.id),
    );

    onGenerate(selectedInputPoints, selectedOutputPoints);
  };

  const combinationsCount = Math.pow(2, selectedInputs.length);

  return (
    <div className={styles.config}>
      <h3>Налаштування таблиці істинності</h3>

      {/* Вхідні точки */}
      <div className={styles.section}>
        <h4>🔵 Вхідні точки (INPUT)</h4>
        {inputPoints.length === 0 ? (
          <p className={styles.noPoints}>
            Немає вхідних точок. Додайте їх на схему!
          </p>
        ) : (
          <div className={styles.pointsList}>
            {inputPoints.map((point) => (
              <label key={point.id} className={styles.pointItem}>
                <input
                  type="checkbox"
                  checked={selectedInputs.includes(point.id)}
                  onChange={() => toggleInput(point.id)}
                />
                <span className={styles.pointLabel}>{point.label}</span>
                <span className={styles.pointCoords}>
                  ({point.x}, {point.y})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Вихідні точки */}
      <div className={styles.section}>
        <h4>🟩 Вихідні точки (OUTPUT)</h4>
        {outputPoints.length === 0 ? (
          <p className={styles.noPoints}>
            Немає вихідних точок. Додайте їх на схему!
          </p>
        ) : (
          <div className={styles.pointsList}>
            {outputPoints.map((point) => (
              <label key={point.id} className={styles.pointItem}>
                <input
                  type="checkbox"
                  checked={selectedOutputs.includes(point.id)}
                  onChange={() => toggleOutput(point.id)}
                />
                <span className={styles.pointLabel}>{point.label}</span>
                <span className={styles.pointCoords}>
                  ({point.x}, {point.y})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Інформація */}
      <div className={styles.info}>
        <p>
          Обрано входів: <strong>{selectedInputs.length}</strong>
        </p>
        <p>
          Обрано виходів: <strong>{selectedOutputs.length}</strong>
        </p>
        <p>
          Комбінацій для перевірки: <strong>{combinationsCount}</strong>
        </p>
        {combinationsCount > 256 && (
          <p className={styles.warning}>
            ⚠️ Увага! Багато комбінацій, генерація може зайняти час.
          </p>
        )}
      </div>

      {/* Кнопки */}
      <div className={styles.buttons}>
        <button onClick={onCancel} className={styles.cancelBtn}>
          Скасувати
        </button>
        <button
          onClick={handleGenerate}
          className={styles.generateBtn}
          disabled={selectedInputs.length === 0 || selectedOutputs.length === 0}
        >
          📊 Згенерувати таблицю
        </button>
      </div>
    </div>
  );
}

export default TruthTableConfig;
