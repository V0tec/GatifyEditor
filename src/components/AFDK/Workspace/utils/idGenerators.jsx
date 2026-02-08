import { useRef, useCallback } from "react";

/**
 * Hook для управління ID генераторами
 */
export const useIdGenerators = (components = [], wires = [], points = []) => {
  const componentIdRef = useRef(0);
  const wireIdRef = useRef(0);
  const pointIdRef = useRef(0);

  // Синхронізація з існуючими даними
  const syncIds = useCallback(() => {
    if (components.length > 0) {
      const maxId = Math.max(...components.map((c) => c.id || 0));
      componentIdRef.current = Math.max(componentIdRef.current, maxId);
    }
    // ⭐ Для точок витягуємо число після "point-"
    if (points.length > 0) {
      const maxId = Math.max(
        ...points.map((p) => {
          if (typeof p.id === "string" && p.id.startsWith("point-")) {
            return parseInt(p.id.split("-")[1]) || 0;
          }
          return 0;
        }),
      );
      pointIdRef.current = Math.max(pointIdRef.current, maxId);
    }
  }, [components, wires, points]);

  const getNextComponentId = useCallback(() => {
    return ++componentIdRef.current;
  }, []);

  const getNextWireId = useCallback(() => {
    const timestamp = Date.now();
    const uniqueId = ++wireIdRef.current;
    // ⭐ Генеруємо ID у форматі як при малюванні: wire-groupId-timestamp-index
    // groupId та timestamp - один і той же для простоти
    return `wire-${timestamp}-${uniqueId}-0`;
  }, []);

  const getNextPointId = useCallback(() => {
    // ⭐ Точки мають префікс "point-" щоб не конфліктувати з components
    return `point-${++pointIdRef.current}`;
  }, []);

  return {
    getNextComponentId,
    getNextWireId,
    getNextPointId,
    syncIds,
  };
};
