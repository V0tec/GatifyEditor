import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import styles from "./FloatingWindow.module.scss";

function FloatingWindow({
  id,
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  isMinimized,
  isMaximized,
  zIndex,
  defaultPosition,
  defaultSize,
}) {
  const [position, setPosition] = useState(
    defaultPosition || { x: 100, y: 100 },
  );
  const [size, setSize] = useState(defaultSize || { width: 1000, height: 600 });
  const [beforeMaximize, setBeforeMaximize] = useState(null);

  // Якщо вікно згорнуте - не рендеримо Rnd
  if (isMinimized) return null;

  const handleMaximize = () => {
    if (isMaximized) {
      // Відновлюємо попередній розмір
      if (beforeMaximize) {
        setPosition(beforeMaximize.position);
        setSize(beforeMaximize.size);
      }
      onMaximize(false);
    } else {
      // Зберігаємо поточний розмір
      setBeforeMaximize({ position, size });
      // Розгортаємо на весь екран
      setPosition({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth,
        height: window.innerHeight, // мінус Header
      });
      onMaximize(true);
    }
  };

  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => {
        if (!isMaximized) {
          setPosition({ x: d.x, y: d.y });
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
          setPosition(position);
        }
      }}
      minWidth={400}
      minHeight={300}
      bounds="parent"
      dragHandleClassName={styles.titleBar}
      style={{ zIndex }}
      onMouseDown={onFocus}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
    >
      <div className={styles.window}>
        {/* Title Bar */}
        <div className={styles.titleBar}>
          <span className={styles.title}>{title}</span>
          <div className={styles.controls}>
            <button
              className={styles.controlBtn}
              onClick={onMinimize}
              title="Згорнути"
            >
              —
            </button>
            <button
              className={styles.controlBtn}
              onClick={handleMaximize}
              title={isMaximized ? "Відновити" : "Розгорнути"}
            >
              {isMaximized ? "❐" : "□"}
            </button>
            <button
              className={`${styles.controlBtn} ${styles.closeBtn}`}
              onClick={onClose}
              title="Закрити"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>{children}</div>
      </div>
    </Rnd>
  );
}

export default FloatingWindow;
