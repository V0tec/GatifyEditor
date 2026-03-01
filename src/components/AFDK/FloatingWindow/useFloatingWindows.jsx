import { useState, useCallback } from "react";

export const useFloatingWindows = () => {
  const [windows, setWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1000);

  // Відкрити вікно
  const openWindow = useCallback(
    (id, title, content, defaultPosition, defaultSize) => {
      setWindows((prev) => {
        // ⭐ Якщо вікно вже відкрите - ОНОВЛЮЄМО content і фокусуємо
        const existingWindow = prev.find((w) => w.id === id);
        if (existingWindow) {
          return prev.map((w) =>
            w.id === id
              ? {
                  ...w,
                  content, // ← ОНОВЛЮЄМО content!
                  zIndex: nextZIndex,
                  isMinimized: false,
                }
              : w,
          );
        }

        // Інакше додаємо нове вікно
        return [
          ...prev,
          {
            id,
            title,
            content,
            isMinimized: false,
            isMaximized: false,
            zIndex: nextZIndex,
            defaultPosition: defaultPosition || {
              x: 100 + prev.length * 30,
              y: 100 + prev.length * 30,
            },
            defaultSize: defaultSize || { width: 1000, height: 600 },
          },
        ];
      });
      setNextZIndex((z) => z + 1);
    },
    [nextZIndex],
  );

  // Закрити вікно
  const closeWindow = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Згорнути вікно
  const minimizeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  // Розгорнути вікно (maximize/restore)
  const maximizeWindow = useCallback((id, value) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: value } : w)),
    );
  }, []);

  // Фокус на вікно (піднімаємо zIndex)
  const focusWindow = useCallback(
    (id) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w)),
      );
      setNextZIndex((z) => z + 1);
    },
    [nextZIndex],
  );

  // Розгорнути згорнуте вікно
  const restoreWindow = useCallback(
    (id) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w,
        ),
      );
      setNextZIndex((z) => z + 1);
    },
    [nextZIndex],
  );

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    restoreWindow,
  };
};
