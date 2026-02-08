import { useState, useCallback, useRef } from "react";

// ⭐ ДИНАМІЧНЕ ОБМЕЖЕННЯ
const calculateMaxHistory = (state) => {
  const totalElements =
    state.components.length + state.wires.length + state.points.length;

  // Маленька схема (< 50 елементів) → 50 станів
  if (totalElements < 50) return 50;

  // Середня схема (50-150 елементів) → 30 станів
  if (totalElements < 150) return 30;

  // Велика схема (150-300 елементів) → 20 станів
  if (totalElements < 300) return 20;

  // Гігантська схема (300+ елементів) → 10 станів
  return 10;
};

export const useHistory = (
  initialState = { components: [], wires: [], points: [] },
) => {
  const [history, setHistory] = useState([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isRestoringRef = useRef(false);

  const currentState = history[historyIndex];

  const saveState = useCallback(
    (newState) => {
      if (isRestoringRef.current) {
        return;
      }

      const currentState = history[historyIndex];

      // Порівняння
      const currentJSON = JSON.stringify({
        components: currentState.components,
        wires: currentState.wires,
        points: currentState.points,
      });

      const newJSON = JSON.stringify({
        components: newState.components,
        wires: newState.wires,
        points: newState.points,
      });

      if (currentJSON === newJSON) {
        return;
      }

      const stateCopy = {
        components: JSON.parse(JSON.stringify(newState.components)),
        wires: JSON.parse(JSON.stringify(newState.wires)),
        points: JSON.parse(JSON.stringify(newState.points)),
      };

      setHistory((prev) => {
        let newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(stateCopy);

        // ⭐ ДИНАМІЧНЕ ОБМЕЖЕННЯ
        const maxHistory = calculateMaxHistory(stateCopy);

        if (newHistory.length > maxHistory) {
          const toRemove = newHistory.length - maxHistory;

          newHistory = newHistory.slice(toRemove);
        }

        return newHistory;
      });

      setHistoryIndex((prev) => {
        const maxHistory = calculateMaxHistory(stateCopy);
        return Math.min(prev + 1, maxHistory - 1);
      });
    },
    [historyIndex, history],
  );

  // ⭐ UNDO
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isRestoringRef.current = true;
      setHistoryIndex(historyIndex - 1);

      setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);

      return history[historyIndex - 1];
    }
    return null;
  }, [history, historyIndex]);

  // ⭐ REDO
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isRestoringRef.current = true;
      setHistoryIndex(historyIndex + 1);

      setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);

      return history[historyIndex + 1];
    }
    return null;
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    currentState,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    historyIndex,
    historyLength: history.length,
  };
};
