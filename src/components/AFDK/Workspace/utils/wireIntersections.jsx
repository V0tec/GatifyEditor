// Отримує кінцеву точку проводу
const getWireEndpoint = (wire) => {
  const WIRE_SEGMENT_LENGTH = 20;

  switch (wire.direction) {
    case "right":
      return { x: wire.x + WIRE_SEGMENT_LENGTH, y: wire.y };
    case "left":
      return { x: wire.x - WIRE_SEGMENT_LENGTH, y: wire.y };
    case "down":
      return { x: wire.x, y: wire.y + WIRE_SEGMENT_LENGTH };
    case "up":
      return { x: wire.x, y: wire.y - WIRE_SEGMENT_LENGTH };
    default:
      return { x: wire.x, y: wire.y };
  }
};

// Знаходить точку перетину двох проводів
export const findWireIntersection = (wire1, wire2) => {
  const w1Start = { x: wire1.x, y: wire1.y };
  const w1End = getWireEndpoint(wire1);

  const w2Start = { x: wire2.x, y: wire2.y };
  const w2End = getWireEndpoint(wire2);

  // Горизонтальний x вертикальний
  if (
    (wire1.direction === "right" || wire1.direction === "left") &&
    (wire2.direction === "down" || wire2.direction === "up")
  ) {
    const w1MinX = Math.min(w1Start.x, w1End.x);
    const w1MaxX = Math.max(w1Start.x, w1End.x);
    const w2MinY = Math.min(w2Start.y, w2End.y);
    const w2MaxY = Math.max(w2Start.y, w2End.y);

    if (
      w2Start.x >= w1MinX &&
      w2Start.x <= w1MaxX &&
      w1Start.y >= w2MinY &&
      w1Start.y <= w2MaxY
    ) {
      return { x: w2Start.x, y: w1Start.y };
    }
  }

  // Вертикальний x горизонтальний
  if (
    (wire1.direction === "down" || wire1.direction === "up") &&
    (wire2.direction === "right" || wire2.direction === "left")
  ) {
    const w1MinY = Math.min(w1Start.y, w1End.y);
    const w1MaxY = Math.max(w1Start.y, w1End.y);
    const w2MinX = Math.min(w2Start.x, w2End.x);
    const w2MaxX = Math.max(w2Start.x, w2End.x);

    if (
      w1Start.x >= w2MinX &&
      w1Start.x <= w2MaxX &&
      w2Start.y >= w1MinY &&
      w2Start.y <= w1MaxY
    ) {
      return { x: w1Start.x, y: w2Start.y };
    }
  }

  return null;
};

// Знаходить всі перетини проводів
export const findAllIntersections = (wires) => {
  const intersections = [];

  for (let i = 0; i < wires.length; i++) {
    for (let j = i + 1; j < wires.length; j++) {
      const point = findWireIntersection(wires[i], wires[j]);
      if (point) {
        // Перевіряємо чи вже є такий перетин
        const exists = intersections.find(
          (int) => int.x === point.x && int.y === point.y
        );

        if (exists) {
          // Додаємо проводи до існуючого перетину
          if (!exists.wires.includes(wires[i].id)) {
            exists.wires.push(wires[i].id);
          }
          if (!exists.wires.includes(wires[j].id)) {
            exists.wires.push(wires[j].id);
          }
        } else {
          // Створюємо новий перетин
          intersections.push({
            x: point.x,
            y: point.y,
            wires: [wires[i].id, wires[j].id],
          });
        }
      }
    }
  }

  return intersections;
};
