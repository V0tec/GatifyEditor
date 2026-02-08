import { useRef, useCallback } from "react";

/**
 * Hook для управління перетягуванням елементів
 */
export const useDragAndDrop = ({
  components,
  wires,
  points,
  selectedIds,
  selectedWireIds,
  selectedPointIds,
  workspaceRef,
  screenToWorkspace,
  HALF_GRID,
  closeAllMenus,
  isWireMode,
}) => {
  const draggingRef = useRef(null);
  const isDraggingRef = useRef(false);

  /**
   * Прив'язка до сітки
   */
  const snapToHalfGrid = useCallback(
    (coord) => {
      return Math.round(coord / HALF_GRID) * HALF_GRID;
    },
    [HALF_GRID],
  );

  /**
   * Початок перетягування елемента
   */
  const startDrag = useCallback(
    (e, elementId, elementType = "component") => {
      if (isWireMode) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      closeAllMenus();

      const rect = workspaceRef.current.getBoundingClientRect();
      const coords = screenToWorkspace(e.clientX, e.clientY, rect);

      let dragItems = [];

      // 1. Додаємо всі виділені components
      const componentsToDrag =
        selectedIds.length > 0
          ? selectedIds
          : elementType === "component"
            ? [elementId]
            : [];

      componentsToDrag.forEach((id) => {
        const comp = components.find((c) => c.id === id);
        if (comp) {
          dragItems.push({
            id,
            type: "component",
            offsetX: coords.x - comp.x,
            offsetY: coords.y - comp.y,
          });
        }
      });

      // 2. Додаємо всі виділені wires
      const wiresToDrag =
        selectedWireIds.length > 0
          ? selectedWireIds
          : elementType === "wire"
            ? [elementId]
            : [];

      wiresToDrag.forEach((id) => {
        const wire = wires.find((w) => w.id === id);
        if (wire) {
          dragItems.push({
            id,
            type: "wire",
            offsetX: coords.x - wire.x,
            offsetY: coords.y - wire.y,
          });
        }
      });

      // 3. Додаємо всі виділені points
      const pointsToDrag =
        selectedPointIds.length > 0
          ? selectedPointIds
          : elementType === "point"
            ? [elementId]
            : [];

      pointsToDrag.forEach((id) => {
        const point = points.find((p) => p.id === id);
        if (point) {
          dragItems.push({
            id,
            type: "point",
            offsetX: coords.x - point.x,
            offsetY: coords.y - point.y,
          });
        }
      });

      draggingRef.current = dragItems;
      isDraggingRef.current = true;
    },
    [
      isWireMode,
      components,
      wires,
      points,
      selectedIds,
      selectedWireIds,
      selectedPointIds,
      workspaceRef,
      screenToWorkspace,
      closeAllMenus,
    ],
  );

  /**
   * ⭐ Початок перетягування з явно переданим стейтом виділення
   * Використовується коли потрібно синхронно оновити виділення і почати drag
   */
  const startDragWithState = useCallback(
    (e, elementId, elementType, selection) => {
      if (isWireMode) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      closeAllMenus();

      const rect = workspaceRef.current.getBoundingClientRect();
      const coords = screenToWorkspace(e.clientX, e.clientY, rect);

      let dragItems = [];

      // Використовуємо переданий стан замість поточного
      const {
        selectedIds: newIds,
        selectedWireIds: newWireIds,
        selectedPointIds: newPointIds,
      } = selection;

      // 1. Додаємо всі components з нового стану
      newIds.forEach((id) => {
        const comp = components.find((c) => c.id === id);
        if (comp) {
          dragItems.push({
            id,
            type: "component",
            offsetX: coords.x - comp.x,
            offsetY: coords.y - comp.y,
          });
        }
      });

      // 2. Додаємо всі wires з нового стану
      newWireIds.forEach((id) => {
        const wire = wires.find((w) => w.id === id);
        if (wire) {
          dragItems.push({
            id,
            type: "wire",
            offsetX: coords.x - wire.x,
            offsetY: coords.y - wire.y,
          });
        }
      });

      // 3. Додаємо всі points з нового стану
      newPointIds.forEach((id) => {
        const point = points.find((p) => p.id === id);
        if (point) {
          dragItems.push({
            id,
            type: "point",
            offsetX: coords.x - point.x,
            offsetY: coords.y - point.y,
          });
        }
      });

      draggingRef.current = dragItems;
      isDraggingRef.current = true;
    },
    [
      isWireMode,
      components,
      wires,
      points,
      workspaceRef,
      screenToWorkspace,
      closeAllMenus,
    ],
  );

  /**
   * Обчислити нові позиції при переміщенні
   */
  const calculateDragPositions = useCallback(
    (e) => {
      if (!draggingRef.current || draggingRef.current.length === 0) {
        return null;
      }

      const rect = workspaceRef.current?.getBoundingClientRect();
      if (!rect) return null;

      const coords = screenToWorkspace(e.clientX, e.clientY, rect);

      const updates = {
        components: [],
        wires: [],
        points: [],
      };

      draggingRef.current.forEach((dragItem) => {
        const newX = snapToHalfGrid(coords.x - dragItem.offsetX);
        const newY = snapToHalfGrid(coords.y - dragItem.offsetY);

        if (dragItem.type === "component") {
          updates.components.push({ id: dragItem.id, x: newX, y: newY });
        } else if (dragItem.type === "wire") {
          updates.wires.push({ id: dragItem.id, x: newX, y: newY });
        } else if (dragItem.type === "point") {
          updates.points.push({ id: dragItem.id, x: newX, y: newY });
        }
      });

      return updates;
    },
    [workspaceRef, screenToWorkspace, snapToHalfGrid],
  );

  /**
   * Завершити перетягування
   */
  const endDrag = useCallback(() => {
    draggingRef.current = null;
    isDraggingRef.current = false;
  }, []);

  /**
   * Перевірка чи зараз відбувається перетягування
   */
  const isDragging = useCallback(() => {
    return isDraggingRef.current;
  }, []);

  return {
    startDrag,
    startDragWithState, // ⭐ НОВИЙ МЕТОД
    calculateDragPositions,
    endDrag,
    isDragging,
    draggingRef,
    isDraggingRef,
  };
};
