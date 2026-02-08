import styles from "./Workspace.module.scss";
import Element from "../Elements/LogicGates/Element";
import Trigger from "../Elements/Triggers/Trigger";
import ContextMenu from "./ContextMenu/ContextMenu";
import Wire from "../Wire/Wire";
import PointInstance from "../Point/PointInstance";
import Junction from "../Junction/Junction";
import Clock from "../Elements/Generators/Clock";
import Multiplexer from "../Elements/Multiplexers/Multiplexer"; // ⭐ ДОДАНО
import Demultiplexer from "../Elements/Demultiplexers/Demultiplexer"; // ⭐ ДОДАНО
import WireInstance from "../Wire/WireInstance";
import Decoder from "../Elements/Decoders/Decoder";
import Adder from "../Elements/Adders/Adder";
import Register from "../Elements/Registers/Register";
import Comparator from "../Elements/Comparators/Comparator";
import Counter from "../Elements/Counters/Counter";
import RAM from "../Elements/RAM/RAM";
import ALU from "../Elements/ALU/ALU";
import ROM from "../Elements/ROM/ROM";
import Encoder from "../Elements/Encoder/Encoder";

const WorkspaceView = ({
  mousePosition,
  // Дані (State)
  zoom,
  components,
  wires,
  points,
  junctions,
  gridSize,
  selectionBox,
  previewWire,
  selectedIds,
  selectedWireIds,
  selectedPointIds,
  isWireMode,
  isPointMode,
  isDrawingWire,
  currentWireStart,
  workspaceMenuPos,
  elementMenuPos,

  // Константи
  GRID_SIZE,
  WORKSPACE_LIMIT,

  // Рефи
  workspaceRef,
  workspaceContentRef,

  // Обробники подій (Handlers)
  handleDrop,
  handleDragOver,
  handleMouseDownWorkspace,
  handleWorkspaceContext,
  handleWireClick,
  handleWireDragStart,
  handleElementContext,
  handleMouseDownElement,
  handlePortInvert,
  handlePointSelect,
  handlePointDragStart,
  handlePointLabelChange,
  handlePointToggle,
  closeAllMenus,
  workspaceOptions,
  elementOptions,
}) => {
  return (
    <div
      ref={workspaceRef}
      className={`${styles.workspace} ${isWireMode ? styles.wireMode : ""} ${
        isPointMode ? styles.pointMode : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDownWorkspace}
      onContextMenu={handleWorkspaceContext}
      tabIndex={0}
      style={{
        position: "relative",
        overflow: "auto",
        backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
      }}
    >
      {/* Координати миші */}
      <div
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#0f0",
          padding: "5px 10px",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "12px",
          zIndex: 10000,
          pointerEvents: "none",
        }}
      >
        X: {mousePosition.x} | Y: {mousePosition.y}
      </div>

      <div
        ref={workspaceContentRef}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
          width: `${WORKSPACE_LIMIT}px`,
          height: `${WORKSPACE_LIMIT}px`,
          position: "relative",
        }}
      >
        {/* SVG сітка */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${gridSize.width / zoom}px`,
            height: `${gridSize.height / zoom}px`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <defs>
            <pattern
              id="grid"
              width={GRID_SIZE}
              height={GRID_SIZE}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            width={gridSize.width / zoom}
            height={gridSize.height / zoom}
            fill="url(#grid)"
          />
        </svg>

        {wires.map((wire) => (
          <WireInstance
            key={wire.id}
            wire={wire}
            isSelected={selectedWireIds.includes(wire.id)}
            isWireMode={isWireMode}
            isPointMode={isPointMode}
            onSelect={handleWireClick}
            onStartDrag={handleWireDragStart}
            onOpenMenu={handleElementContext}
          />
        ))}

        {junctions.map((junction) => (
          <Junction key={junction.id} junction={junction} onClick={() => {}} />
        ))}

        {previewWire &&
          previewWire.map((wire, index) => (
            <Wire
              key={`preview-${index}`}
              {...wire}
              style={{ opacity: 0.7, backgroundColor: "#4CAF50" }}
            />
          ))}

        {isDrawingWire && currentWireStart && (
          <div
            style={{
              position: "absolute",
              left: currentWireStart.x - 3,
              top: currentWireStart.y - 3,
              width: 6,
              height: 6,
              backgroundColor: "#4CAF50",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 1001,
            }}
          />
        )}

        {/* ⭐ Selection Box - ПЕРЕНЕСЛИ ВСЕРЕДИНУ */}
        {selectionBox && !isWireMode && !isPointMode && (
          <div
            style={{
              position: "absolute",
              left: Math.min(selectionBox.startX, selectionBox.endX),
              top: Math.min(selectionBox.startY, selectionBox.endY),
              width: Math.abs(selectionBox.endX - selectionBox.startX),
              height: Math.abs(selectionBox.endY - selectionBox.startY),
              border: "1px dashed #007acc",
              backgroundColor: "rgba(0, 122, 204, 0.1)",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />
        )}

        {/* ⭐ КОМПОНЕНТИ - ОНОВЛЕНА ЛОГІКА */}
        {components.map((c) => {
          // Тригери
          if (
            c.type === "D_TRIGGER" ||
            c.type === "RS_TRIGGER" ||
            c.type === "JK_TRIGGER" ||
            c.type === "T_TRIGGER"
          ) {
            return (
              <Trigger
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // Clock
          if (c.type === "CLOCK") {
            return (
              <Clock
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // ⭐ МУЛЬТИПЛЕКСОРИ
          if (c.type === "MUX2" || c.type === "MUX4" || c.type === "MUX8") {
            return (
              <Multiplexer
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // ⭐ ДЕМУЛЬТИПЛЕКСОРИ
          if (
            c.type === "DEMUX2" ||
            c.type === "DEMUX4" ||
            c.type === "DEMUX8"
          ) {
            return (
              <Demultiplexer
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // ⭐ ДЕШИФРАТОРИ
          if (
            c.type === "DECODER2" ||
            c.type === "DECODER3" ||
            c.type === "DECODER4"
          ) {
            return (
              <Decoder
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // ⭐ СУМАТОРИ
          if (
            c.type === "HALF_ADDER" ||
            c.type === "FULL_ADDER" ||
            c.type === "ADDER_4BIT" ||
            c.type === "ADDER_8BIT"
          ) {
            return (
              <Adder
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // Регістри
          if (
            c.type === "REGISTER_4BIT" ||
            c.type === "REGISTER_8BIT" ||
            c.type === "SHIFT_REGISTER_4BIT" ||
            c.type === "SHIFT_REGISTER_8BIT"
          ) {
            return (
              <Register
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // Компаратори
          if (
            c.type === "COMPARATOR_1BIT" ||
            c.type === "COMPARATOR_4BIT" ||
            c.type === "COMPARATOR_8BIT"
          ) {
            return (
              <Comparator
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // Лічильники
          if (
            c.type === "COUNTER_4BIT" ||
            c.type === "COUNTER_8BIT" ||
            c.type === "COUNTER_4BIT_UP"
          ) {
            return (
              <Counter
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // RAM
          if (
            c.type === "RAM_16x4" ||
            c.type === "RAM_16x8" ||
            c.type === "RAM_256x8" ||
            c.type === "RAM_256x8_CS"
          ) {
            return (
              <RAM
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // ROM
          if (
            c.type === "ROM_16x4" ||
            c.type === "ROM_16x8" ||
            c.type === "ROM_256x8" ||
            c.type === "ROM_256x8_CS"
          ) {
            return (
              <ROM
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // ALU
          if (c.type === "ALU_4BIT" || c.type === "ALU_8BIT") {
            return (
              <ALU
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // Encoder
          if (
            c.type === "ENCODER_4_2" ||
            c.type === "ENCODER_8_3" ||
            c.type === "ENCODER_16_4"
          ) {
            return (
              <Encoder
                key={c.id}
                component={c}
                selected={selectedIds.includes(c.id)}
                onMouseDown={(e) => handleMouseDownElement(e, c.id)}
                onContextMenu={(e) => handleElementContext(e, c.id)}
                onPortInvert={handlePortInvert}
              />
            );
          }

          // Звичайні логічні елементи (AND, OR, NOT, NAND, NOR, XOR, XNOR)
          return (
            <Element
              key={c.id}
              component={c}
              selected={selectedIds.includes(c.id)}
              onMouseDown={(e) => handleMouseDownElement(e, c.id)}
              onContextMenu={(e) => handleElementContext(e, c.id)}
              onPortInvert={handlePortInvert}
            />
          );
        })}

        {points.map((point) => (
          <PointInstance
            key={point.id}
            point={point}
            isSelected={selectedPointIds.includes(point.id)}
            isPointMode={isPointMode}
            isWireMode={isWireMode}
            onMouseDown={handleMouseDownElement}
            onContextMenu={handleElementContext}
            onLabelChange={handlePointLabelChange}
          />
        ))}
      </div>

      {/* Контекстні меню - ЗАЛИШАЮТЬСЯ ЗОВНІ */}
      {workspaceMenuPos && !isWireMode && !isPointMode && (
        <ContextMenu
          x={workspaceMenuPos.x}
          y={workspaceMenuPos.y}
          options={workspaceOptions}
          onClose={closeAllMenus}
        />
      )}

      {elementMenuPos && !isWireMode && !isPointMode && (
        <ContextMenu
          x={elementMenuPos.x}
          y={elementMenuPos.y}
          options={elementOptions}
          onClose={closeAllMenus}
        />
      )}
    </div>
  );
};

export default WorkspaceView;
