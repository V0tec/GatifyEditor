import React, { useState } from "react";
import TruthTableConfig from "./TruthTableConfig";
import TruthTableView from "./TruthTableView";
import {
  generateTruthTable,
  exportToCSV,
  exportToJSON,
} from "./truthTableGenerator";
import styles from "./TruthTableModal.module.scss";

function TruthTableModal({
  isOpen,
  onClose,
  points,
  wires,
  junctions,
  components,
}) {
  const [step, setStep] = useState("config"); // 'config' або 'view'
  const [truthTable, setTruthTable] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = (selectedInputPoints, selectedOutputPoints) => {
    try {
      const table = generateTruthTable(
        selectedInputPoints,
        selectedOutputPoints,
        wires,
        junctions,
        components,
      );

      setTruthTable(table);
      setStep("view");
    } catch (error) {
      alert("Помилка при генерації таблиці істинності: " + error.message);
    }
  };

  const handleBack = () => {
    setStep("config");
  };

  const handleClose = () => {
    setStep("config");
    setTruthTable(null);
    onClose();
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(truthTable);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `truth-table-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = exportToJSON(truthTable);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `truth-table-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>
          ✕
        </button>

        {step === "config" && (
          <TruthTableConfig
            points={points}
            onGenerate={handleGenerate}
            onCancel={handleClose}
          />
        )}

        {step === "view" && (
          <>
            <div className={styles.header}>
              <button onClick={handleBack} className={styles.backBtn}>
                ← Назад
              </button>
              <h3>Таблиця істинності</h3>
            </div>
            <TruthTableView
              truthTable={truthTable}
              onExportCSV={handleExportCSV}
              onExportJSON={handleExportJSON}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default TruthTableModal;
