import styles from "./Clock.module.scss";

function Clock({
  component,
  selected,
  onMouseDown,
  onContextMenu,
  onPortInvert,
}) {
  const portRadius = 6;

  return (
    <div
      className={styles.clock}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
        border: selected ? "3px solid #007acc" : "2px solid #9C27B0",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#9C27B0",
        cursor: "grab",
        userSelect: "none",
        zIndex: selected ? 10 : 1,
        color: "white",
        fontWeight: "bold",
        borderRadius: "8px",
        boxShadow: selected
          ? "0 0 10px rgba(156, 39, 176, 0.8)"
          : "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ fontSize: "24px" }}>⏱️</div>
      <div style={{ fontSize: "10px" }}>CLOCK</div>

      {/* ВИХОДИ */}
      {component.outputs &&
        component.outputs.map((output, index) => {
          const displayValue = output.inverted
            ? component.state?.value === 1
              ? 0
              : 1
            : component.state?.value || 0;

          return (
            <div key={output.id} style={{ position: "absolute" }}>
              {/* МІНІ-ПРОВІД */}
              <div
                style={{
                  position: "absolute",
                  left: output.localX,
                  top: output.localY,
                  width: 20,
                  height: 2,
                  backgroundColor: displayValue === 1 ? "#4CAF50" : "#f44336",
                  pointerEvents: "none",
                }}
              />

              {/* ПОРТ */}
              <div
                style={{
                  position: "absolute",
                  left: output.localX - portRadius,
                  top: output.localY - portRadius,
                  width: portRadius * 2,
                  height: portRadius * 2,
                  backgroundColor: displayValue === 1 ? "#4CAF50" : "#f44336",
                  border: "2px solid #333",
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: 100,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPortInvert) {
                    onPortInvert(component.id, output.id, "output");
                  }
                }}
              />

              {/* МІТКА (CLK або CLK̅) */}
              <div
                style={{
                  position: "absolute",
                  left: output.localX - 35,
                  top: output.localY - 6,
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "white",
                  pointerEvents: "none",
                }}
              >
                <span style={{ position: "relative", display: "inline-block" }}>
                  {output.label}
                  {/* ⭐ ПОЛОСКА ЗВЕРХУ */}
                  {output.inverted && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-1px",
                        left: "0",
                        width: "100%",
                        height: "1px",
                        backgroundColor: "white",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </span>
              </div>
              {/* ЗНАЧЕННЯ */}
              <div
                style={{
                  position: "absolute",
                  left: output.wireEndX + (output.valueOffsetX || 10),
                  top: output.localY - 6,
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: displayValue === 1 ? "#4CAF50" : "#f44336",
                  pointerEvents: "none",
                }}
              >
                {displayValue}
              </div>

              {/* ⭐ ІНДИКАТОР ІНВЕРТОРА */}
              {output.inverted && (
                <div
                  style={{
                    position: "absolute",
                    left: output.localX - portRadius - 3,
                    top: output.localY - portRadius - 3,
                    width: portRadius * 2 + 6,
                    height: portRadius * 2 + 6,
                    border: "2px solid #ff9800",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          );
        })}
    </div>
  );
}

export default Clock;
