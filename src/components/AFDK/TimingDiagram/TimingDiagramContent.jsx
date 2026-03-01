import React, { useState, useEffect, useCallback, useRef } from "react";
import PointSelector from "./PointSelector";
import DiagramCanvas from "./DiagramCanvas";
import { createTickFromPoints, exportToPNG } from "./timingDiagramUtils";
import styles from "./TimingDiagramContent.module.scss";

function TimingDiagramContent({
  points,
  wires,
  junctions,
  components,
  onRunSimulation,
  onTogglePoint,
  simulationCounter,
  isSimulating,
  selectedPoints,
  setSelectedPoints,
  ticks,
  setTicks,
  onClear,
}) {
  const shouldAddTick = useRef(false);
  const [, forceUpdate] = useState({});

  console.log("🔵 TimingDiagramContent RENDER:", {
    pointsCount: points.length,
    wiresCount: wires.length,
    componentsCount: components.length,
    selectedPointsCount: selectedPoints.length,
    ticksCount: ticks.length,
    simulationCounter,
  });

  // ⭐ ФОРСУЄМО РЕРЕНДЕР при зміні points, components
  useEffect(() => {
    console.log("🟢 TimingDiagramContent useEffect TRIGGERED!", {
      pointsCount: points.length,
      wiresCount: wires.length,
      componentsCount: components.length,
    });
    forceUpdate({});
  }, [points, wires, junctions, components]);

  // Додавання тіку з поточним станом точок
  const addCurrentStateTick = useCallback(() => {
    if (selectedPoints.length === 0) return;

    const newTick = createTickFromPoints(points, selectedPoints, ticks.length);
    setTicks((prev) => [...prev, newTick]);
  }, [points, selectedPoints, ticks.length, setTicks]);

  // ⭐ useEffect спрацьовує на зміну simulationCounter
  useEffect(() => {
    if (shouldAddTick.current && selectedPoints.length > 0) {
      shouldAddTick.current = false;
      addCurrentStateTick();
    }
  }, [simulationCounter, addCurrentStateTick, selectedPoints]);

  // Обробка вибору/зняття точки
  const handleTogglePoint = (pointId) => {
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

    // Змінюємо значення точки
    onTogglePoint(pointId);

    // ⭐ Ставимо прапорець - тік додасться ПІСЛЯ симуляції через useEffect
    shouldAddTick.current = true;
  };

  // Обробка натискання пробілу
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space" && selectedPoints.length > 0) {
        e.preventDefault();
        addCurrentStateTick();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedPoints, addCurrentStateTick]);

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
      onClear();

      // Додаємо початковий тік знову
      if (selectedPoints.length > 0) {
        setTimeout(() => {
          const initialTick = createTickFromPoints(points, selectedPoints, 0);
          setTicks([initialTick]);
        }, 50);
      }
    }
  };

  return (
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
              Тактів: <strong>{ticks.length}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimingDiagramContent;
