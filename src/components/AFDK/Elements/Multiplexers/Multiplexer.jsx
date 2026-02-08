import { useState } from "react";
import styles from "./Multiplexer.module.scss";
import { GATE_CONFIGS } from "../gateConfigs.jsx";

function Multiplexer({
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
      className={styles.multiplexer}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
        border: selected ? "3px solid #007acc" : "2px solid #666",
        position: "absolute",
        backgroundColor: config.color,
        cursor: "grab",
        userSelect: "none",
        zIndex: selected ? 10 : 1,
        borderRadius: "8px",
        boxShadow: selected
          ? "0 0 10px rgba(156,39,176,0.5)"
          : "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {/* Назва мультиплексора */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "14px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        {component.type}
      </div>

      {/* Підпис */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "10px",
          color: "white",
        }}
      >
        {component.inputCount} входів
      </div>

      {/* Входи з міні-проводами */}
      {component.inputs &&
        component.inputs.map((input, i) => {
          const isInverted = input.inverted || false;
          const isConnected = input.connected || false;
          const isVertical = input.vertical || false; // ⭐ Читаємо vertical
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
                  left: input.localX,
                  top: input.localY,
                  // ⭐ Для вертикальних (селекторів) - width=2, height=20
                  // Для горизонтальних (даних) - width=20, height=2
                  width: isVertical ? 2 : 20,
                  height: isVertical ? 20 : 2,
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
                title={`${input.label} - клік для інвертування`}
              />

              {/* Мітка входу */}
              <div
                style={{
                  position: "absolute",
                  left: isVertical ? input.wireEndX - 10 : input.wireEndX + 12,
                  top: isVertical ? input.wireEndY + 8 : input.wireEndY - 8,
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "white",
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

              {/* Порт виходу */}
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
                title={`${output.label}`}
              />

              {/* Мітка виходу */}
              <div
                style={{
                  position: "absolute",
                  left: output.wireEndX - 28,
                  top: output.wireEndY - 8,
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "white",
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
                    left: output.wireEndX - portRadius - 28,
                    top: output.wireEndY - portRadius - 3,
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

export default Multiplexer;
