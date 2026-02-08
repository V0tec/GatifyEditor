import { useState, useCallback } from "react";

const WIRE_SEGMENT_LENGTH = 20;

export function useWires(wires, setWires, snapToHalfGrid) {
  const [isDrawingWire, setIsDrawingWire] = useState(false);
  const [currentWireStart, setCurrentWireStart] = useState(null);
  const [previewWire, setPreviewWire] = useState([]);

  const createWireSegments = useCallback((from, to, wireGroupId) => {
    const segments = [];

    // Вертикальна лінія
    if (from.x === to.x) {
      const minY = Math.min(from.y, to.y);
      const maxY = Math.max(from.y, to.y);

      for (let y = minY; y < maxY; y += WIRE_SEGMENT_LENGTH) {
        segments.push({
          id: `temp-${Date.now()}-${segments.length}`,
          wireGroupId,
          x: from.x,
          y,
          direction: "down",
        });
      }
    }
    // Горизонтальна лінія
    else if (from.y === to.y) {
      const minX = Math.min(from.x, to.x);
      const maxX = Math.max(from.x, to.x);

      for (let x = minX; x < maxX; x += WIRE_SEGMENT_LENGTH) {
        segments.push({
          id: `temp-${Date.now()}-${segments.length}`,
          wireGroupId,
          x,
          y: from.y,
          direction: "right",
        });
      }
    }
    // L-подібна лінія
    else {
      // Горизонтальна частина
      const minX = Math.min(from.x, to.x);
      const maxX = Math.max(from.x, to.x);
      for (let x = minX; x < maxX; x += WIRE_SEGMENT_LENGTH) {
        segments.push({
          id: `temp-${Date.now()}-${segments.length}`,
          wireGroupId,
          x,
          y: from.y,
          direction: "right",
        });
      }
      // Вертикальна частина
      const minY = Math.min(from.y, to.y);
      const maxY = Math.max(from.y, to.y);
      for (let y = minY; y < maxY; y += WIRE_SEGMENT_LENGTH) {
        segments.push({
          id: `temp-${Date.now()}-${segments.length}`,
          wireGroupId,
          x: to.x,
          y,
          direction: "down",
        });
      }
    }

    return segments;
  }, []);

  const startDrawingWire = useCallback(
    (x, y) => {
      const snapped = { x: snapToHalfGrid(x), y: snapToHalfGrid(y) };

      setIsDrawingWire(true);
      setCurrentWireStart(snapped);
      setPreviewWire([]);
    },
    [snapToHalfGrid],
  );

  const updateWirePreview = useCallback(
    (x, y) => {
      if (!isDrawingWire || !currentWireStart) return;

      const snapped = { x: snapToHalfGrid(x), y: snapToHalfGrid(y) };

      const isSameCell =
        snapped.x === currentWireStart.x && snapped.y === currentWireStart.y;

      if (isSameCell) {
        setPreviewWire([]);
        return;
      }

      const segments = createWireSegments(currentWireStart, snapped, 0);
      setPreviewWire(segments);
    },
    [isDrawingWire, currentWireStart, snapToHalfGrid, createWireSegments],
  );

  const finishDrawingWire = useCallback(() => {
    if (!isDrawingWire || !previewWire || previewWire.length === 0) {
      setIsDrawingWire(false);
      setCurrentWireStart(null);
      setPreviewWire([]);
      return;
    }

    // ⭐ РОЗБИВАЄМО НА ОКРЕМІ ПРОВОДИ ПО DIRECTION
    const wireParts = [];
    let currentPart = [previewWire[0]];
    let currentDirection = previewWire[0].direction;

    for (let i = 1; i < previewWire.length; i++) {
      if (previewWire[i].direction === currentDirection) {
        currentPart.push(previewWire[i]);
      } else {
        wireParts.push(currentPart);
        currentPart = [previewWire[i]];
        currentDirection = previewWire[i].direction;
      }
    }
    wireParts.push(currentPart);

    // ⭐ КОЖНА ЧАСТИНА = ОКРЕМИЙ ПРОВІД
    const allWires = [];

    wireParts.forEach((part, partIndex) => {
      const firstSegment = part[0];
      const startX = firstSegment.x;
      const startY = firstSegment.y;

      // Шукаємо існуючий провід на точці старту цієї частини
      const existingWireAtStart = wires.find((wire) => {
        const wireEndX = wire.direction === "right" ? wire.x + 20 : wire.x;
        const wireEndY = wire.direction === "down" ? wire.y + 20 : wire.y;

        return (
          (wireEndX === startX && wireEndY === startY) ||
          (wire.x === startX && wire.y === startY)
        );
      });

      let wireGroupId;

      // Якщо знайшли існуючий провід і напрямок співпадає
      if (
        existingWireAtStart &&
        existingWireAtStart.direction === firstSegment.direction
      ) {
        wireGroupId = existingWireAtStart.wireGroupId;
      } else {
        // ⭐ Для кожної частини своє унікальне число
        const baseTime = Date.now();
        wireGroupId = baseTime + partIndex * 1000;
      }

      // ⭐ ВИПРАВЛЕНО: ID для кожного сегмента УНІКАЛЬНИЙ
      const timestamp = Date.now();
      const partWires = part.map((segment, segIndex) => ({
        ...segment,
        id: `wire-${wireGroupId}-${timestamp}-${segIndex}`,
        wireGroupId: wireGroupId,
        active: false,
      }));

      // Додаємо wireStart та wireEnd для цього проводу
      const firstSeg = partWires[0];
      const lastSeg = partWires[partWires.length - 1];

      const wireStart = { x: firstSeg.x, y: firstSeg.y };
      const wireEnd = {
        x: firstSeg.direction === "right" ? lastSeg.x + 20 : firstSeg.x,
        y: firstSeg.direction === "down" ? lastSeg.y + 20 : firstSeg.y,
      };

      const wiresWithEndpoints = partWires.map((seg) => ({
        ...seg,
        wireStart,
        wireEnd,
      }));

      allWires.push(...wiresWithEndpoints);
    });

    // ⭐ ОНОВЛЮЄМО WIRES З ПЕРЕРАХУНКОМ wireStart/wireEnd ДЛЯ ГРУП
    setWires((prev) => {
      const updated = [...prev, ...allWires];

      // Збираємо всі групи, які потрібно перерахувати
      const groupsToRecalculate = new Set();
      allWires.forEach((wire) => groupsToRecalculate.add(wire.wireGroupId));

      return updated.map((wire) => {
        if (!groupsToRecalculate.has(wire.wireGroupId)) return wire;

        // Знаходимо всі дроти цієї групи
        const groupWires = updated.filter(
          (w) => w.wireGroupId === wire.wireGroupId,
        );

        // Знаходимо мінімальні та максимальні координати
        const allX = groupWires.map((w) => w.x);
        const allY = groupWires.map((w) => w.y);

        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = Math.min(...allY);
        const maxY = Math.max(...allY);

        // Оновлюємо wireStart/wireEnd в залежності від напрямку
        let newWireStart, newWireEnd;

        if (wire.direction === "right") {
          newWireStart = { x: minX, y: wire.y };
          newWireEnd = { x: maxX + 20, y: wire.y };
        } else {
          newWireStart = { x: wire.x, y: minY };
          newWireEnd = { x: wire.x, y: maxY + 20 };
        }

        return {
          ...wire,
          wireStart: newWireStart,
          wireEnd: newWireEnd,
        };
      });
    });

    setIsDrawingWire(false);
    setCurrentWireStart(null);
    setPreviewWire([]);
  }, [isDrawingWire, previewWire, setWires, currentWireStart, wires]);

  const cancelDrawingWire = useCallback(() => {
    setIsDrawingWire(false);
    setCurrentWireStart(null);
    setPreviewWire([]);
  }, []);

  const recalculateWireEndpoints = useCallback(
    (wireGroupIds) => {
      setWires((prev) => {
        return prev.map((wire) => {
          if (!wireGroupIds.includes(wire.wireGroupId)) return wire;

          // Знаходимо всі дроти цієї групи
          const groupWires = prev.filter(
            (w) => w.wireGroupId === wire.wireGroupId,
          );

          // Знаходимо мінімальні та максимальні координати
          const allX = groupWires.map((w) => w.x);
          const allY = groupWires.map((w) => w.y);

          const minX = Math.min(...allX);
          const maxX = Math.max(...allX);
          const minY = Math.min(...allY);
          const maxY = Math.max(...allY);

          // Оновлюємо wireStart/wireEnd в залежності від напрямку
          let newWireStart, newWireEnd;

          if (wire.direction === "right" || wire.direction === "left") {
            newWireStart = { x: minX, y: wire.y };
            newWireEnd = { x: maxX + 20, y: wire.y };
          } else {
            newWireStart = { x: wire.x, y: minY };
            newWireEnd = { x: wire.x, y: maxY + 20 };
          }

          return {
            ...wire,
            wireStart: newWireStart,
            wireEnd: newWireEnd,
          };
        });
      });
    },
    [setWires],
  );

  // ⭐ ЗМІНИТИ return:
  return {
    isDrawingWire,
    currentWireStart,
    previewWire,
    startDrawingWire,
    updateWirePreview,
    finishDrawingWire,
    cancelDrawingWire,
    recalculateWireEndpoints, // ⭐ ДОДАНО
  };
}
