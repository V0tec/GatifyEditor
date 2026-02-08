import Point from "./Point";

// PointInstance.jsx
const PointInstance = ({
  point,
  isSelected,
  isPointMode,
  isWireMode,
  onMouseDown,
  onContextMenu,
  onLabelChange,
  onToggle,
}) => {
  return (
    <Point
      {...point}
      selected={isSelected}
      onLabelChange={onLabelChange}
      onToggle={onToggle}
      onMouseDown={(e) => {
        // ⭐ В РЕЖИМІ ПРОВОДУ - НЕ БЛОКУЄМО PROPAGATION!
        if (isWireMode) {
          // Дозволяємо події піти далі до workspace
          return; // НЕ викликаємо e.stopPropagation()!
        }

        e.preventDefault();
        e.stopPropagation();
        onMouseDown?.(e, point.id);
      }}
      onContextMenu={(e) => {
        if (isPointMode || isWireMode) return;
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.(e, point.id);
      }}
    />
  );
};

export default PointInstance;
