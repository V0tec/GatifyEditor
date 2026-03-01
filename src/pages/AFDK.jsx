import { useRef, useState, useEffect, useCallback } from "react";
import ComponentsPanel from "../components/AFDK/ComponentsPanel/ComponentsPanel";
import Workspace from "../components/AFDK/Workspace/Workspace";
import TruthTableContent from "../components/AFDK/TruthTable/TruthTableContent";
import TimingDiagramContent from "../components/AFDK/TimingDiagram/TimingDiagramContent";
import styles from "../scss/AFDK.module.scss";
import Header from "../components/AFDK/Header/Header";
import Notification from "../components/AFDK/Notification/Notification";
import { useHistory } from "../components/AFDK/Workspace/hooks/useHistory";
import FloatingWindow from "../components/AFDK/FloatingWindow/FloatingWindow";
import MinimizeBar from "../components/AFDK/FloatingWindow/MinimizeBar";
import { useFloatingWindows } from "../components/AFDK/FloatingWindow/useFloatingWindows";

function AFDK() {
  const [components, setComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [points, setPoints] = useState([]);

  const historyHook = useHistory({
    components: [],
    wires: [],
    points: [],
  });

  const saveToHistory = useCallback(() => {
    historyHook.saveState({
      components,
      wires,
      points,
    });
  }, [components, wires, points, historyHook]);

  const handleUndo = useCallback(() => {
    const prevState = historyHook.undo();
    if (prevState) {
      setComponents(prevState.components);
      setWires(prevState.wires);
      setPoints(prevState.points);
    }
  }, [historyHook]);

  const handleRedo = useCallback(() => {
    const nextState = historyHook.redo();
    if (nextState) {
      setComponents(nextState.components);
      setWires(nextState.wires);
      setPoints(nextState.points);
    }
  }, [historyHook]);

  const [isWireMode, setIsWireMode] = useState(false);
  const [isPointMode, setIsPointMode] = useState(false);
  const [pointType, setPointType] = useState("input");
  const [zoom, setZoom] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [notification, setNotification] = useState(null);

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    restoreWindow,
  } = useFloatingWindows();

  const [junctions, setJunctions] = useState([]);
  const [simulationCounter, setSimulationCounter] = useState(0);

  const [timingDiagramSelectedPoints, setTimingDiagramSelectedPoints] =
    useState([]);
  const [timingDiagramTicks, setTimingDiagramTicks] = useState([]);

  const fileInputRef = useRef(null);
  const isLoadingRef = useRef(false);

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
  };

  const handleToggleWireMode = () => {
    setIsWireMode((prev) => !prev);
    if (isPointMode) setIsPointMode(false);
  };

  const handleTogglePointMode = () => {
    setIsPointMode((prev) => !prev);
    if (isWireMode) setIsWireMode(false);
  };

  const handleSetPointType = (type) => {
    setPointType(type);
  };

  const handleClearTimingDiagram = () => {
    setTimingDiagramSelectedPoints([]);
    setTimingDiagramTicks([]);
  };

  const handleTogglePoint = (pointId) => {
    setPoints((prev) =>
      prev.map((p) =>
        p.id === pointId && p.type === "input"
          ? { ...p, value: p.value === 1 ? 0 : 1 }
          : p,
      ),
    );
  };

  const handleTogglePointWithSimulation = useCallback(
    (pointId) => {
      const point = points.find((p) => p.id === pointId);
      if (!point || point.type !== "input") return;

      const newValue = point.value === 1 ? 0 : 1;

      setPoints((prev) =>
        prev.map((p) => (p.id === pointId ? { ...p, value: newValue } : p)),
      );

      if (window.__restartFromPoint && isSimulating) {
        window.__restartFromPoint(pointId, newValue);
      }
    },
    [points, isSimulating],
  );

  const handleRunSimulation = () => {
    if (window.__runWorkspaceSimulation) {
      window.__runWorkspaceSimulation();

      setTimeout(() => {
        setSimulationCounter((prev) => prev + 1);
      }, 50);
    }
  };

  const handleOpenTruthTable = () => {
    openWindow(
      "truthTable",
      "📊 Таблиця істинності",
      <TruthTableContent
        points={points}
        wires={wires}
        junctions={junctions}
        components={components}
        onClose={() => closeWindow("truthTable")}
      />,
      { x: 100, y: 100 },
      { width: 900, height: 600 },
    );
  };

  const handleOpenTimingDiagram = () => {
    openWindow(
      "timingDiagram",
      "⏱️ Часові діаграми",
      <TimingDiagramContent
        points={points}
        wires={wires}
        junctions={junctions}
        components={components}
        onRunSimulation={handleRunSimulation}
        onTogglePoint={handleTogglePointWithSimulation}
        simulationCounter={simulationCounter}
        isSimulating={isSimulating}
        selectedPoints={timingDiagramSelectedPoints}
        setSelectedPoints={setTimingDiagramSelectedPoints}
        ticks={timingDiagramTicks}
        setTicks={setTimingDiagramTicks}
        onClear={handleClearTimingDiagram}
      />,
      { x: 200, y: 100 },
      { width: 1200, height: 700 },
    );
  };

  // ⭐ АВТООНОВЛЕННЯ TimingDiagram при зміні тіків
  useEffect(() => {
    if (windows.length === 0) return;

    const timingWindow = windows.find((w) => w.id === "timingDiagram");
    if (timingWindow && !timingWindow.isMinimized) {
      console.log("🔄 Ticks changed - refreshing TimingDiagram");
      handleOpenTimingDiagram();
    }
  }, [
    timingDiagramTicks,
    timingDiagramSelectedPoints,
    handleOpenTimingDiagram,
    windows,
  ]);

  const handleSave = () => {
    const schemeData = {
      components: components,
      wires: wires,
      points: points,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    const dataStr = JSON.stringify(schemeData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `gatify-scheme-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }

    setTimeout(() => {
      isLoadingRef.current = false;
    }, 500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = "";

    if (!file) {
      isLoadingRef.current = false;
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const loadedData = JSON.parse(event.target.result);

        if (Array.isArray(loadedData)) {
          setComponents(loadedData);
          setWires([]);
          setPoints([]);
        } else if (
          loadedData.components &&
          Array.isArray(loadedData.components)
        ) {
          setComponents(loadedData.components);
          if (loadedData.wires && Array.isArray(loadedData.wires)) {
            setWires(loadedData.wires);
          } else {
            setWires([]);
          }
          if (loadedData.points && Array.isArray(loadedData.points)) {
            setPoints(loadedData.points);
          } else {
            setPoints([]);
          }
        } else {
          throw new Error("Неправильна структура файлу");
        }
      } catch (err) {
        alert("Помилка при завантаженні файлу: " + err.message);
      } finally {
        isLoadingRef.current = false;
      }
    };

    reader.onerror = () => {
      alert("Помилка при читанні файлу");
      isLoadingRef.current = false;
    };

    reader.readAsText(file);
  };

  const handleClear = () => {
    if (
      confirm("Очистити робочу зону? Всі незбережені зміни будуть втрачені.")
    ) {
      localStorage.removeItem("afdk-autosave");
      setComponents([]);
      setWires([]);
      setPoints([]);
      setZoom(1);
    }
  };

  const handleToggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  useEffect(() => {
    if (components.length === 0 && wires.length === 0 && points.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      saveToHistory();
    }, 300);

    return () => clearTimeout(timeout);
  }, [components, wires, points, saveToHistory]);

  useEffect(() => {
    if (components.length === 0 && wires.length === 0 && points.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      const state = {
        components,
        wires,
        points,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("afdk-autosave", JSON.stringify(state));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [components, wires, points]);

  useEffect(() => {
    const saved = localStorage.getItem("afdk-autosave");

    if (saved) {
      try {
        const state = JSON.parse(saved);

        setComponents(state.components || []);
        setWires(state.wires || []);
        setPoints(state.points || []);
      } catch (err) {
        localStorage.removeItem("afdk-autosave");
      }
    }
  }, []);

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Header
        onSave={handleSave}
        onLoad={handleLoad}
        onToggleWireMode={handleToggleWireMode}
        isWireMode={isWireMode}
        onTogglePointMode={handleTogglePointMode}
        isPointMode={isPointMode}
        pointType={pointType}
        onSetPointType={handleSetPointType}
        onRunSimulation={handleRunSimulation}
        onToggleSimulation={handleToggleSimulation}
        isSimulating={isSimulating}
        onOpenTruthTable={handleOpenTruthTable}
        onOpenTimingDiagram={handleOpenTimingDiagram}
        onClear={handleClear}
        zoom={zoom}
      />

      {windows.map((window) => (
        <FloatingWindow
          key={window.id}
          id={window.id}
          title={window.title}
          isMinimized={window.isMinimized}
          isMaximized={window.isMaximized}
          zIndex={window.zIndex}
          defaultPosition={window.defaultPosition}
          defaultSize={window.defaultSize}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onMaximize={(value) => maximizeWindow(window.id, value)}
        >
          {window.content}
        </FloatingWindow>
      ))}

      <MinimizeBar windows={windows} onRestore={restoreWindow} />

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className={styles.afdk}>
        <ComponentsPanel />
        <Workspace
          components={components}
          setComponents={setComponents}
          wires={wires}
          setWires={setWires}
          points={points}
          setPoints={setPoints}
          isWireMode={isWireMode}
          setIsWireMode={setIsWireMode}
          isPointMode={isPointMode}
          setIsPointMode={setIsPointMode}
          pointType={pointType}
          onRunSimulation={handleRunSimulation}
          isSimulating={isSimulating}
          zoom={zoom}
          setZoom={setZoom}
          onNotification={showNotification}
          setJunctions={setJunctions}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyHook.canUndo}
          canRedo={historyHook.canRedo}
        />
      </div>
    </div>
  );
}

export default AFDK;
