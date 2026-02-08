import { useState, useCallback } from "react";

export function useJunctions() {
  const [junctions, setJunctions] = useState([]);

  const calculateJunctions = useCallback((wires) => {
    if (!wires || wires.length === 0) return [];

    // Групуємо дроти по wireGroupId
    const groups = {};
    wires.forEach((wire) => {
      if (!groups[wire.wireGroupId]) {
        groups[wire.wireGroupId] = {
          wireGroupId: wire.wireGroupId,
          wireStart: wire.wireStart,
          wireEnd: wire.wireEnd,
          direction: wire.direction,
        };
      }
    });

    const groupArray = Object.values(groups);

    // ⭐ КРОК 1: Знаходимо всі точки де дроти перетинаються
    const pointsMap = new Map(); // key: "x,y" → value: Set of wireGroupIds

    for (let i = 0; i < groupArray.length; i++) {
      for (let j = i + 1; j < groupArray.length; j++) {
        const wire1 = groupArray[i];
        const wire2 = groupArray[j];

        // Горизонтальний + вертикальний
        const isWire1Horizontal = wire1.direction === "right";
        const isWire1Vertical = wire1.direction === "down";
        const isWire2Horizontal = wire2.direction === "right";
        const isWire2Vertical = wire2.direction === "down";

        if (
          !(isWire1Horizontal && isWire2Vertical) &&
          !(isWire1Vertical && isWire2Horizontal)
        ) {
          continue;
        }

        let horizontal, vertical;
        if (isWire1Horizontal) {
          horizontal = wire1;
          vertical = wire2;
        } else {
          horizontal = wire2;
          vertical = wire1;
        }

        // Точка перетину
        const intersectX = vertical.wireStart.x;
        const intersectY = horizontal.wireStart.y;

        // Перевірка діапазонів
        const hMinX = Math.min(horizontal.wireStart.x, horizontal.wireEnd.x);
        const hMaxX = Math.max(horizontal.wireStart.x, horizontal.wireEnd.x);
        const vMinY = Math.min(vertical.wireStart.y, vertical.wireEnd.y);
        const vMaxY = Math.max(vertical.wireStart.y, vertical.wireEnd.y);

        if (
          intersectX >= hMinX &&
          intersectX <= hMaxX &&
          intersectY >= vMinY &&
          intersectY <= vMaxY
        ) {
          const key = `${intersectX},${intersectY}`;

          if (!pointsMap.has(key)) {
            pointsMap.set(key, new Set());
          }

          pointsMap.get(key).add(wire1.wireGroupId);
          pointsMap.get(key).add(wire2.wireGroupId);
        }
      }
    }

    // ⭐ КРОК 2: Для кожної точки перевіряємо скільки груп
    const junctionsMap = new Map();

    pointsMap.forEach((groupIds, key) => {
      const [x, y] = key.split(",").map(Number);
      const point = { x, y };

      // Рахуємо скільки кінців/початків в цій точці
      let endpointsCount = 0;
      const groupsArray = Array.from(groupIds);

      groupsArray.forEach((groupId) => {
        const wire = groupArray.find((w) => w.wireGroupId === groupId);
        if (!wire) return;

        const isStart =
          point.x === wire.wireStart.x && point.y === wire.wireStart.y;
        const isEnd = point.x === wire.wireEnd.x && point.y === wire.wireEnd.y;

        if (isStart || isEnd) {
          endpointsCount++;
        }
      });

      // ⭐ ЛОГІКА JUNCTION:
      // - Якщо 3+ групи → завжди junction (Т-подібне з'єднання)
      // - Якщо 2 групи і НЕ обидва кінці/початки → junction
      if (groupIds.size >= 3) {
        junctionsMap.set(key, {
          id: key,
          x,
          y,
          wireGroups: Array.from(groupIds), // ← ДОДАЛИ!
        });
      } else if (groupIds.size === 2) {
        // Перевіряємо чи це не просте продовження (2 кінці або 2 початки)
        const wire1 = groupArray.find((w) => w.wireGroupId === groupsArray[0]);
        const wire2 = groupArray.find((w) => w.wireGroupId === groupsArray[1]);

        const isWire1Start =
          point.x === wire1.wireStart.x && point.y === wire1.wireStart.y;
        const isWire1End =
          point.x === wire1.wireEnd.x && point.y === wire1.wireEnd.y;
        const isWire2Start =
          point.x === wire2.wireStart.x && point.y === wire2.wireStart.y;
        const isWire2End =
          point.x === wire2.wireEnd.x && point.y === wire2.wireEnd.y;

        // Якщо обидва початки або обидва кінці → продовження
        const isContinuation =
          (isWire1Start && isWire2Start) ||
          (isWire1End && isWire2End) ||
          (isWire1Start && isWire2End) ||
          (isWire1End && isWire2Start);

        if (
          !isContinuation &&
          (isWire1Start || isWire1End || isWire2Start || isWire2End)
        ) {
          junctionsMap.set(key, {
            id: key,
            x,
            y,
            wireGroups: Array.from(groupIds), // ← ДОДАЛИ!
          });
        }
      }
    });

    return Array.from(junctionsMap.values());
  }, []);

  return {
    junctions,
    setJunctions,
    calculateJunctions,
  };
}
