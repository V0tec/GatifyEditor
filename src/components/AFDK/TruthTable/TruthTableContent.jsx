import React, { useState, useEffect } from "react";
import TruthTableConfig from "./TruthTableConfig";
import TruthTableView from "./TruthTableView";
import {
  generateTruthTable,
  exportToCSV,
  exportToJSON,
} from "./truthTableGenerator";
import styles from "./TruthTableContent.module.scss";

function TruthTableContent({ points, wires, junctions, components, onClose }) {
  const [step, setStep] = useState("config"); // 'config' або 'view'
  const [truthTable, setTruthTable] = useState(null);
  const [, forceUpdate] = useState({});

  console.log("🔵 TruthTableContent RENDER:", {
    pointsCount: points.length,
    wiresCount: wires.length,
    componentsCount: components.length,
    step,
  });

  // ⭐ ФОРСУЄМО РЕРЕНДЕР при зміні points, wires, components
  useEffect(() => {
    console.log("🟢 TruthTableContent useEffect TRIGGERED!", {
      pointsCount: points.length,
      wiresCount: wires.length,
      componentsCount: components.length,
    });
    forceUpdate({});
  }, [points, wires, junctions, components]);

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
    <div className={styles.content}>
      {step === "config" && (
        <TruthTableConfig
          points={points}
          onGenerate={handleGenerate}
          onCancel={onClose}
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
  );
}

export default TruthTableContent;
