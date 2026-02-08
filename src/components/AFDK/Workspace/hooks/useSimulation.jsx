import { useState, useEffect, useCallback } from "react";
import { propagateSignalFromPoints } from "../utils/signalPropagation";

export const useSimulation = ({
  components,
  setComponents,
  points,
  setPoints,
  wires,
  setWires,
  junctions,
  isSimulating,
  onNotification, // ⭐ ДОДАЛИ ПАРАМЕТР
}) => {
  const [connections, setConnections] = useState([]);

  const runSingleSimulation = useCallback(() => {
    const result = propagateSignalFromPoints(
      points,
      wires,
      junctions,
      components,
    );

    // ⭐ ПЕРЕВІРЯЄМО КОНФЛІКТИ ТА ПОКАЗУЄМО ПОВІДОМЛЕННЯ
    if (result.conflicts && result.conflicts.length > 0) {
      const uniqueGroups = [...new Set(result.conflicts.map((c) => c.groupId))];

      if (onNotification) {
        // ⭐ ВИПРАВЛЕНО: передаємо два параметри, а не об'єкт
        onNotification(
          `⚠️ Небезпечна схема! Виявлено конфлікт сигналів у ${uniqueGroups.length} ${uniqueGroups.length === 1 ? "місці" : "місцях"}. Два виходи не можна з'єднувати напряму - це може пошкодити компоненти!`,
          "error",
        );
      }
    }

    // Оновлюємо стан
    setWires(result.wires);
    setComponents(result.components);

    // ⭐ Оновлюємо OUTPUT точки
    setPoints((prev) =>
      prev.map((point) => {
        if (point.type !== "output") return point;

        const TOUCH_THRESHOLD = 5;

        // ⭐ СПОЧАТКУ ПЕРЕВІРЯЄМО МІНІ-ПРОВОДИ КОМПОНЕНТІВ
        for (const comp of result.components) {
          for (const output of comp.outputs) {
            // Координати КІНЦЯ міні-проводу виходу
            const outputWorldX = comp.x + output.wireEndX + comp.width / 2;
            const outputWorldY = comp.y + output.wireEndY + comp.height / 2;

            const touchesMiniWire =
              Math.abs(point.x - outputWorldX) < TOUCH_THRESHOLD &&
              Math.abs(point.y - outputWorldY) < TOUCH_THRESHOLD;

            if (touchesMiniWire && output.connected) {
              return { ...point, value: output.value };
            }
          }
        }

        // ⭐ ЯКЩО НЕ ЗНАЙШЛИ МІНІ-ПРОВІД - ПЕРЕВІРЯЄМО ЗВИЧАЙНІ ПРОВОДИ
        const touchingWire = result.wires.find((wire) => {
          const wireStart = wire.wireStart || { x: wire.x, y: wire.y };
          const wireEnd = wire.wireEnd || { x: wire.x, y: wire.y };

          const touchesStart =
            Math.abs(point.x - wireStart.x) < TOUCH_THRESHOLD &&
            Math.abs(point.y - wireStart.y) < TOUCH_THRESHOLD;

          const touchesEnd =
            Math.abs(point.x - wireEnd.x) < TOUCH_THRESHOLD &&
            Math.abs(point.y - wireEnd.y) < TOUCH_THRESHOLD;

          return touchesStart || touchesEnd;
        });

        if (touchingWire && touchingWire.active) {
          return { ...point, value: touchingWire.value };
        }

        // Якщо нічого не знайшли - залишаємо 0
        return { ...point, value: 0 };
      }),
    );
  }, [
    points,
    wires,
    junctions,
    components,
    setWires,
    setComponents,
    setPoints,
    onNotification, // ⭐ ДОДАЛИ В ЗАЛЕЖНОСТІ
  ]);

  // Реєстрація для Header
  useEffect(() => {
    window.__runWorkspaceSimulation = runSingleSimulation;
    return () => {
      delete window.__runWorkspaceSimulation;
    };
  }, [runSingleSimulation]);

  // Автоматична симуляція
  useEffect(() => {
    if (!isSimulating) return;
    runSingleSimulation();
  }, [points, wires, junctions, components, isSimulating, runSingleSimulation]);

  return {
    connections,
    setConnections,
    runSingleSimulation,
  };
};
