import React, { useState, useEffect, useCallback, useRef } from "react";
import PointSelector from "./PointSelector";
import DiagramCanvas from "./DiagramCanvas";
import { createTickFromPoints, exportToPNG } from "./timingDiagramUtils";
import styles from "./TimingDiagramModal.module.scss";

function TimingDiagramModal({
  isOpen,
  onClose,
  points,
  wires,
  junctions,
  components,
  onRunSimulation,
  onTogglePoint,
  simulationCounter, // ⭐ НОВИЙ ПРОП
  isSimulating,
}) {
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [ticks, setTicks] = useState([]);
  const shouldAddTick = useRef(false);

  // Додавання тіку з поточним станом точок
  const addCurrentStateTick = useCallback(() => {
    if (selectedPoints.length === 0) return;

    const newTick = createTickFromPoints(points, selectedPoints, ticks.length);

    selectedPoints.forEach((pointId) => {
      const point = points.find((p) => p.id === pointId);
      if (point) {
      }
    });

    setTicks((prev) => [...prev, newTick]);
  }, [points, selectedPoints, ticks.length]);

  // ⭐ ВИПРАВЛЕНО: useEffect спрацьовує на зміну simulationCounter
  useEffect(() => {
    if (shouldAddTick.current && selectedPoints.length > 0) {
      shouldAddTick.current = false;

      points.forEach((p) => {
        if (selectedPoints.includes(p.id)) {
        }
      });

      addCurrentStateTick();
    }
  }, [simulationCounter, addCurrentStateTick, selectedPoints, points]);
  //   ^^^^^^^^^^^^^^^^^ ⭐ Слухаємо лічильник симуляції

  // Обробка вибору/зняття точки
  const handleTogglePoint = (pointId) => {
    const point = points.find((p) => p.id === pointId);

    setSelectedPoints((prev) => {
      const isSelected = prev.includes(pointId);
      const newSelection = isSelected
        ? prev.filter((id) => id !== pointId)
        : [...prev, pointId];

      // Якщо це перша точка - додаємо початковий тік
      if (newSelection.length === 1 && ticks.length === 0) {
        setTimeout(() => {
          const initialTick = createTickFromPoints(points, newSelection, 0);
          setTicks([initialTick]);
        }, 50);
      }

      return newSelection;
    });
  };

  // Клік на INPUT точку - змінити значення
  const handlePointClick = (pointId) => {
    const point = points.find((p) => p.id === pointId);

    if (!point || point.type !== "input") {
      return;
    }

    // ⭐ ВСЯ ЛОГІКА В onTogglePoint:
    // - Змінює point.value
    // - Додає подію в чергу
    // - Автосимуляція обробляє
    onTogglePoint(pointId);

    // Ставимо прапорець для додавання тіку
    shouldAddTick.current = true;
  };

  // Обробка натискання пробілу
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (e.code === "Space" && selectedPoints.length > 0) {
        e.preventDefault();
        addCurrentStateTick();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, selectedPoints, addCurrentStateTick]);

  // Експорт в PNG
  const handleExportPNG = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      exportToPNG(canvas, `timing-diagram-${Date.now()}.png`);
    }
  };

  // Очистити діаграму
  const handleClear = () => {
    if (confirm("Очистити діаграму? Всі тіки будуть видалені.")) {
      setTicks([]);
      // Додаємо початковий тік знову
      if (selectedPoints.length > 0) {
        setTimeout(() => {
          const initialTick = createTickFromPoints(points, selectedPoints, 0);
          setTicks([initialTick]);
        }, 50);
      }
    }
  };

  // Закрити модалку
  const handleClose = () => {
    setSelectedPoints([]);
    setTicks([]);
    shouldAddTick.current = false;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>
          ✕
        </button>

        <h2 className={styles.title}>⏱️ Часові діаграми</h2>

        <div className={styles.content}>
          {/* Ліва панель - вибір точок */}
          <div className={styles.sidebar}>
            <PointSelector
              points={points}
              selectedPoints={selectedPoints}
              onTogglePoint={handleTogglePoint}
            />
          </div>

          {/* Права панель - Canvas */}
          <div className={styles.mainArea}>
            <DiagramCanvas
              points={points}
              selectedPoints={selectedPoints}
              ticks={ticks}
              onPointClick={handlePointClick}
            />

            {/* Кнопки управління */}
            {selectedPoints.length > 0 && (
              <div className={styles.controls}>
                <button onClick={handleClear} className={styles.clearBtn}>
                  🗑️ Очистити
                </button>
                <button onClick={handleExportPNG} className={styles.exportBtn}>
                  💾 Зберегти PNG
                </button>
                <div className={styles.stats}>
                  Тіків: <strong>{ticks.length}</strong> | Симуляцій:{" "}
                  <strong>{simulationCounter}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimingDiagramModal;
