/**
 * Створює тік з поточним станом точок
 */
export const createTickFromPoints = (points, selectedPointIds, tickNumber) => {
  const tick = {
    time: tickNumber,
    values: {},
  };

  selectedPointIds.forEach((pointId) => {
    const point = points.find((p) => p.id === pointId);
    if (point) {
      tick.values[pointId] = point.value;
    }
  });

  return tick;
};

/**
 * Експортує діаграму в PNG
 */
export const exportToPNG = (canvas, filename = "timing-diagram.png") => {
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  a.click();
};

/**
 * Отримує колір для точки залежно від типу
 */
export const getPointColor = (pointType) => {
  return pointType === "input" ? "#4CAF50" : "#FFC107"; // Зелений / Жовтий
};
