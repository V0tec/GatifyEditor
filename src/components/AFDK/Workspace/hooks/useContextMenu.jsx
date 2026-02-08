import { useState, useCallback, useRef } from "react";

/**
 * Hook для управління контекстними меню
 */
export const useContextMenu = ({
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
  workspaceRef, // ⭐ ДОДАНО
  HALF_GRID,
}) => {
  const [workspaceMenuPos, setWorkspaceMenuPos] = useState(null);
  const [elementMenuPos, setElementMenuPos] = useState(null);
  const [elementMenuId, setElementMenuId] = useState(null);

  const clipboardRef = useRef({ components: [], wires: [], points: [] });

  /**
   * Закрити всі меню
   */
  const closeAllMenus = useCallback(() => {
    setWorkspaceMenuPos(null);
    setElementMenuPos(null);
    setElementMenuId(null);
  }, []);

  /**
   * Відкрити меню робочої зони
   */
  const openWorkspaceMenu = useCallback((e, workspaceX, workspaceY) => {
    e.preventDefault(); // ⭐ На всяк випадок

    const workspace = e.currentTarget;
    const rect = workspace.getBoundingClientRect();

    // ⭐ ВРАХОВУЄМО SCROLL
    const scrollLeft = workspace.scrollLeft || 0;
    const scrollTop = workspace.scrollTop || 0;

    setWorkspaceMenuPos({
      x: e.clientX - rect.left + scrollLeft, // ⭐ + scroll
      y: e.clientY - rect.top + scrollTop, // ⭐ + scroll
      workspaceX,
      workspaceY,
    });
  }, []);

  /**
   * Відкрити меню елемента
   */
  const openElementMenu = useCallback(
    (e, elementId) => {
      e.preventDefault();
      e.stopPropagation();

      // ⭐ Беремо rect від WORKSPACE, а не від елемента
      const workspace = workspaceRef.current;
      if (!workspace) return;

      const rect = workspace.getBoundingClientRect();
      const scrollLeft = workspace.scrollLeft || 0;
      const scrollTop = workspace.scrollTop || 0;

      setElementMenuPos({
        x: e.clientX - rect.left + scrollLeft,
        y: e.clientY - rect.top + scrollTop,
      });
      setElementMenuId(elementId);
    },
    [workspaceRef],
  );

  /**
   * Копіювати виділені елементи
   */
  const copySelection = useCallback(() => {
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
    closeAllMenus();
  }, [
    components,
    wires,
    points,
    selectedIds,
    selectedWireIds,
    selectedPointIds,
    closeAllMenus,
  ]);

  /**
   * Вставити з буфера обміну
   */
  const pasteFromClipboard = useCallback(
    (workspaceX, workspaceY) => {
      const { components: cC, wires: cW, points: cP } = clipboardRef.current;

      if (cC.length === 0 && cW.length === 0 && cP.length === 0) {
        return;
      }

      const allItems = [
        ...cC.map((c) => ({ ...c, type: "component" })),
        ...cW.map((w) => ({ ...w, type: "wire" })),
        ...cP.map((p) => ({ ...p, type: "point" })),
      ];

      const minX = Math.min(...allItems.map((item) => item.x));
      const minY = Math.min(...allItems.map((item) => item.y));

      const newComponents = cC.map((c) => ({
        ...c,
        id: getNextComponentId(),
        x: workspaceX + (c.x - minX),
        y: workspaceY + (c.y - minY),
      }));

      const newWires = cW.map((w) => ({
        ...w,
        id: getNextWireId(),
        x: workspaceX + (w.x - minX),
        y: workspaceY + (w.y - minY),
      }));

      const newPoints = cP.map((p) => ({
        ...p,
        id: getNextPointId(),
        x: workspaceX + (p.x - minX),
        y: workspaceY + (p.y - minY),
      }));

      setComponents((prev) => [...prev, ...newComponents]);
      setWires((prev) => [...prev, ...newWires]);
      setPoints((prev) => [...prev, ...newPoints]);

      setSelectedIds(newComponents.map((c) => c.id));
      setSelectedWireIds(newWires.map((w) => w.id));
      setSelectedPointIds(newPoints.map((p) => p.id));

      closeAllMenus();
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
      closeAllMenus,
    ],
  );

  /**
   * Видалити виділені елементи
   */
  const deleteSelection = useCallback(() => {
    setComponents((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setWires((prev) => prev.filter((w) => !selectedWireIds.includes(w.id)));
    setPoints((prev) => prev.filter((p) => !selectedPointIds.includes(p.id)));

    setSelectedIds([]);
    setSelectedWireIds([]);
    setSelectedPointIds([]);

    closeAllMenus();
  }, [
    setComponents,
    setWires,
    setPoints,
    selectedIds,
    selectedWireIds,
    selectedPointIds,
    setSelectedIds,
    setSelectedWireIds,
    setSelectedPointIds,
    closeAllMenus,
  ]);

  /**
   * Отримати кількість виділених елементів
   */
  const getTotalSelectedCount = useCallback(() => {
    return (
      selectedIds.length + selectedWireIds.length + selectedPointIds.length
    );
  }, [selectedIds, selectedWireIds, selectedPointIds]);

  /**
   * Перевірка чи є щось в буфері обміну
   */
  const hasClipboardData = useCallback(() => {
    return (
      clipboardRef.current.components.length > 0 ||
      clipboardRef.current.wires.length > 0 ||
      clipboardRef.current.points.length > 0
    );
  }, []);

  /**
   * Опції для меню робочої зони
   */
  const workspaceOptions = [
    {
      label: "Вставити",
      onClick: () => {
        if (workspaceMenuPos) {
          pasteFromClipboard(
            workspaceMenuPos.workspaceX,
            workspaceMenuPos.workspaceY,
          );
        }
      },
      disabled: !hasClipboardData(),
    },
  ];

  /**
   * Опції для меню елемента
   */
  const elementOptions = [
    {
      label: `Копіювати ${getTotalSelectedCount() > 1 ? `(${getTotalSelectedCount()})` : ""}`,
      onClick: copySelection,
    },
    {
      label: `Видалити ${getTotalSelectedCount() > 1 ? `(${getTotalSelectedCount()})` : ""}`,
      onClick: deleteSelection,
    },
  ];

  return {
    // Стейт
    workspaceMenuPos,
    elementMenuPos,
    elementMenuId,

    setWorkspaceMenuPos,
    setElementMenuPos,
    setElementMenuId,

    // Методи
    openWorkspaceMenu,
    openElementMenu,
    closeAllMenus,
    copySelection,
    pasteFromClipboard,
    deleteSelection,
    hasClipboardData,

    // Опції меню
    workspaceOptions,
    elementOptions,
  };
};
