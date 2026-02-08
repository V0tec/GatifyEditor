import Wire from "./Wire";

const WireInstance = ({
  wire,
  isSelected,
  isWireMode,
  isPointMode,
  onSelect,
  onStartDrag,
  onOpenMenu,
}) => {
  const handleMouseDown = (e) => {
    // ⭐ В РЕЖИМІ ПРОВОДУ - НЕ БЛОКУЄМО PROPAGATION!
    if (isWireMode) {
      // Дозволяємо події піти далі до workspace для завершення проводу
      return; // НЕ викликаємо onSelect і stopPropagation!
    }

    e.preventDefault();
    e.stopPropagation();

    onStartDrag(e, wire.id);
  };

  const handleRightClick = (e) => {
    if (isWireMode || isPointMode) return;
    onOpenMenu(e, wire.id);
  };

  return (
    <Wire
      {...wire}
      selected={isSelected}
      active={wire.active}
      onMouseDown={handleMouseDown}
      onContextMenu={handleRightClick}
    />
  );
};

export default WireInstance;
