import { useRef, useCallback } from "react";

/**
 * Hook для роботи з буфером обміну (Clipboard)
 * Обробляє Ctrl+C, Ctrl+V, Ctrl+X
 */
export const useClipboard = ({
  components,
  setComponents,
  wires,
  setWires,
  points,
  setPoints,
  selectedIds,
  selectedWireIds,
  selectedPointIds,
  setSelectedIds,
  setSelectedWireIds,
  setSelectedPointIds,
  getNextComponentId,
  getNextWireId,
  getNextPointId,
}) => {
  const clipboardRef = useRef({ components: [], wires: [], points: [] });

  /**
   * Копіювати виділені елементи в буфер
   */
  const copy = useCallback(() => {
    clipboardRef.current = {
      components: components
        .filter((c) => selectedIds.includes(c.id))
        .map(({ id, ...rest }) => ({ ...rest })),
      wires: wires
        .filter((w) => selectedWireIds.includes(w.id))
        .map(({ id, ...rest }) => ({ ...rest })),
      points: points
        .filter((p) => selectedPointIds.includes(p.id))
        .map(({ id, ...rest }) => ({ ...rest })),
    };
  }, [
    components,
    wires,
    points,
    selectedIds,
    selectedWireIds,
    selectedPointIds,
  ]);

  /**
   * Вирізати виділені елементи
   */
  const cut = useCallback(() => {
    copy();

    setComponents((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setWires((prev) => prev.filter((w) => !selectedWireIds.includes(w.id)));
    setPoints((prev) => prev.filter((p) => !selectedPointIds.includes(p.id)));

    setSelectedIds([]);
    setSelectedWireIds([]);
    setSelectedPointIds([]);
  }, [
    copy,
    setComponents,
    setWires,
    setPoints,
    selectedIds,
    selectedWireIds,
    selectedPointIds,
    setSelectedIds,
    setSelectedWireIds,
    setSelectedPointIds,
  ]);

  /**
   * ⭐ Вставити з буфера на задані координати
   */
  const paste = useCallback(
    (targetX, targetY) => {
      const { components: cC, wires: cW, points: cP } = clipboardRef.current;

      if (cC.length === 0 && cW.length === 0 && cP.length === 0) {
        return;
      }

      const allItems = [...cC, ...cW, ...cP];

      // ⭐ Якщо координати не передані, використовуємо offset 50px від оригіналу
      if (targetX === undefined || targetY === undefined) {
        const minX = Math.min(...allItems.map((i) => i.x || 0));
        const minY = Math.min(...allItems.map((i) => i.y || 0));

        const newComponents = cC.map((c) => ({
          ...c,
          id: getNextComponentId(),
          x: c.x - minX + 50,
          y: c.y - minY + 50,
        }));

        const newWires = cW.map((w) => ({
          ...w,
          id: getNextWireId(),
          x: w.x - minX + 50,
          y: w.y - minY + 50,
        }));

        const newPoints = cP.map((p) => ({
          ...p,
          id: getNextPointId(),
          x: p.x - minX + 50,
          y: p.y - minY + 50,
        }));

        setComponents((prev) => [...prev, ...newComponents]);
        setWires((prev) => [...prev, ...newWires]);
        setPoints((prev) => [...prev, ...newPoints]);

        setSelectedIds(newComponents.map((c) => c.id));
        setSelectedWireIds(newWires.map((w) => w.id));
        setSelectedPointIds(newPoints.map((p) => p.id));

        return;
      }

      // ⭐ ОБЧИСЛЮЄМО BOUNDING BOX (з урахуванням центрування точок)
      if (allItems.length === 0) {
        return;
      }

      const POINT_SIZE = 20; // Розмір точки

      const minX = Math.min(
        ...allItems.map((i) => {
          if (i.label) return i.x - POINT_SIZE / 2; // ⭐ Точка (віднімаємо половину)
          return i.x;
        }),
      );

      const maxX = Math.max(
        ...allItems.map((i) => {
          if (i.label) return i.x + POINT_SIZE / 2; // ⭐ Точка (додаємо половину)
          if (i.width) return i.x + i.width; // Компонент
          if (i.direction) return i.x + 20; // Провід
          return i.x;
        }),
      );

      const minY = Math.min(
        ...allItems.map((i) => {
          if (i.label) return i.y - POINT_SIZE / 2; // ⭐ Точка (віднімаємо половину)
          return i.y;
        }),
      );

      const maxY = Math.max(
        ...allItems.map((i) => {
          if (i.label) return i.y + POINT_SIZE / 2; // ⭐ Точка (додаємо половину)
          if (i.height) return i.y + i.height; // Компонент
          if (i.direction) return i.y + 20; // Провід
          return i.y;
        }),
      );

      // ⭐ ЦЕНТР ГРУПИ
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      // ⭐ OFFSET щоб центр був під мишею
      const offsetX = targetX - centerX;
      const offsetY = targetY - centerY;

      // ⭐ ВСІ ЕЛЕМЕНТИ (включаючи точки) зміщуємо однаково
      const newComponents = cC.map((c) => ({
        ...c,
        id: getNextComponentId(),
        x: c.x + offsetX,
        y: c.y + offsetY,
      }));

      const newWires = cW.map((w) => ({
        ...w,
        id: getNextWireId(),
        x: w.x + offsetX,
        y: w.y + offsetY,
      }));

      const newPoints = cP.map((p) => ({
        ...p,
        id: getNextPointId(),
        x: p.x + offsetX, // ⭐ Той самий offset що й інші!
        y: p.y + offsetY,
      }));

      setComponents((prev) => [...prev, ...newComponents]);
      setWires((prev) => [...prev, ...newWires]);
      setPoints((prev) => [...prev, ...newPoints]);

      // Виділяємо вставлені елементи
      setSelectedIds(newComponents.map((c) => c.id));
      setSelectedWireIds(newWires.map((w) => w.id));
      setSelectedPointIds(newPoints.map((p) => p.id));
    },
    [
      setComponents,
      setWires,
      setPoints,
      setSelectedIds,
      setSelectedWireIds,
      setSelectedPointIds,
      getNextComponentId,
      getNextWireId,
      getNextPointId,
    ],
  );

  /**
   * Перевірка чи є щось в буфері
   */
  const hasData = useCallback(() => {
    return (
      clipboardRef.current.components.length > 0 ||
      clipboardRef.current.wires.length > 0 ||
      clipboardRef.current.points.length > 0
    );
  }, []);

  /**
   * Очистити буфер
   */
  const clear = useCallback(() => {
    clipboardRef.current = { components: [], wires: [], points: [] };
  }, []);

  return {
    copy,
    cut,
    paste,
    hasData,
    clear,
    clipboardRef,
  };
};
