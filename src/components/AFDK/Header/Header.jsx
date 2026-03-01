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
  onOpenTimingDiagram,
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
    // Якщо клікнули на вже активний тип - ВИМИКАЄМО режим точок
    if (isPointMode && pointType === type) {
      onTogglePointMode();
      setShowPointDropdown(false);
    }
    // Якщо клікнули на інший тип - ПЕРЕМИКАЄМО тип
    else {
      onSetPointType(type);

      // Якщо режим точок НЕ активний - вмикаємо його
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
        <button
          onClick={onSave}
          className={styles.button}
          data-tooltip="Зберегти (Ctrl+S)"
        >
          <img
            className={styles.icon}
            src="/GatifyEditor/icons/header/save.png"
            alt="Зберегти"
          />
        </button>

        <button
          onClick={onLoad}
          className={styles.button}
          data-tooltip="Завантажити (Ctrl+L)"
        >
          <img
            className={styles.icon}
            src="/GatifyEditor/icons/header/download.png"
            alt="Завантажити"
          />
        </button>

        <button
          onClick={onClear}
          className={styles.button}
          data-tooltip="Очистити"
        >
          <img
            className={styles.icon}
            src="/GatifyEditor/icons/header/delete.png"
            alt="Очистити"
          />
        </button>
      </div>

      {/* Група 2: Режими */}
      <div className={styles.toolbarGroup}>
        <button
          onClick={onToggleWireMode}
          className={`${styles.button} ${isWireMode ? styles.active : ""}`}
          data-tooltip="Провід (Esc для виходу)"
        >
          <img
            className={styles.icon}
            src="/GatifyEditor/icons/header/wire.png"
            alt="Провід"
          />
        </button>

        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button
            onClick={handlePointButtonClick}
            className={`${styles.buttonWithText} ${isPointMode ? styles.active : ""}`}
          >
            <img
              className={styles.icon}
              src="/GatifyEditor/icons/header/point.png"
              alt="Точки"
            />
            Точки {showPointDropdown ? "▲" : "▼"}
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
        <button
          onClick={onToggleSimulation}
          className={styles.button}
          data-tooltip={isSimulating ? "Пауза" : "Запустити симуляцію"}
        >
          <img
            className={styles.icon}
            src={
              isSimulating
                ? "/GatifyEditor/icons/header/pause.png"
                : "/GatifyEditor/icons/header/play.png"
            }
            alt={isSimulating ? "Пауза" : "Симуляція"}
          />
        </button>

        <button
          onClick={onOpenTruthTable}
          className={styles.button}
          data-tooltip="Таблиця істинності"
        >
          <img
            className={styles.icon}
            src="/GatifyEditor/icons/header/table.png"
            alt="Таблиця істинності"
          />
        </button>

        <button
          onClick={onOpenTimingDiagram}
          className={styles.button}
          data-tooltip="Часові діаграми"
        >
          <img
            className={styles.icon}
            src="/GatifyEditor/icons/header/diagrams.png"
            alt="Часові діаграми"
          />
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
