/**
 * Утиліти для роботи з координатами та сіткою
 */

/**
 * Прив'язка координати до половини сітки
 */
export const snapToHalfGrid = (coord, HALF_GRID) => {
  return Math.round(coord / HALF_GRID) * HALF_GRID;
};

/**
 * Прив'язка координати до повної сітки
 */
export const snapToGrid = (coord, GRID_SIZE) => {
  return Math.round(coord / GRID_SIZE) * GRID_SIZE;
};

/**
 * Конвертація екранних координат у координати робочої зони
 */
export const createScreenToWorkspace = (workspaceContentRef, zoom) => {
  return (screenX, screenY, rect = null) => {
    const bounds = rect || workspaceContentRef.current?.getBoundingClientRect();
    if (!bounds || !zoom) return { x: 0, y: 0 };

    return {
      x: (screenX - bounds.left) / zoom,
      y: (screenY - bounds.top) / zoom,
    };
  };
};

/**
 * Перевірка чи знаходиться точка в межах rect
 */
export const isPointInRect = (point, rect) => {
  const minX = Math.min(rect.startX, rect.endX);
  const maxX = Math.max(rect.startX, rect.endX);
  const minY = Math.min(rect.startY, rect.endY);
  const maxY = Math.max(rect.startY, rect.endY);

  return (
    point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  );
};

/**
 * Обчислення відстані між двома точками
 */
export const distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};
