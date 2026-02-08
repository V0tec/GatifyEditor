import styles from "./Junction.module.scss";

function Junction({ junction, onClick }) {
  return (
    <div
      className={styles.junction}
      style={{
        left: junction.x - 4,
        top: junction.y - 4,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(junction.id);
      }}
      title="Клік для видалення з'єднання"
    />
  );
}

export default Junction;
