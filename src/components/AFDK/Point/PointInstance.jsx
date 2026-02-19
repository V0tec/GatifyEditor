import Point from "./Point"; // ⬅️ ДОДАЙ ЦЕЙ ІМПОРТ

const PointInstance = ({
  point,
  isSelected,
  isPointMode,
  isWireMode,
  isSimulating, // ⬅️ ДОДАЙ ПРОП
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
        if (isWireMode) return;

        e.preventDefault();
        e.stopPropagation();

        // ⭐ В режимі симуляції — тільки toggle, не drag
        if (isSimulating) {
          if (point.type === "input") {
            onToggle?.(point.id);
          }
          return;
        }

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
