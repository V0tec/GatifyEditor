import { useEffect, useRef } from "react";
import styles from "./ContextMenu.module.scss";

const ContextMenu = ({ x, y, options, onClose }) => {
  const menuRef = useRef(null);

  const handleMenuClick = (e) => {
    e.stopPropagation(); // Запобігаємо закриттю меню при кліку по ньому
  };

  // Корегуємо позицію меню, щоб воно не виходило за межі екрана
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;

      // Спочатку встановлюємо базову позицію
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;

      // Потім отримуємо реальні розміри і корегуємо
      const rect = menu.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let finalX = x;
      let finalY = y;

      // Якщо меню виходить за праву межу екрана, зміщуємо його вліво
      if (rect.right > windowWidth) {
        finalX = windowWidth - rect.width - 10;
      }

      // Якщо меню виходить за нижню межу екрана, зміщуємо його вгору
      if (rect.bottom > windowHeight) {
        finalY = windowHeight - rect.height - 10;
      }

      // Якщо меню виходить за ліву межу екрана
      if (finalX < 10) {
        finalX = 10;
      }

      // Якщо меню виходить за верхню межу екрана
      if (finalY < 10) {
        finalY = 10;
      }

      menu.style.left = `${finalX}px`;
      menu.style.top = `${finalY}px`;
    }
  }, [x, y]);

  return (
    <ul
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        position: "fixed",
        zIndex: 9999,
        margin: 0,
        padding: "4px 0",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        listStyle: "none",
        minWidth: "150px",
      }}
      // onMouseLeave={onClose}
      onMouseDown={handleMenuClick}
      onClick={handleMenuClick}
    >
      {options.map((opt, idx) => (
        <li
          key={idx}
          onClick={(e) => {
            if (opt.disabled) return;
            e.stopPropagation();
            opt.onClick();
            onClose();
          }}
          style={{
            padding: "8px 12px",
            opacity: opt.disabled ? 0.5 : 1,
            cursor: opt.disabled ? "default" : "pointer",
            color: opt.disabled ? "#999" : "inherit",
            borderBottom: idx < options.length - 1 ? "1px solid #eee" : "none",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = opt.disabled ? "white" : "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
          }}
        >
          {opt.label}
        </li>
      ))}
    </ul>
  );
};

export default ContextMenu;
