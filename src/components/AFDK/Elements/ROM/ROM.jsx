import styles from "./ROM.module.scss";

function ROM({
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

  // Визначаємо назву ROM
  const romName =
    {
      ROM_16x4: "ROM 16×4",
      ROM_16x8: "ROM 16×8",
      ROM_256x8: "ROM 256×8",
      ROM_256x8_CS: "ROM 256×8 CS",
    }[component.type] || "ROM";

  // Формуємо відображення адреси та даних
  let displayInfo = "";
  if (component.state && component.inputs) {
    // Визначаємо розміри
    const addrBits =
      component.type === "ROM_256x8" || component.type === "ROM_256x8_CS"
        ? 8
        : 4;
    const dataBits = component.type === "ROM_16x4" ? 4 : 8;

    // Читаємо адресу
    const address = component.inputs
      .slice(0, addrBits)
      .map((inp) => {
        if (!inp.connected) return 0;
        const isInverted = inp.inverted || false;
        const rawValue = inp.value ?? 0;
        return isInverted ? (rawValue === 1 ? 0 : 1) : rawValue;
      })
      .reverse()
      .join("");
    const addr = parseInt(address, 2) || 0;

    // Читаємо дані з виходів
    const outputs = [];
    for (let i = 0; i < dataBits; i++) {
      const output = component.outputs[i];
      if (output) {
        outputs.push(output.value ?? 0);
      }
    }
    const dataValue = outputs.reverse().join("");
    const dataNum = parseInt(dataValue, 2) || 0;

    displayInfo = `[${addr}] = ${dataNum}`;
  }

  return (
    <div
      className={styles.rom}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
        border: selected ? "3px solid #007acc" : "2px solid #666",
        position: "absolute",
        backgroundColor: "#e8eaf6",
        cursor: "grab",
        userSelect: "none",
        zIndex: selected ? 10 : 1,
        borderRadius: "8px",
        boxShadow: selected
          ? "0 0 10px rgba(0,122,204,0.5)"
          : "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {/* Назва ROM */}
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
        {romName}
      </div>

      {/* Адреса та дані */}
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

      {/* Входи з міні-проводами */}
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
              {/* МІНІ-ПРОВІД */}
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

              {/* Порт входу */}
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
                title={`${input.label} - клік для інвертування`}
              />

              {/* Мітка входу */}
              <div
                style={{
                  position: "absolute",
                  left: input.wireEndX + 12 + component.width / 2,
                  top: input.wireEndY - 8 + component.height / 2 - 2,
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#333",
                  pointerEvents: "none",
                }}
              >
                {input.label}
              </div>

              {/* Індикатор інвертора */}
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

      {/* Виходи з міні-проводами */}
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
              {/* МІНІ-ПРОВІД */}
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

              {/* Порт виходу */}
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

              {/* Мітка виходу */}
              <div
                style={{
                  position: "absolute",
                  left: output.wireEndX - 48 + component.width / 2,
                  top: output.wireEndY - 8 + component.height / 2 - 2,
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#333",
                  pointerEvents: "none",
                }}
              >
                {output.label}
              </div>

              {/* Індикатор інвертора */}
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

export default ROM;
