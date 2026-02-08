import React, { useRef, useEffect } from "react";
import { getPointColor } from "./timingDiagramUtils";
import styles from "./DiagramCanvas.module.scss";

const TICK_WIDTH = 40; // Ширина одного тіку
const ROW_HEIGHT = 60; // Висота одного рядка
const PADDING_LEFT = 60; // Відступ зліва для підписів
const PADDING_TOP = 40; // Відступ зверху

function DiagramCanvas({ points, selectedPoints, ticks, onPointClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Очищаємо canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малюємо сітку та часову вісь
    drawGrid(ctx, ticks.length);

    // Малюємо сигнали
    selectedPoints.forEach((pointId, rowIndex) => {
      const point = points.find((p) => p.id === pointId);
      if (!point) return;

      drawSignal(ctx, point, ticks, rowIndex);
    });
  }, [points, selectedPoints, ticks]);

  const drawGrid = (ctx, tickCount) => {
    const canvasHeight = selectedPoints.length * ROW_HEIGHT + PADDING_TOP + 20;
    const canvasWidth = PADDING_LEFT + tickCount * TICK_WIDTH + 50;

    // Фон
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Сітка по тіках
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    for (let i = 0; i <= tickCount; i++) {
      const x = PADDING_LEFT + i * TICK_WIDTH;
      ctx.beginPath();
      ctx.moveTo(x, PADDING_TOP);
      ctx.lineTo(x, canvasHeight - 20);
      ctx.stroke();

      // Підписи часу
      ctx.fillStyle = "#999";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i.toString(), x, canvasHeight - 5);
    }

    // Горизонтальні лінії між рядками
    selectedPoints.forEach((_, index) => {
      const y = PADDING_TOP + index * ROW_HEIGHT;
      ctx.strokeStyle = "#333";
      ctx.beginPath();
      ctx.moveTo(PADDING_LEFT, y);
      ctx.lineTo(PADDING_LEFT + tickCount * TICK_WIDTH, y);
      ctx.stroke();
    });
  };

  const drawSignal = (ctx, point, ticks, rowIndex) => {
    const y = PADDING_TOP + rowIndex * ROW_HEIGHT;
    const color = getPointColor(point.type);

    // Підпис точки зліва
    ctx.fillStyle = color;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "right";
    ctx.fillText(point.label, PADDING_LEFT - 10, y + ROW_HEIGHT / 2 + 5);

    // Малюємо сигнал
    ticks.forEach((tick, tickIndex) => {
      const x = PADDING_LEFT + tickIndex * TICK_WIDTH;
      const value = tick.values[point.id];

      if (value === 1) {
        // HIGH - стовпчик вгору
        ctx.fillStyle = color;
        ctx.fillRect(x, y + 5, TICK_WIDTH, ROW_HEIGHT - 10);
      } else {
        // LOW - лінія внизу
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + ROW_HEIGHT - 5);
        ctx.lineTo(x + TICK_WIDTH, y + ROW_HEIGHT - 5);
        ctx.stroke();
      }

      // Вертикальна лінія між тіками (перехід)
      if (tickIndex > 0) {
        const prevValue = ticks[tickIndex - 1].values[point.id];
        if (prevValue !== value) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (prevValue === 1 && value === 0) {
            // 1 → 0 (вниз)
            ctx.moveTo(x, y + 5);
            ctx.lineTo(x, y + ROW_HEIGHT - 5);
          } else {
            // 0 → 1 (вгору)
            ctx.moveTo(x, y + ROW_HEIGHT - 5);
            ctx.lineTo(x, y + 5);
          }
          ctx.stroke();
        }
      }
    });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Визначаємо на який рядок (точку) клікнули
    const rowIndex = Math.floor((y - PADDING_TOP) / ROW_HEIGHT);

    if (rowIndex >= 0 && rowIndex < selectedPoints.length) {
      const pointId = selectedPoints[rowIndex];
      const point = points.find((p) => p.id === pointId);

      // Дозволяємо клік тільки на INPUT точки
      if (point && point.type === "input") {
        onPointClick(pointId);
      }
    }
  };

  const canvasWidth =
    PADDING_LEFT + Math.max(ticks.length, 10) * TICK_WIDTH + 50;
  const canvasHeight = selectedPoints.length * ROW_HEIGHT + PADDING_TOP + 20;

  return (
    <div className={styles.diagramCanvas}>
      {selectedPoints.length === 0 ? (
        <p className={styles.noData}>Оберіть точки зліва для відображення</p>
      ) : (
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
          className={styles.canvas}
        />
      )}
    </div>
  );
}

export default DiagramCanvas;
