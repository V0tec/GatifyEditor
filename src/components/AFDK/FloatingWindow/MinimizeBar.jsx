import React from "react";
import styles from "./MinimizeBar.module.scss";

function MinimizeBar({ windows, onRestore }) {
  const minimizedWindows = windows.filter((w) => w.isMinimized);

  if (minimizedWindows.length === 0) return null;

  return (
    <div className={styles.minimizeBar}>
      {minimizedWindows.map((window) => (
        <button
          key={window.id}
          className={styles.minimizedWindow}
          onClick={() => onRestore(window.id)}
          title="Розгорнути вікно"
        >
          {window.title}
        </button>
      ))}
    </div>
  );
}

export default MinimizeBar;
