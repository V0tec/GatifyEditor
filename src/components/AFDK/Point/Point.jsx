import "./Point.scss";

function Point({
  id,
  x,
  y,
  label,
  value = 1,
  type = "input", // ⭐ ДОДАНО - "input" або "output"
  selected,
  onToggle,
  onMouseDown,
  onContextMenu,
  onLabelChange,
}) {
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    const newLabel = prompt("Введіть назву змінної:", label || "A");
    if (newLabel && newLabel.trim()) {
      onLabelChange(id, newLabel.trim().toUpperCase());
    }
  };

  // ⭐ Колір залежить від типу та значення
  const getBackgroundColor = () => {
    if (type === "input") {
      return value === 1 ? "#4CAF50" : "#f44336"; // Зелений/Червоний
    } else {
      // output - залежить від отриманого сигналу
      return value === 1 ? "#4CAF50" : "#f44336"; // Зелений/Червоний
    }
  };

  return (
    <div
      className={`point ${selected ? "selected" : ""} ${type === "output" ? "output" : ""}`}
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        backgroundColor: getBackgroundColor(),
      }}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      <span>{label || "?"}</span>
    </div>
  );
}

export default Point;
