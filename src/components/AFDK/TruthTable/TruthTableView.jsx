import React from "react";
import styles from "./TruthTableView.module.scss";

function TruthTableView({ truthTable, onExportCSV, onExportJSON }) {
  if (!truthTable) return null;

  const { headers, rows } = truthTable;

  return (
    <div className={styles.truthTableView}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.inputs.map((label, idx) => (
                <th key={`input-${idx}`} className={styles.inputHeader}>
                  {label}
                </th>
              ))}
              {headers.outputs.map((label, idx) => (
                <th key={`output-${idx}`} className={styles.outputHeader}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.inputs.map((value, idx) => (
                  <td
                    key={`input-${rowIdx}-${idx}`}
                    className={styles.inputCell}
                  >
                    <span
                      className={
                        value === 1 ? styles.valueHigh : styles.valueLow
                      }
                    >
                      {value}
                    </span>
                  </td>
                ))}
                {row.outputs.map((value, idx) => (
                  <td
                    key={`output-${rowIdx}-${idx}`}
                    className={styles.outputCell}
                  >
                    <span
                      className={
                        value === 1 ? styles.valueHigh : styles.valueLow
                      }
                    >
                      {value}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.exportButtons}>
        <button onClick={onExportCSV} className={styles.exportBtn}>
          📄 Зберегти як CSV
        </button>
        <button onClick={onExportJSON} className={styles.exportBtn}>
          📋 Зберегти як JSON
        </button>
      </div>

      <div className={styles.stats}>
        <p>
          Всього комбінацій: <strong>{rows.length}</strong>
        </p>
        <p>
          Входів: <strong>{headers.inputs.length}</strong> | Виходів:{" "}
          <strong>{headers.outputs.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default TruthTableView;
