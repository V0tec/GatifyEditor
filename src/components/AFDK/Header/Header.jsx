import { useState, useRef, useEffect } from "react";
import styles from "./Header.module.scss";

function Header({
  onSave,
  onLoad,
  onToggleWireMode,
  isWireMode,
  onTogglePointMode,
  isPointMode,
  pointType,
  onSetPointType,
  onRunSimulation,
  onToggleSimulation,
  isSimulating,
  onOpenTruthTable,
  onOpenTimingDiagram, // ⭐ НОВИЙ ПРОПС
  onClear,
  zoom,
}) {
  const [showPointDropdown, setShowPointDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPointDropdown(false);
      }
    };

    if (showPointDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPointDropdown]);

  const handlePointButtonClick = () => {
    setShowPointDropdown(!showPointDropdown);
  };

  const handleSelectPointType = (type) => {
    // ⭐ Якщо клікнули на вже активний тип - ВИМИКАЄМО режим точок
    if (isPointMode && pointType === type) {
      onTogglePointMode(); // Вимикає режим
      setShowPointDropdown(false);
    }
    // ⭐ Якщо клікнули на інший тип - ПЕРЕМИКАЄМО тип
    else {
      onSetPointType(type); // Встановлюємо новий тип

      // ⭐ Якщо режим точок НЕ активний - вмикаємо його
      if (!isPointMode) {
        onTogglePointMode();
      }

      setShowPointDropdown(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Gatify Editor</h1>
      </div>
      {/* Група 1: Файли */}
      <div className={styles.toolbarGroup}>
        <button onClick={onSave} title="Ctrl+S" className={styles.button}>
          💾 Зберегти
        </button>
        <button onClick={onLoad} title="Ctrl+L" className={styles.button}>
          📂 Завантажити
        </button>
        <button onClick={onClear} className={styles.button}>
          🗑️ Очистити
        </button>
      </div>
      {/* Група 2: Режими */}
      <div className={styles.toolbarGroup}>
        <button
          onClick={onToggleWireMode}
          className={`${styles.button} ${isWireMode ? styles.active : ""}`}
        >
          🔌 Провід
        </button>

        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button
            onClick={handlePointButtonClick}
            className={`${styles.button} ${isPointMode ? styles.active : ""}`}
          >
            📍 Точки {showPointDropdown ? "▲" : "▼"}
          </button>

          {showPointDropdown && (
            <div className={styles.dropdown}>
              <button
                className={`${styles.dropdownItem} ${
                  isPointMode && pointType === "input" ? styles.active : ""
                }`}
                onClick={() => handleSelectPointType("input")}
              >
                🔵 Вхідна точка
              </button>
              <button
                className={`${styles.dropdownItem} ${
                  isPointMode && pointType === "output" ? styles.active : ""
                }`}
                onClick={() => handleSelectPointType("output")}
              >
                🟩 Вихідна точка
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Група 3: Симуляція */}
      <div className={styles.toolbarGroup}>
        <button onClick={onRunSimulation} className={styles.button}>
          ▶ Запуск
        </button>
        <button onClick={onToggleSimulation} className={styles.button}>
          {isSimulating ? "⏸" : "⏯"} Авто
        </button>
        <button onClick={onOpenTruthTable} className={styles.button}>
          📊 Таблиця істинності
        </button>
        {/* ⭐ НОВА КНОПКА ДЛЯ ЧАСОВИХ ДІАГРАМ */}
        <button onClick={onOpenTimingDiagram} className={styles.button}>
          ⏱️ Часові діаграми
        </button>
      </div>
      {/* Інфо */}
      <div className={styles.headerInfo}>
        Zoom: {Math.round(zoom * 100)}%{isWireMode && " | Режим проводу"}
        {isPointMode &&
          ` | Режим точок (${pointType === "input" ? "Вхідна" : "Вихідна"})`}
      </div>
    </header>
  );
}

export default Header;
