import "./Wire.scss";

const Wire = ({
  x,
  y,
  direction,
  selected = false,
  active = false,
  value = 0, // ← ДОДАЛИ
  onMouseDown,
  onContextMenu,
  style = {},
}) => {
  let wireStyle = {
    left: x,
    top: y,
    ...style,
  };

  if (direction === "right" || direction === "left") {
    wireStyle.width = "20px";
    wireStyle.height = "2px";
  } else {
    wireStyle.width = "2px";
    wireStyle.height = "20px";
  }

  // ⭐ ОНОВЛЕНО: Підсвічування активних проводів з урахуванням value
  if (active) {
    // Колір залежить від значення сигналу
    const color = value === 1 ? "#4CAF50" : "#FF5722"; // Зелений для 1, Червоний для 0

    wireStyle.backgroundColor = color;
    wireStyle.boxShadow = `0 0 4px ${color}`;
    wireStyle.height =
      direction === "right" || direction === "left" ? "3px" : wireStyle.height;
    wireStyle.width =
      direction === "down" || direction === "up" ? "3px" : wireStyle.width;
  }

  // Виділення
  if (selected) {
    wireStyle.backgroundColor = "#007acc";
    wireStyle.boxShadow = "0 0 0 1px #007acc";
    wireStyle.zIndex = 10;
  }

  return (
    <div
      className={`wire ${direction} ${selected ? "selected" : ""} ${
        active ? "active" : ""
      }`}
      style={wireStyle}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
    />
  );
};

export default Wire;
