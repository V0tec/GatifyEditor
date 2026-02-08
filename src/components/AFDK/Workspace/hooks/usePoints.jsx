import { useCallback } from "react";

export function usePoints(
  points,
  setPoints,
  screenToWorkspace,
  isPointMode,
  pointType, // ⭐ ДОДАНО - тип точки що створюється
  snapToHalfGrid,
  getNextPointId,
) {
  // Зміна назви
  const handlePointLabelChange = useCallback(
    (pointId, newLabel) => {
      setPoints((prev) =>
        prev.map((p) => (p.id === pointId ? { ...p, label: newLabel } : p)),
      );
    },
    [setPoints],
  );

  // ⭐ Перемикання значення INPUT точки
  const handlePointToggle = useCallback(
    (pointId) => {
      setPoints((prev) =>
        prev.map((p) => {
          if (p.id === pointId && p.type === "input") {
            return { ...p, value: p.value === 1 ? 0 : 1 };
          }
          return p;
        }),
      );
    },
    [setPoints],
  );

  // Створення нової точки з типом
  const createPointAtCoords = useCallback(
    (e) => {
      if (!isPointMode || !pointType) return;

      const coords = screenToWorkspace(e.clientX, e.clientY);
      const x = snapToHalfGrid(coords.x);
      const y = snapToHalfGrid(coords.y);

      const newPoint = {
        id: getNextPointId(),
        x,
        y,
        label: String.fromCharCode(65 + points.length),
        value: pointType === "input" ? 1 : 0, // INPUT = 1, OUTPUT = 0 (поки не отримає сигнал)
        type: pointType, // ⭐ ДОДАНО тип точки
      };

      setPoints((prev) => [...prev, newPoint]);
    },
    [
      isPointMode,
      pointType,
      screenToWorkspace,
      points.length,
      getNextPointId,
      setPoints,
      snapToHalfGrid,
    ],
  );

  return {
    handlePointLabelChange,
    handlePointToggle, // ⭐ ДОДАНО
    createPointAtCoords,
  };
}
