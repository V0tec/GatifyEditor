import { useCallback, useRef } from "react";

export const useWorkspaceEvents = ({
  // Стейт та сеттери
  components,
  setComponents,
  wires,
  setWires,
  points,
  setPoints,
  setJunctions,
  selectedIds,
  setSelectedIds,
  selectedWireIds,
  setSelectedWireIds,
  selectedPointIds,
  setSelectedPointIds,
  selectionBox,
  zoom,
  isWireMode,
  setIsWireMode,
  isPointMode,
  setIsPointMode,
  workspaceRef,
  screenToWorkspace,
  HALF_GRID,
  getNextWireId,
  getNextPointId,
  // Меню стейти
  setWorkspaceMenuPos,
  setElementMenuPos,
  setElementMenuId,
  setIsSelecting,
  setSelectionBox,
  isSelecting,
  // Wire методи
  isDrawingWire,
  startDrawingWire,
  recalculateWireEndpoints,
  updateWirePreview,
  finishDrawingWire,
  cancelDrawingWire,
  // Point методи
  handlePointClick,
  // Drag and Drop
  dragAndDrop,
  // ⭐ Selection логіка
  handleElementClick,
  // ⭐ Clipboard hook
  clipboard,
  // ⭐ Mouse position
  mousePosition,
  // ⭐ Undo/Redo
  onUndo,
  onRedo,
}) => {
  const selectionStartRef = useRef(null);
  const lastMoveTimeRef = useRef(0);

  const initialSelectedIdsRef = useRef([]);
  const initialSelectedWireIdsRef = useRef([]);
  const initialSelectedPointIdsRef = useRef([]);

  const closeAllMenus = useCallback(() => {
    setWorkspaceMenuPos(null);
    setElementMenuPos(null);
    setElementMenuId(null);
  }, [setWorkspaceMenuPos, setElementMenuPos, setElementMenuId]);

  const updateSelectionFromBox = useCallback(
    (box) => {
      if (!box) return;

      // Selection box границі
      const boxLeft = Math.min(box.startX, box.endX);
      const boxRight = Math.max(box.startX, box.endX);
      const boxTop = Math.min(box.startY, box.endY);
      const boxBottom = Math.max(box.startY, box.endY);

      // ⭐ КОМПОНЕНТИ - перевіряємо перетин з повною областю
      const selectedComponents = components.filter((comp) => {
        // Обчислюємо розміри компонента
        const compWidth = comp.width || 140;
        const compHeight = comp.height || 60;

        // Обчислюємо прямокутник компонента
        const compLeft = comp.x;
        const compRight = comp.x + compWidth;
        const compTop = comp.y;
        const compBottom = comp.y + compHeight;

        // Перевіряємо перетин прямокутників
        return (
          boxLeft <= compRight &&
          boxRight >= compLeft &&
          boxTop <= compBottom &&
          boxBottom >= compTop
        );
      });

      // ⭐ ПРОВОДИ - враховуємо довжину 20px
      const selectedWiresInBox = wires.filter((wire) => {
        // Обчислюємо розміри проводу залежно від напрямку
        const wireWidth =
          wire.direction === "right" || wire.direction === "left" ? 20 : 2;
        const wireHeight =
          wire.direction === "down" || wire.direction === "up" ? 20 : 2;

        // Обчислюємо прямокутник проводу
        const wireLeft = wire.x;
        const wireRight = wire.x + wireWidth;
        const wireTop = wire.y;
        const wireBottom = wire.y + wireHeight;

        // Перевіряємо перетин
        return (
          boxLeft <= wireRight &&
          boxRight >= wireLeft &&
          boxTop <= wireBottom &&
          boxBottom >= wireTop
        );
      });

      // ⭐ ТОЧКИ - враховуємо розмір 20px з центром в (x, y)
      const selectedPointsInBox = points.filter((point) => {
        const pointSize = 20;

        // Точка має центр в (x, y), тому віднімаємо половину розміру
        const pointLeft = point.x - pointSize / 2;
        const pointRight = point.x + pointSize / 2;
        const pointTop = point.y - pointSize / 2;
        const pointBottom = point.y + pointSize / 2;

        // Перевіряємо перетин
        return (
          boxLeft <= pointRight &&
          boxRight >= pointLeft &&
          boxTop <= pointBottom &&
          boxBottom >= pointTop
        );
      });

      if (
        initialSelectedIdsRef.current.length > 0 ||
        initialSelectedWireIdsRef.current.length > 0 ||
        initialSelectedPointIdsRef.current.length > 0
      ) {
        setSelectedIds([
          ...new Set([
            ...initialSelectedIdsRef.current,
            ...selectedComponents.map((c) => c.id),
          ]),
        ]);
        setSelectedWireIds([
          ...new Set([
            ...initialSelectedWireIdsRef.current,
            ...selectedWiresInBox.map((w) => w.id),
          ]),
        ]);
        setSelectedPointIds([
          ...new Set([
            ...initialSelectedPointIdsRef.current,
            ...selectedPointsInBox.map((p) => p.id),
          ]),
        ]);
      } else {
        setSelectedIds(selectedComponents.map((c) => c.id));
        setSelectedWireIds(selectedWiresInBox.map((w) => w.id));
        setSelectedPointIds(selectedPointsInBox.map((p) => p.id));
      }
    },
    [
      components,
      wires,
      points,
      setSelectedIds,
      setSelectedWireIds,
      setSelectedPointIds,
    ],
  );

  // ⭐ СПРОЩЕНИЙ handleMouseDownElement - вся логіка в useSelection
  const handleMouseDownElement = (e, id) => {
    if (isWireMode || isPointMode) return;

    e.preventDefault();
    e.stopPropagation();
    closeAllMenus();

    // Визначаємо тип елемента
    const isComp = components.some((c) => c.id === id);
    const isWire = wires.some((w) => w.id === id);
    const isPoint = points.some((p) => p.id === id);

    const type = isComp ? "component" : isWire ? "wire" : "point";

    // ⭐ Отримуємо НОВИЙ стан після кліку (синхронно)
    const newSelection = handleElementClick(
      id,
      type,
      e.shiftKey,
      false,
      e.altKey,
    );

    // ⭐ Запускаємо drag з НОВИМ станом
    dragAndDrop.startDragWithState(e, id, type, newSelection);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isWireMode && isDrawingWire) {
        const coords = screenToWorkspace(e.clientX, e.clientY);
        updateWirePreview(coords.x, coords.y);
        return;
      }

      // Перетягування елементів
      if (dragAndDrop.isDragging()) {
        const now = Date.now();
        if (now - lastMoveTimeRef.current < 16) return;
        lastMoveTimeRef.current = now;

        const updates = dragAndDrop.calculateDragPositions(e);

        if (updates) {
          if (updates.components.length > 0) {
            setComponents((prev) =>
              prev.map((c) => {
                const update = updates.components.find((u) => u.id === c.id);
                return update ? { ...c, x: update.x, y: update.y } : c;
              }),
            );
          }

          if (updates.wires.length > 0) {
            setWires((prev) =>
              prev.map((w) => {
                const update = updates.wires.find((u) => u.id === w.id);
                return update ? { ...w, x: update.x, y: update.y } : w;
              }),
            );
          }

          if (updates.points.length > 0) {
            setPoints((prev) =>
              prev.map((p) => {
                const update = updates.points.find((u) => u.id === p.id);
                return update ? { ...p, x: update.x, y: update.y } : p;
              }),
            );
          }
        }
        return;
      }

      // Selection box logic
      if (isSelecting && selectionStartRef.current) {
        const coords = screenToWorkspace(e.clientX, e.clientY);

        const newBox = {
          startX: selectionStartRef.current.x,
          startY: selectionStartRef.current.y,
          endX: coords.x,
          endY: coords.y,
        };

        setSelectionBox(newBox);
        updateSelectionFromBox(newBox);
      }
    },
    [
      isSelecting,
      isWireMode,
      isDrawingWire,
      updateWirePreview,
      setComponents,
      setWires,
      setPoints,
      setSelectionBox,
      updateSelectionFromBox,
      screenToWorkspace,
      dragAndDrop,
    ],
  );

  const handleMouseUp = useCallback(() => {
    // ⭐ Перевіряємо чи було перетягування
    const wasDragging = dragAndDrop.isDragging();

    dragAndDrop.endDrag();

    // ⭐ Перераховуємо ТІЛЬКИ якщо було drag
    if (wasDragging) {
      const allWireGroupIds = [...new Set(wires.map((w) => w.wireGroupId))];

      if (allWireGroupIds.length > 0) {
        recalculateWireEndpoints(allWireGroupIds);
      }
    }

    if (isSelecting) {
      setIsSelecting(false);
      setSelectionBox(null);
      selectionStartRef.current = null;
      initialSelectedIdsRef.current = [];
      initialSelectedWireIdsRef.current = [];
      initialSelectedPointIdsRef.current = [];
    }
  }, [
    isSelecting,
    setIsSelecting,
    setSelectionBox,
    dragAndDrop,
    wires,
    recalculateWireEndpoints,
  ]);

  const handleKeyDown = useCallback(
    (e) => {
      // ⭐ ESCAPE - каскадна обробка
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        // ПРІОРИТЕТ 1: Скасувати малювання проводу
        if (isDrawingWire) {
          cancelDrawingWire();
          return;
        }

        // ПРІОРИТЕТ 2: Вийти з режиму проводу
        if (isWireMode) {
          setIsWireMode(false);
          return;
        }

        // ПРІОРИТЕТ 3: Вийти з режиму точок
        if (isPointMode) {
          setIsPointMode(false);
          return;
        }

        // ПРІОРИТЕТ 4: Скасувати виділення
        if (
          selectedIds.length > 0 ||
          selectedWireIds.length > 0 ||
          selectedPointIds.length > 0
        ) {
          setSelectedIds([]);
          setSelectedWireIds([]);
          setSelectedPointIds([]);
          return;
        }
      }

      // DELETE - видалення
      if (e.key === "Delete") {
        e.preventDefault();
        setComponents((prev) =>
          prev.filter((c) => !selectedIds.includes(c.id)),
        );
        setWires((prev) => prev.filter((w) => !selectedWireIds.includes(w.id)));
        setPoints((prev) =>
          prev.filter((p) => !selectedPointIds.includes(p.id)),
        );
        setSelectedIds([]);
        setSelectedWireIds([]);
        setSelectedPointIds([]);
      }

      // ⭐ CTRL+C, CTRL+X, CTRL+V, CTRL+Z, CTRL+Y
      if (e.ctrlKey || e.metaKey) {
        const code = e.code;

        // ⭐ UNDO - Ctrl+Z (БЕЗ Shift)
        if (code === "KeyZ" && !e.shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          onUndo?.();
          return;
        }

        // ⭐ REDO - Ctrl+Shift+Z або Ctrl+Y
        if ((code === "KeyZ" && e.shiftKey) || code === "KeyY") {
          e.preventDefault();
          e.stopPropagation();
          onRedo?.();
          return;
        }

        // Копіювати (KeyC)
        if (code === "KeyC") {
          e.preventDefault();
          e.stopPropagation();

          const hasSelection =
            selectedIds.length > 0 ||
            selectedWireIds.length > 0 ||
            selectedPointIds.length > 0;

          if (hasSelection) {
            clipboard.copy();
          }
        }

        // Вирізати (KeyX)
        else if (code === "KeyX") {
          e.preventDefault();
          e.stopPropagation();

          const hasSelection =
            selectedIds.length > 0 ||
            selectedWireIds.length > 0 ||
            selectedPointIds.length > 0;

          if (hasSelection) {
            clipboard.cut();
          }
        }

        // Вставити (KeyV)
        else if (code === "KeyV") {
          e.preventDefault();
          e.stopPropagation();

          const hasClipboard = clipboard.hasData();

          if (hasClipboard) {
            // ⭐ БЕЗПЕЧНИЙ ДОСТУП
            const x = mousePosition?.x ?? 500;
            const y = mousePosition?.y ?? 500;

            clipboard.paste(x, y);
          }
        }
      }
    },
    [
      isDrawingWire,
      cancelDrawingWire,
      isWireMode,
      setIsWireMode,
      isPointMode,
      setIsPointMode,
      selectedIds,
      selectedWireIds,
      selectedPointIds,
      setSelectedIds,
      setSelectedWireIds,
      setSelectedPointIds,
      components,
      wires,
      points,
      setComponents,
      setWires,
      setPoints,
      clipboard,
      mousePosition,
      onUndo,
      onRedo,
    ],
  );

  const handleMouseDownWorkspace = (e) => {
    if (isWireMode) {
      e.preventDefault();
      e.stopPropagation();

      const coords = screenToWorkspace(e.clientX, e.clientY);

      if (!isDrawingWire) {
        startDrawingWire(coords.x, coords.y);
      } else {
        finishDrawingWire();
      }
      return;
    }

    if (isPointMode) return handlePointClick?.(e);
    if (e.button !== 0) return;

    e.preventDefault();
    closeAllMenus();

    // ⭐ КЛІК ПО РОБОЧІЙ ЗОНІ - скидаємо фокус (якщо не Shift)
    if (!e.shiftKey) {
      setSelectedIds([]);
      setSelectedWireIds([]);
      setSelectedPointIds([]);
    }

    // Зберігаємо попередні фокуси для Shift-виділення
    initialSelectedIdsRef.current = e.shiftKey ? [...selectedIds] : [];
    initialSelectedWireIdsRef.current = e.shiftKey ? [...selectedWireIds] : [];
    initialSelectedPointIdsRef.current = e.shiftKey
      ? [...selectedPointIds]
      : [];

    const coords = screenToWorkspace(e.clientX, e.clientY);

    selectionStartRef.current = { x: coords.x, y: coords.y };
    setIsSelecting(true);
    setSelectionBox({
      startX: coords.x,
      startY: coords.y,
      endX: coords.x,
      endY: coords.y,
    });
  };

  return {
    handleMouseDownWorkspace,
    handleMouseDownElement,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    closeAllMenus,
  };
};
