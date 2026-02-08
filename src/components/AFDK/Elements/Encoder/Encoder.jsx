import styles from "./Encoder.module.scss";

function Encoder({
  component,
  selected,
  onMouseDown,
  onContextMenu,
  onPortInvert,
}) {
  const portRadius = 6;

  const handlePortClick = (e, portId, portType) => {
    e.stopPropagation();
    e.preventDefault();
    onPortInvert(component.id, portId, portType);
  };

  // Визначаємо назву
  const encoderName =
    {
      ENCODER_4_2: "ENC 4:2",
      ENCODER_8_3: "ENC 8:3",
      ENCODER_16_4: "ENC 16:4",
    }[component.type] || "Encoder";

  // Формуємо відображення
  let displayInfo = "";
  if (component.inputs && component.outputs) {
    // Знаходимо який вхід активний
    let activeInput = -1;
    for (let i = component.inputs.length - 1; i >= 0; i--) {
      const inp = component.inputs[i];
      if (!inp.connected) continue;
      const isInverted = inp.inverted || false;
      const value = isInverted ? (inp.value === 1 ? 0 : 1) : inp.value;
      if (value === 1) {
        activeInput = i;
        break;
      }
    }

    if (activeInput >= 0) {
      displayInfo = `I${activeInput} → ${activeInput}`;
    }
  }

  return (
    <div
      className={styles.encoder}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
        border: selected ? "3px solid #007acc" : "2px solid #666",
        position: "absolute",
        backgroundColor: "#fff9c4",
        cursor: "grab",
        userSelect: "none",
        zIndex: selected ? 10 : 1,
        borderRadius: "8px",
        boxShadow: selected
          ? "0 0 10px rgba(0,122,204,0.5)"
          : "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {/* Назва */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {encoderName}
      </div>

      {/* Інфо */}
      {displayInfo && (
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "9px",
            color: "#666",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {displayInfo}
        </div>
      )}

      {/* Входи */}
      {component.inputs &&
        component.inputs.map((input) => {
          const isInverted = input.inverted || false;
          const isConnected = input.connected || false;
          const displayValue = isInverted
            ? input.value === 1
              ? 0
              : 1
            : input.value;

          return (
            <div key={input.id} style={{ position: "absolute" }}>
              <div
                style={{
                  position: "absolute",
                  left: input.localX + component.width / 2 - 2,
                  top: input.localY + component.height / 2 - 2,
                  width: 20,
                  height: 2,
                  backgroundColor: selected
                    ? "#007acc"
                    : isConnected
                      ? displayValue === 1
                        ? "#4CAF50"
                        : "#f44336"
                      : "#fff",
                  boxShadow: selected ? "0 0 0 1px #007acc" : "none",
                  pointerEvents: "none",
                }}
              />

              <div
                className={styles.port}
                style={{
                  position: "absolute",
                  left: input.wireEndX - portRadius + component.width / 2,
                  top: input.wireEndY - portRadius + component.height / 2 - 1,
                  width: portRadius * 2,
                  height: portRadius * 2,
                  backgroundColor: isConnected
                    ? displayValue === 1
                      ? "#4CAF50"
                      : "#f44336"
                    : "#666",
                  border: "2px solid #333",
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: 100,
                }}
                onClick={(e) => handlePortClick(e, input.id, "input")}
                title={`${input.label}`}
              />

              <div
                style={{
                  position: "absolute",
                  left: input.wireEndX + 12 + component.width / 2,
                  top: input.wireEndY - 8 + component.height / 2 - 2,
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#333",
                  pointerEvents: "none",
                }}
              >
                {input.label}
              </div>

              {isInverted && (
                <div
                  style={{
                    position: "absolute",
                    left: input.wireEndX - portRadius - 3 + component.width / 2,
                    top: input.wireEndY - portRadius - 3 + component.height / 2,
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

      {/* Виходи */}
      {component.outputs &&
        component.outputs.map((output) => {
          const isInverted = output.inverted || false;
          const isConnected = output.connected || false;
          const displayValue = isInverted
            ? output.value === 1
              ? 0
              : 1
            : output.value;

          return (
            <div key={output.id} style={{ position: "absolute" }}>
              <div
                style={{
                  position: "absolute",
                  left: output.localX + component.width / 2,
                  top: output.localY + component.height / 2 - 2,
                  width: 20,
                  height: 2,
                  backgroundColor: selected
                    ? "#007acc"
                    : isConnected
                      ? displayValue === 1
                        ? "#4CAF50"
                        : "#f44336"
                      : "#fff",
                  boxShadow: selected ? "0 0 0 1px #007acc" : "none",
                  pointerEvents: "none",
                }}
              />

              <div
                className={styles.port}
                style={{
                  position: "absolute",
                  left: output.wireEndX - portRadius + component.width / 2 - 25,
                  top: output.wireEndY - portRadius + component.height / 2 - 1,
                  width: portRadius * 2,
                  height: portRadius * 2,
                  backgroundColor: isConnected
                    ? displayValue === 1
                      ? "#4CAF50"
                      : "#f44336"
                    : "#666",
                  border: isInverted ? "3px solid #ff9800" : "2px solid #333",
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: 100,
                  pointerEvents: "auto",
                }}
                onClick={(e) => handlePortClick(e, output.id, "output")}
                title={`${output.label}`}
              />

              <div
                style={{
                  position: "absolute",
                  left: output.wireEndX - 48 + component.width / 2,
                  top: output.wireEndY - 8 + component.height / 2 - 2,
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#333",
                  pointerEvents: "none",
                }}
              >
                {output.label}
              </div>

              {isInverted && (
                <div
                  style={{
                    position: "absolute",
                    left:
                      output.wireEndX - portRadius - 28 + component.width / 2,
                    top:
                      output.wireEndY - portRadius - 3 + component.height / 2,
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

export default Encoder;
