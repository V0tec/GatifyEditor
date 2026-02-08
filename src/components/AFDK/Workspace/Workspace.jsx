import { useState, useRef, useEffect, useCallback } from "react";
import { createComponent } from "../Elements/gateConfigs.jsx";
import {
  GRID_SIZE,
  HALF_GRID,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
  WORKSPACE_LIMIT,
} from "./utils/constants.jsx";

// Hooks
import { useIdGenerators } from "./utils/idGenerators";
import { useSelection } from "./hooks/useSelection";
import { usePoints } from "./hooks/usePoints";
import { useJunctions } from "./hooks/useJunctions";
import { useWires } from "./hooks/useWires";
import { useSimulation } from "./hooks/useSimulation";
import { useContextMenu } from "./hooks/useContextMenu";
import { useClipboard } from "./hooks/useClipboard";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useWorkspaceEvents } from "./hooks/useWorkspaceEvents";

// View
import WorkspaceView from "./WorkspaceView";

function Workspace({
  components,
  setComponents,
  wires,
  setWires,
  points,
  setPoints,
  isWireMode,
  setIsWireMode,
  isPointMode,
  setIsPointMode,
  pointType,
  onRunSimulation,
  isSimulating,
  zoom,
  setZoom,
  onNotification,
  onUndo, // ⭐ ДОДАЙ
  onRedo, // ⭐ ДОДАЙ
  canUndo, // ⭐ ДОДАЙ
  canRedo, // ⭐ ДОДАЙ
}) {
  // ========================================
  // 1. БАЗОВИЙ СТЕЙТ
  // ========================================
  const [selectionBox, setSelectionBox] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gridSize, setGridSize] = useState({
    width: WORKSPACE_LIMIT,
    height: WORKSPACE_LIMIT,
  });

  // ========================================
  // 2. РЕФИ
  // ========================================
  const workspaceRef = useRef(null);
  const workspaceContentRef = useRef(null);
  const lastMoveTimeRef = useRef(0);

  // ========================================
  // 3. БАЗОВІ УТИЛІТИ
  // ========================================
  const snapToHalfGrid = (coord) => {
    const cellSize = 20;
    const offset = 5;

    return Math.floor((coord + offset) / cellSize) * cellSize;
  };

  const screenToWorkspace = useCallback(
    (screenX, screenY) => {
      const workspace = workspaceRef.current;
      if (!workspace || !zoom) return { x: 0, y: 0 };

      const rect = workspace.getBoundingClientRect();
      const scrollLeft = workspace.scrollLeft || 0;
      const scrollTop = workspace.scrollTop || 0;

      return {
        x: (screenX - rect.left + scrollLeft) / zoom - 5,
        y: (screenY - rect.top + scrollTop) / zoom - 5,
      };
    },
    [zoom],
  );

  // ========================================
  // 4. HOOKS
  // ========================================

  // ID генератори
  const { getNextComponentId, getNextWireId, getNextPointId, syncIds } =
    useIdGenerators(components, wires, points);

  // ⭐ Виділення (передаємо wires для логіки груп)
  const {
    selectedIds,
    selectedWireIds,
    selectedPointIds,
    setSelectedIds,
    setSelectedWireIds,
    setSelectedPointIds,
    clearSelection,
    selectComponent,
    selectWire,
    selectPoint,
    handleElementClick,
    getTotalSelectedCount,
  } = useSelection(wires);

  // Points
  const { handlePointLabelChange, handlePointToggle, createPointAtCoords } =
    usePoints(
      points,
      setPoints,
      screenToWorkspace,
      isPointMode,
      pointType,
      snapToHalfGrid,
      getNextPointId, // ⭐ ДОДАНО
    );

  // Junctions
  const { junctions, setJunctions, calculateJunctions } = useJunctions();

  // Автоматичний розрахунок junction'ів при зміні wires
  useEffect(() => {
    const newJunctions = calculateJunctions(wires);
    setJunctions(newJunctions);
  }, [wires, calculateJunctions, setJunctions]);

  // Wires
  const {
    isDrawingWire,
    currentWireStart,
    previewWire,
    startDrawingWire,
    updateWirePreview,
    finishDrawingWire,
    cancelDrawingWire,
    recalculateWireEndpoints,
  } = useWires(wires, setWires, snapToHalfGrid);

  // Clipboard
  const clipboard = useClipboard({
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
  });

  // Context Menu
  const contextMenu = useContextMenu({
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
  });

  // Simulation
  const { connections, runSingleSimulation } = useSimulation({
    components,
    setComponents,
    points,
    setPoints,
    wires,
    setWires,
    junctions,
    isSimulating,
    onNotification,
  });

  // Drag and Drop
  const dragAndDrop = useDragAndDrop({
    components,
    wires,
    points,
    selectedIds,
    selectedWireIds,
    selectedPointIds,
    workspaceRef,
    screenToWorkspace,
    HALF_GRID,
    closeAllMenus: contextMenu.closeAllMenus,
    isWireMode,
  });

  // ⭐ ВИПРАВЛЕНИЙ handleWireDragStart з startDragWithState
  const handleWireDragStart = useCallback(
    (e, wireId) => {
      e.preventDefault();
      e.stopPropagation();

      // ⭐ Отримуємо НОВИЙ стан після кліку
      const newSelection = handleElementClick(
        wireId,
        "wire",
        e.shiftKey,
        e.detail === 2,
        e.altKey,
      );

      // ⭐ Використовуємо startDragWithState
      dragAndDrop.startDragWithState(e, wireId, "wire", newSelection);
    },
    [handleElementClick, dragAndDrop],
  );

  // ========================================
  // 5. ІНШІ ОБРОБНИКИ
  // ========================================

  const handleWireClick = useCallback(
    (e, wireId) => {
      if (!isWireMode) return;
      e.stopPropagation();
      selectWire(wireId);
    },
    [isWireMode, selectWire],
  );

  const handlePortInvert = (componentId, portId, portType) => {
    setComponents((prev) =>
      prev.map((comp) => {
        if (comp.id !== componentId) return comp;
        if (portType === "input") {
          return {
            ...comp,
            inputs: comp.inputs.map((input) =>
              input.id === portId
                ? { ...input, inverted: !input.inverted }
                : input,
            ),
          };
        }
        if (portType === "output") {
          return {
            ...comp,
            outputs: comp.outputs.map((output) =>
              output.id === portId
                ? { ...output, inverted: !output.inverted }
                : output,
            ),
          };
        }
        return comp;
      }),
    );
  };

  const handleWheel = useCallback(
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom((prevZoom) => {
          const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
          return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom + delta));
        });
      }
    },
    [setZoom],
  );

  const handleDrop = (e) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("componentType");
    if (!componentData) return;

    // ⭐ СКИДАЄМО ФОКУС при додаванні нового елемента
    clearSelection();

    const [type, inputCount] = componentData.split("-");
    const inputs = inputCount ? parseInt(inputCount) : type === "NOT" ? 1 : 2;

    const coords = screenToWorkspace(e.clientX, e.clientY);

    const x = snapToHalfGrid(coords.x);
    const y = snapToHalfGrid(coords.y);

    const newComponent = createComponent(
      getNextComponentId(),
      type,
      inputs,
      x,
      y,
    );

    if (newComponent) {
      setComponents((prev) => [...prev, newComponent]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // ========================================
  // 6. EFFECTS
  // ========================================

  // Синхронізація ID
  useEffect(() => {
    syncIds();
  }, [components, wires, points, syncIds]);

  // Click outside для меню
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu.workspaceMenuPos || contextMenu.elementMenuPos) {
        const contextMenus = document.querySelectorAll(
          '[class*="contextMenu"]',
        );
        let clickedOnMenu = false;
        contextMenus.forEach((menu) => {
          if (menu.contains(e.target)) clickedOnMenu = true;
        });
        if (!clickedOnMenu) contextMenu.closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    contextMenu.workspaceMenuPos,
    contextMenu.elementMenuPos,
    contextMenu.closeAllMenus,
  ]);

  // Wheel для zoom
  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    workspace.addEventListener("wheel", handleWheel, { passive: false });
    return () => workspace.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Динамічний розмір сітки
  useEffect(() => {
    if (!workspaceContentRef.current) return;

    const maxX = Math.max(
      ...components.map((c) => c.x + (c.width || 140)),
      ...wires.map((w) => w.x + 20),
      ...points.map((p) => p.x + 40),
      WORKSPACE_LIMIT,
    );

    const maxY = Math.max(
      ...components.map((c) => c.y + (c.height || 60)),
      ...wires.map((w) => w.y + 20),
      ...points.map((p) => p.y + 40),
      WORKSPACE_LIMIT,
    );

    setGridSize({
      width: Math.ceil((maxX + 500) / 100) * 100,
      height: Math.ceil((maxY + 500) / 100) * 100,
    });
  }, [components, wires, points]);

  // ========================================
  // 7. EVENTS HOOK
  // ========================================

  const events = useWorkspaceEvents({
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
    setWorkspaceMenuPos: contextMenu.setWorkspaceMenuPos,
    setElementMenuPos: contextMenu.setElementMenuPos,
    setElementMenuId: contextMenu.setElementMenuId,
    setIsSelecting,
    setSelectionBox,
    isSelecting,
    isDrawingWire,
    startDrawingWire,
    updateWirePreview,
    finishDrawingWire,
    cancelDrawingWire,
    recalculateWireEndpoints,
    handlePointClick: createPointAtCoords,
    dragAndDrop,
    handleElementClick,
    clipboard,
    mousePosition,
    onUndo: onUndo,
    onRedo: onRedo,
  });

  // Глобальні слухачі подій
  useEffect(() => {
    if (!events || !events.handleMouseMove) return;

    const onMove = (e) => events.handleMouseMove(e);
    const onUp = (e) => events.handleMouseUp(e);
    const onKeyDown = (e) => events.handleKeyDown(e);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [events]);

  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      const coords = screenToWorkspace(e.clientX, e.clientY);
      setMousePosition({
        x: Math.round(coords.x),
        y: Math.round(coords.y),
      });
    };

    const workspace = workspaceRef.current;
    if (workspace) {
      workspace.addEventListener("mousemove", handleMouseMoveGlobal);
      return () =>
        workspace.removeEventListener("mousemove", handleMouseMoveGlobal);
    }
  }, [screenToWorkspace]);

  // ========================================
  // 8. VIEW PROPS
  // ========================================

  const viewProps = {
    mousePosition,

    zoom,
    components,
    wires,
    points,
    junctions,
    gridSize,
    selectionBox,
    previewWire,
    selectedIds,
    selectedWireIds,
    selectedPointIds,
    isWireMode,
    isPointMode,
    isDrawingWire,
    currentWireStart,
    workspaceMenuPos: contextMenu.workspaceMenuPos,
    elementMenuPos: contextMenu.elementMenuPos,

    GRID_SIZE,
    WORKSPACE_LIMIT,

    workspaceRef,
    workspaceContentRef,

    handleDrop,
    handleDragOver,
    handleMouseDownWorkspace: events.handleMouseDownWorkspace,
    handleMouseUp: events.handleMouseUp,
    handleKeyDown: events.handleKeyDown,
    handleMouseDownElement: events.handleMouseDownElement,
    handleWireClick,
    handleWireDragStart,
    handleWorkspaceContext: (e) => {
      const coords = screenToWorkspace(e.clientX, e.clientY);
      contextMenu.openWorkspaceMenu(
        e,
        snapToHalfGrid(coords.x),
        snapToHalfGrid(coords.y),
      );
    },
    handleElementContext: contextMenu.openElementMenu,
    handlePortInvert,
    handlePointSelect: handleElementClick,
    // ⭐ ВИПРАВЛЕНИЙ handlePointDragStart
    handlePointDragStart: (e, pointId, newSelection) =>
      dragAndDrop.startDragWithState(e, pointId, "point", newSelection),
    handlePointLabelChange,
    handlePointToggle,
    closeAllMenus: contextMenu.closeAllMenus,
    workspaceOptions: contextMenu.workspaceOptions,
    elementOptions: contextMenu.elementOptions,
  };

  return <WorkspaceView {...viewProps} />;
}

export default Workspace;
