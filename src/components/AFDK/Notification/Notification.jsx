import { useEffect } from "react";
import styles from "./Notification.module.scss";

function Notification({ message, type = "error", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Автоматично закривається через 5 секунд

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.icon}>
        {type === "error" && "⚠️"}
        {type === "warning" && "⚡"}
        {type === "info" && "ℹ️"}
      </div>
      <div className={styles.message}>{message}</div>
      <button className={styles.close} onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default Notification;
