import { useState, useEffect, useCallback, useRef } from "react";
import {
  initializeSimulation,
  processSimulationStep,
} from "../utils/signalPropagation";

const updateOutputPoints = (prevPoints, result) => {
  return prevPoints.map((point) => {
    if (point.type !== "output") return point;

    const TOUCH_THRESHOLD = 5;

    for (const comp of result.components) {
      for (const output of comp.outputs) {
        const outputWorldX = comp.x + output.wireEndX + comp.width / 2;
        const outputWorldY = comp.y + output.wireEndY + comp.height / 2;

        const touchesMiniWire =
          Math.abs(point.x - outputWorldX) < TOUCH_THRESHOLD &&
          Math.abs(point.y - outputWorldY) < TOUCH_THRESHOLD;

        if (touchesMiniWire && output.connected) {
          return { ...point, value: output.value };
        }
      }
    }

    const touchingWire = result.wires.find((wire) => {
      const wireStart = wire.wireStart || { x: wire.x, y: wire.y };
      const wireEnd = wire.wireEnd || { x: wire.x, y: wire.y };

      const touchesStart =
        Math.abs(point.x - wireStart.x) < TOUCH_THRESHOLD &&
        Math.abs(point.y - wireStart.y) < TOUCH_THRESHOLD;

      const touchesEnd =
        Math.abs(point.x - wireEnd.x) < TOUCH_THRESHOLD &&
        Math.abs(point.y - wireEnd.y) < TOUCH_THRESHOLD;

      return touchesStart || touchesEnd;
    });

    if (touchingWire && touchingWire.active) {
      return { ...point, value: touchingWire.value };
    }

    return { ...point, value: 0 };
  });
};

export const useSimulation = ({
  components,
  setComponents,
  points,
  setPoints,
  wires,
  setWires,
  junctions,
  isSimulating,
  onNotification,
}) => {
  const [connections, setConnections] = useState([]);

  const simStateRef = useRef({
    queue: [],
    activeGroupsMap: new Map(),
    processedElements: {
      wireGroups: new Set(),
      components: new Set(),
      points: new Set(),
    },
    step: 0,
    initialized: false,
  });

  const componentsRef = useRef(components);
  const wiresRef = useRef(wires);
  const pointsRef = useRef(points);
  const junctionsRef = useRef(junctions);

  useEffect(() => {
    componentsRef.current = components;
  }, [components]);
  useEffect(() => {
    wiresRef.current = wires;
  }, [wires]);
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);
  useEffect(() => {
    junctionsRef.current = junctions;
  }, [junctions]);

  // ⭐ ВХІД/ВИХІД З РЕЖИМУ СИМУЛЯЦІЇ
  useEffect(() => {
    if (isSimulating) {
      console.log("\n▶️ ВХОДИМО В РЕЖИМ СИМУЛЯЦІЇ - ініціалізуємо");

      const initialState = initializeSimulation(
        pointsRef.current,
        wiresRef.current,
        componentsRef.current,
      );

      console.log(
        `✅ Ініціалізовано: черга містить ${initialState.queue.length} подій`,
      );

      simStateRef.current = {
        queue: initialState.queue,
        activeGroupsMap: initialState.activeGroupsMap,
        processedElements: initialState.processedElements,
        step: 0,
        initialized: true,
      };
    } else {
      console.log("\n⏹️ ВИХОДИМО З РЕЖИМУ СИМУЛЯЦІЇ - скидаємо");

      simStateRef.current = {
        queue: [],
        activeGroupsMap: new Map(),
        processedElements: {
          wireGroups: new Set(),
          components: new Set(),
          points: new Set(),
        },
        step: 0,
        initialized: false,
      };

      setWires((prev) => prev.map((w) => ({ ...w, active: false, value: 0 })));

      setComponents((prev) =>
        prev.map((c) => ({
          ...c,
          inputs: c.inputs.map((i) => ({ ...i, value: 0, connected: false })),
          outputs: c.outputs.map((o) => ({ ...o, value: 0, connected: false })),
        })),
      );

      setPoints((prev) =>
        prev.map((p) => (p.type === "output" ? { ...p, value: 0 } : p)),
      );
    }
  }, [isSimulating]);

  // ⭐ ОДИН КРОК - використовує рефи
  const executeStep = useCallback(() => {
    const sim = simStateRef.current;

    if (!sim.initialized) return;
    if (sim.queue.length === 0) {
      // console.log("✅ Стабільний стан - черга пуста");
      return;
    }

    console.log(`\n⚡ ВИКОНУЮ КРОК ${sim.step + 1}`);

    const result = processSimulationStep(
      sim.queue,
      sim.activeGroupsMap,
      sim.processedElements,
      componentsRef.current,
      wiresRef.current,
      junctionsRef.current,
      pointsRef.current,
      sim.step,
    );

    simStateRef.current = {
      queue: result.queue,
      activeGroupsMap: result.activeGroupsMap,
      processedElements: result.processedElements,
      step: result.step,
      initialized: true,
    };

    setComponents(result.components);
    setWires(result.wires);
    setPoints((prev) => updateOutputPoints(prev, result));

    if (result.finished) {
      console.log("✅ СИМУЛЯЦІЯ ЗАВЕРШЕНА");
    }
  }, []);

  // ⭐ ПЕРЕЗАПУСК ВІД ТОЧКИ (перемикання INPUT під час симуляції)
  const restartFromPoint = useCallback(
    (pointId, newValue) => {
      if (!isSimulating) return;

      console.log(
        `🔄 Перезапуск від точки ${pointId} (нове значення: ${newValue})`,
      );

      const point = pointsRef.current.find((p) => p.id === pointId);
      if (!point) return;

      simStateRef.current = {
        ...simStateRef.current,
        queue: [
          ...simStateRef.current.queue,
          {
            type: "from_point",
            point: { ...point, value: newValue },
            value: newValue,
          },
        ],
      };
    },
    [isSimulating],
  );

  // ⭐ РУЧНИЙ КРОК
  const runSingleSimulation = useCallback(() => {
    if (!isSimulating) return;
    executeStep();
  }, [isSimulating, executeStep]);

  // ⭐ АВТОСИМУЛЯЦІЯ
  useEffect(() => {
    if (!isSimulating) return;

    console.log("🔄 Запускаємо автосимуляцію");

    const interval = setInterval(() => {
      executeStep();
    }, 50);

    return () => {
      console.log("⏹️ Зупиняємо автосимуляцію");
      clearInterval(interval);
    };
  }, [isSimulating, executeStep]);

  // ⭐ РЕЄСТРАЦІЯ ГЛОБАЛЬНИХ ФУНКЦІЙ
  useEffect(() => {
    window.__runWorkspaceSimulation = runSingleSimulation;
    window.__restartFromPoint = restartFromPoint;
    return () => {
      delete window.__runWorkspaceSimulation;
      delete window.__restartFromPoint;
    };
  }, [runSingleSimulation, restartFromPoint]);

  return {
    connections,
    setConnections,
    runSingleSimulation,
    simulationStep: simStateRef.current.step,
    queueSize: simStateRef.current.queue.length,
  };
};
