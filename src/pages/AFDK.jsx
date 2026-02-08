import { useRef, useState, useEffect, useCallback } from "react";
import ComponentsPanel from "../components/AFDK/ComponentsPanel/ComponentsPanel";
import Workspace from "../components/AFDK/Workspace/Workspace";
import TruthTableModal from "../components/AFDK/TruthTable/TruthTableModal";
import TimingDiagramModal from "../components/AFDK/TimingDiagram/TimingDiagramModal";
import styles from "../scss/AFDK.module.scss";
import Header from "../components/AFDK/Header/Header";
import Notification from "../components/AFDK/Notification/Notification";
import { useHistory } from "../components/AFDK/Workspace/hooks/useHistory";

function AFDK() {
  const [components, setComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [points, setPoints] = useState([]);

  // ⭐ ПІДКЛЮЧАЄМО ІСТОРІЮ
  const historyHook = useHistory({
    components: [],
    wires: [],
    points: [],
  });

  // ⭐ Функція збереження
  const saveToHistory = useCallback(() => {
    historyHook.saveState({
      components,
      wires,
      points,
    });
  }, [components, wires, points, historyHook]);

  // ⭐ UNDO
  const handleUndo = useCallback(() => {
    const prevState = historyHook.undo();
    if (prevState) {
      setComponents(prevState.components);
      setWires(prevState.wires);
      setPoints(prevState.points);
    }
  }, [historyHook]);

  // ⭐ REDO
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
  const [isTruthTableOpen, setIsTruthTableOpen] = useState(false);
  const [isTimingDiagramOpen, setIsTimingDiagramOpen] = useState(false);
  const [junctions, setJunctions] = useState([]);
  const [simulationCounter, setSimulationCounter] = useState(0);

  const fileInputRef = useRef(null);
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

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

  const handleOpenTruthTable = () => {
    setIsTruthTableOpen(true);
  };

  const handleCloseTruthTable = () => {
    setIsTruthTableOpen(false);
  };

  const handleOpenTimingDiagram = () => {
    setIsTimingDiagramOpen(true);
  };

  const handleCloseTimingDiagram = () => {
    setIsTimingDiagramOpen(false);
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
    if (isLoadingRef.current) {
      return;
    }

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

  const handleRunSimulation = () => {
    if (window.__runWorkspaceSimulation) {
      window.__runWorkspaceSimulation();

      setTimeout(() => {
        setSimulationCounter((prev) => {
          return prev + 1;
        });
      }, 50);
    } else {
    }
  };

  const handleToggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  // ⭐ АВТОМАТИЧНЕ ЗБЕРЕЖЕННЯ В ІСТОРІЮ
  useEffect(() => {
    // Пропускаємо початковий стан
    if (components.length === 0 && wires.length === 0 && points.length === 0) {
      return;
    }

    // Дебаунс - зберігаємо через 300мс після останньої зміни
    const timeout = setTimeout(() => {
      saveToHistory();
    }, 300);

    return () => clearTimeout(timeout);
  }, [components, wires, points, saveToHistory]);

  // ⭐ АВТОЗБЕРЕЖЕННЯ В localStorage
  useEffect(() => {
    // Не зберігаємо порожній стан
    if (components.length === 0 && wires.length === 0 && points.length === 0) {
      return;
    }

    // Дебаунс - зберігаємо через 1 секунду після останньої зміни
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

  // ⭐ ВІДНОВЛЕННЯ ПРИ ЗАВАНТАЖЕННІ (БЕЗ ПІДТВЕРДЖЕННЯ)
  useEffect(() => {
    const saved = localStorage.getItem("afdk-autosave");

    if (saved) {
      try {
        const state = JSON.parse(saved);

        setComponents(state.components || []);
        setWires(state.wires || []);
        setPoints(state.points || []);
      } catch (err) {
        // Якщо помилка - видаляємо зіпсоване збереження
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

      <TruthTableModal
        isOpen={isTruthTableOpen}
        onClose={handleCloseTruthTable}
        points={points}
        wires={wires}
        junctions={junctions}
        components={components}
      />

      <TimingDiagramModal
        isOpen={isTimingDiagramOpen}
        onClose={handleCloseTimingDiagram}
        points={points}
        wires={wires}
        junctions={junctions}
        components={components}
        onRunSimulation={handleRunSimulation}
        onTogglePoint={handleTogglePoint}
        simulationCounter={simulationCounter}
      />

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
