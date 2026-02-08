import { useState } from "react";
import styles from "./Trigger.module.scss";
import { GATE_CONFIGS } from "../gateConfigs.jsx";

function Trigger({
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

  // Визначаємо назву тригера
  const triggerName =
    {
      D_TRIGGER: "D-тригер",
      RS_TRIGGER: "RS-тригер",
      JK_TRIGGER: "JK-тригер",
      T_TRIGGER: "T-тригер",
    }[component.type] || "Тригер";

  return (
    <div
      className={styles.trigger}
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
          ? "0 0 10px rgba(0,122,204,0.5)"
          : "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {/* Назва тригера */}
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
        {triggerName}
      </div>

      {/* Стан тригера */}
      {component.state && (
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "9px",
            color: component.state.error ? "#f44336" : "#666",
            fontWeight: component.state.error ? "bold" : "normal",
          }}
        >
          {component.state.error ? "⚠️ ПОМИЛКА" : `Q=${component.state.Q}`}
        </div>
      )}

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
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#333",
                  pointerEvents: "none",
                }}
              >
                {input.label}
              </div>

              {/* Трикутник для CLK */}
              {input.label === "CLK" && (
                <div
                  style={{
                    position: "absolute",
                    left: input.wireEndX + 6 + component.width / 2,
                    top: input.wireEndY - 5 + component.height / 2,
                    width: 0,
                    height: 0,
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: "8px solid #333",
                    pointerEvents: "none",
                  }}
                />
              )}

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
                  fontSize: "12px",
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

export default Trigger;
