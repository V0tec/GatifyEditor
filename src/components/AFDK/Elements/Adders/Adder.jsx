import styles from "./Adder.module.scss";

function Adder({
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

  // Визначаємо назву суматора
  const adderName =
    {
      HALF_ADDER: "Half Adder",
      FULL_ADDER: "Full Adder",
      ADDER_4BIT: "4-bit Adder",
      ADDER_8BIT: "8-bit Adder",
    }[component.type] || "Adder";

  // Формуємо бінарні числа для відображення (для 4-bit та 8-bit)
  let displayInfo = "";
  let signInfo = "";

  if (component.type === "ADDER_4BIT") {
    const A = component.inputs
      .slice(0, 4)
      .map((inp) => (inp.inverted ? (inp.value === 1 ? 0 : 1) : inp.value))
      .reverse()
      .join("");
    const B = component.inputs
      .slice(4, 8)
      .map((inp) => (inp.inverted ? (inp.value === 1 ? 0 : 1) : inp.value))
      .reverse()
      .join("");

    // ✅ Правильно читаємо Cin
    const CinInput = component.inputs[8];
    const Cin = CinInput
      ? CinInput.inverted
        ? CinInput.value === 1
          ? 0
          : 1
        : CinInput.value
      : 0;

    const numA = parseInt(A, 2) || 0;
    const numB = parseInt(B, 2) || 0;
    const sum = numA + numB + Cin;
    const numS = sum & 0x0f; // Маска 4 біти
    const Cout = sum > 15 ? 1 : 0;

    // Визначаємо знак (MSB = Most Significant Bit)
    const signBit = component.outputs[3]?.value || 0; // S3 = старший біт
    const signedValue = signBit === 1 ? numS - 16 : numS; // Two's complement
    signInfo = `(${signBit === 1 ? "-" : "+"}${Math.abs(signedValue)})`;

    displayInfo = `${numA} + ${numB} + ${Cin} = ${numS}${Cout ? " +C" : ""}`;
  } else if (component.type === "ADDER_8BIT") {
    const A = component.inputs
      .slice(0, 8)
      .map((inp) => (inp.inverted ? (inp.value === 1 ? 0 : 1) : inp.value))
      .reverse()
      .join("");
    const B = component.inputs
      .slice(8, 16)
      .map((inp) => (inp.inverted ? (inp.value === 1 ? 0 : 1) : inp.value))
      .reverse()
      .join("");

    // ✅ Правильно читаємо Cin
    const CinInput = component.inputs[16];
    const Cin = CinInput
      ? CinInput.inverted
        ? CinInput.value === 1
          ? 0
          : 1
        : CinInput.value
      : 0;

    const numA = parseInt(A, 2) || 0;
    const numB = parseInt(B, 2) || 0;
    const sum = numA + numB + Cin;
    const numS = sum & 0xff; // Маска 8 біт
    const Cout = sum > 255 ? 1 : 0;

    // Визначаємо знак (MSB = Most Significant Bit)
    const signBit = component.outputs[7]?.value || 0; // S7 = старший біт
    const signedValue = signBit === 1 ? numS - 256 : numS; // Two's complement
    signInfo = `(${signBit === 1 ? "-" : "+"}${Math.abs(signedValue)})`;

    displayInfo = `${numA} + ${numB} + ${Cin} = ${numS}${Cout ? " +C" : ""}`;
  }

  return (
    <div
      className={styles.adder}
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
      {/* Назва суматора */}
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
        {adderName}
      </div>

      {/* Результат обчислення */}
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
            lineHeight: "1.3",
          }}
        >
          <div>{displayInfo}</div>
          {signInfo && (
            <div style={{ fontSize: "8px", color: "#888", marginTop: "2px" }}>
              Signed: {signInfo}
            </div>
          )}
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

export default Adder;
