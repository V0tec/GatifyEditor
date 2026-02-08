import { useState, useCallback, useRef } from "react";

/**
 * Hook для управління виділенням елементів (components, wires, points)
 * Централізує всю логіку виділення в одному місці
 */
export const useSelection = (wires) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedWireIds, setSelectedWireIds] = useState([]);
  const [selectedPointIds, setSelectedPointIds] = useState([]);

  // ⭐ Реф для затримки одиночного кліку на проводах
  const clickTimeoutRef = useRef(null);

  /**
   * Очистити всі виділення
   */
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectedWireIds([]);
    setSelectedPointIds([]);
  }, []);

  /**
   * ⭐ ГОЛОВНА ЛОГІКА ВИДІЛЕННЯ ЕЛЕМЕНТІВ
   * Обробляє клік по елементу з урахуванням:
   * - Чи елемент вже виділений
   * - Shift для додавання/видалення
   * - Alt для додавання невиділеного елемента до фокусу
   * - Подвійний клік для групи проводів
   */
  const handleElementClick = useCallback(
    (id, type, isShift = false, isDoubleClick = false, isAlt = false) => {
      const isAlreadySelected =
        type === "component"
          ? selectedIds.includes(id)
          : type === "wire"
            ? selectedWireIds.includes(id)
            : selectedPointIds.includes(id);

      // ⭐ ПОДВІЙНИЙ КЛІК НА ПРОВІД - виділяємо всю групу
      if (isDoubleClick && type === "wire") {
        const wire = wires.find((w) => w.id === id);
        if (!wire) return { selectedIds, selectedWireIds, selectedPointIds };

        const wireGroupSegments = wires.filter(
          (w) => w.wireGroupId === wire.wireGroupId,
        );
        const groupIds = wireGroupSegments.map((w) => w.id);

        if (isShift || isAlt) {
          const newWireIds = [...new Set([...selectedWireIds, ...groupIds])];
          setSelectedWireIds(newWireIds);
          return { selectedIds, selectedWireIds: newWireIds, selectedPointIds };
        } else {
          setSelectedWireIds(groupIds);
          setSelectedIds([]);
          setSelectedPointIds([]);
          return {
            selectedIds: [],
            selectedWireIds: groupIds,
            selectedPointIds: [],
          };
        }
      }

      // ⭐ SHIFT - додавання/видалення з фокусу
      if (isShift) {
        if (type === "component") {
          const newIds = selectedIds.includes(id)
            ? selectedIds.filter((sid) => sid !== id)
            : [...selectedIds, id];
          setSelectedIds(newIds);
          return { selectedIds: newIds, selectedWireIds, selectedPointIds };
        } else if (type === "wire") {
          const newWireIds = selectedWireIds.includes(id)
            ? selectedWireIds.filter((wid) => wid !== id)
            : [...selectedWireIds, id];
          setSelectedWireIds(newWireIds);
          return { selectedIds, selectedWireIds: newWireIds, selectedPointIds };
        } else if (type === "point") {
          const newPointIds = selectedPointIds.includes(id)
            ? selectedPointIds.filter((pid) => pid !== id)
            : [...selectedPointIds, id];
          setSelectedPointIds(newPointIds);
          return {
            selectedIds,
            selectedWireIds,
            selectedPointIds: newPointIds,
          };
        }
      }

      // ⭐ ALT - додати елемент до існуючого фокусу
      if (isAlt) {
        if (type === "component") {
          const newIds = [...new Set([...selectedIds, id])];
          setSelectedIds(newIds);
          return { selectedIds: newIds, selectedWireIds, selectedPointIds };
        } else if (type === "wire") {
          const newWireIds = [...new Set([...selectedWireIds, id])];
          setSelectedWireIds(newWireIds);
          return { selectedIds, selectedWireIds: newWireIds, selectedPointIds };
        } else if (type === "point") {
          const newPointIds = [...new Set([...selectedPointIds, id])];
          setSelectedPointIds(newPointIds);
          return {
            selectedIds,
            selectedWireIds,
            selectedPointIds: newPointIds,
          };
        }
      }

      // ⭐ ЗВИЧАЙНИЙ КЛІК ПО НЕВИДІЛЕНОМУ - замінити фокус
      if (!isAlreadySelected) {
        if (type === "component") {
          setSelectedIds([id]);
          setSelectedWireIds([]);
          setSelectedPointIds([]);
          return {
            selectedIds: [id],
            selectedWireIds: [],
            selectedPointIds: [],
          };
        } else if (type === "wire") {
          setSelectedWireIds([id]);
          setSelectedIds([]);
          setSelectedPointIds([]);
          return {
            selectedIds: [],
            selectedWireIds: [id],
            selectedPointIds: [],
          };
        } else if (type === "point") {
          setSelectedPointIds([id]);
          setSelectedIds([]);
          setSelectedWireIds([]);
          return {
            selectedIds: [],
            selectedWireIds: [],
            selectedPointIds: [id],
          };
        }
      }

      // ⭐ КЛІК ПО ВИДІЛЕНОМУ - нічого не робимо, повертаємо поточний стан
      return { selectedIds, selectedWireIds, selectedPointIds };
    },
    [selectedIds, selectedWireIds, selectedPointIds, wires],
  );

  /**
   * Виділити component (старий API, залишаємо для сумісності)
   */
  const selectComponent = useCallback(
    (id, isShift = false) => {
      handleElementClick(id, "component", isShift, false);
    },
    [handleElementClick],
  );

  /**
   * Виділити wire (старий API, залишаємо для сумісності)
   */
  const selectWire = useCallback(
    (id, isShift = false) => {
      handleElementClick(id, "wire", isShift, false);
    },
    [handleElementClick],
  );

  /**
   * Виділити point (старий API, залишаємо для сумісності)
   */
  const selectPoint = useCallback(
    (id, isShift = false) => {
      handleElementClick(id, "point", isShift, false);
    },
    [handleElementClick],
  );

  /**
   * Виділити множину елементів (для selection box)
   */
  const selectMultiple = useCallback(
    (componentIds = [], wireIds = [], pointIds = [], append = false) => {
      if (append) {
        setSelectedIds((prev) => [...new Set([...prev, ...componentIds])]);
        setSelectedWireIds((prev) => [...new Set([...prev, ...wireIds])]);
        setSelectedPointIds((prev) => [...new Set([...prev, ...pointIds])]);
      } else {
        setSelectedIds(componentIds);
        setSelectedWireIds(wireIds);
        setSelectedPointIds(pointIds);
      }
    },
    [],
  );

  /**
   * Перевірка чи елемент виділений
   */
  const isSelected = useCallback(
    (id, type = "component") => {
      switch (type) {
        case "component":
          return selectedIds.includes(id);
        case "wire":
          return selectedWireIds.includes(id);
        case "point":
          return selectedPointIds.includes(id);
        default:
          return false;
      }
    },
    [selectedIds, selectedWireIds, selectedPointIds],
  );

  /**
   * Отримати загальну кількість виділених елементів
   */
  const getTotalSelectedCount = useCallback(() => {
    return (
      selectedIds.length + selectedWireIds.length + selectedPointIds.length
    );
  }, [selectedIds, selectedWireIds, selectedPointIds]);

  /**
   * Отримати всі виділені елементи як єдиний список
   */
  const getAllSelected = useCallback(() => {
    return {
      components: selectedIds,
      wires: selectedWireIds,
      points: selectedPointIds,
      total:
        selectedIds.length + selectedWireIds.length + selectedPointIds.length,
    };
  }, [selectedIds, selectedWireIds, selectedPointIds]);

  return {
    // Стейт
    selectedIds,
    selectedWireIds,
    selectedPointIds,

    // Сеттери
    setSelectedIds,
    setSelectedWireIds,
    setSelectedPointIds,

    // ⭐ ГОЛОВНИЙ МЕТОД
    handleElementClick,

    // Методи
    clearSelection,
    selectComponent,
    selectWire,
    selectPoint,
    selectMultiple,
    isSelected,
    getTotalSelectedCount,
    getAllSelected,
  };
};
