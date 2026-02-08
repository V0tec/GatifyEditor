import { useState } from "react";
import styles from "./Element.module.scss";
import { GATE_CONFIGS } from "../gateConfigs.jsx";

function Element({
  component,
  selected,
  onMouseDown,
  onContextMenu,
  onPortInvert,
}) {
  const config = GATE_CONFIGS[component.type];
  if (!config) return null;

  const portRadius = 6;

  const handlePortClick = (e, portId, portType) => {
    e.stopPropagation();
    e.preventDefault();
    onPortInvert(component.id, portId, portType);
  };

  return (
    <div
      className={styles.element}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
        border: selected ? "3px solid #007acc" : "2px solid #666",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: config.color,
        cursor: "grab",
        userSelect: "none",
        zIndex: selected ? 10 : 1,
        color: "black",
        fontWeight: "bold",
        borderRadius: "4px",
        boxShadow: selected
          ? "0 0 10px rgba(0,122,204,0.5)"
          : "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {/* Назва елемента */}
      <div style={{ fontSize: "14px" }}>
        {component.type}
        {component.inputCount > 1 && (
          <div style={{ fontSize: "10px", color: "#666" }}>
            {component.inputCount} входів
          </div>
        )}
      </div>

      {/* Входи з міні-проводами */}
      {component.inputs &&
        component.inputs.map((input, i) => {
          const isInverted = input.inverted || false;
          const isConnected = input.connected || false;
          const displayValue = isInverted
            ? input.value === 1
              ? 0
              : 1
            : input.value;

          return (
            <div key={input.id} style={{ position: "absolute" }}>
              {/* МІНІ-ПРОВІД - горизонтальна лінія */}
              <div
                style={{
                  position: "absolute",
                  left: input.localX,
                  top: input.localY,
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

              {/* КНОПКА ІНВЕРТОРА на краю елемента */}
              <div
                className={styles.port}
                style={{
                  position: "absolute",
                  left: input.wireEndX - portRadius,
                  top: input.wireEndY - portRadius,
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
                title={`Вхід ${i + 1} - клік для інвертування`}
              />

              {/* Значення біля порту */}
              {isConnected && (
                <div
                  style={{
                    position: "absolute",
                    left: input.wireEndX + 10,
                    top: input.wireEndY - 6,
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: displayValue === 1 ? "#4CAF50" : "#f44336",
                    pointerEvents: "none",
                  }}
                >
                  {displayValue}
                </div>
              )}

              {/* Індикатор інвертора на краю елемента */}
              {isInverted && (
                <div
                  style={{
                    position: "absolute",
                    left: input.wireEndX - portRadius - 3,
                    top: input.wireEndY - portRadius - 3,
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
        component.outputs.map((output, i) => {
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
                  left: output.localX,
                  top: output.localY,
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

              {/* КНОПКА ІНВЕРТОРА на краю елемента */}
              <div
                className={styles.port}
                style={{
                  position: "absolute",
                  left: output.localX - portRadius,
                  top: output.localY - portRadius,
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
                title={`Вихід ${i + 1} - клік для ${
                  isInverted ? "вимкнення" : "увімкнення"
                } інвертора`}
              />

              {/* Індикатор інвертора */}
              {isInverted && (
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

              {/* Значення біля порту */}
              {isConnected && (
                <div
                  style={{
                    position: "absolute",
                    left: output.localX - 15,
                    top: output.localY - 6,
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: displayValue === 1 ? "#4CAF50" : "#f44336",
                    pointerEvents: "none",
                  }}
                >
                  {displayValue}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default Element;
