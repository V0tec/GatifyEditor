import React, { useState } from "react";
import "./MultiLanguageFlowchart.css";

const MultiLanguageFlowchart = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [blocks, setBlocks] = useState([]);

  const languages = [
    { value: "javascript", label: "JavaScript / React" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "assembly", label: "Assembly (x86)" },
  ];

  const extractCondition = (line) => {
    const condMatch = line.match(/if\s*\(([^)]+)\)/);
    return condMatch ? condMatch[1].trim() : "умова";
  };

  const extractLoop = (line) => {
    if (line.includes("for")) {
      const match = line.match(/for\s*\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(";");
        const init = parts[0]?.trim() || "";
        const cond = parts[1]?.trim() || "";
        return `Поки ${cond}`;
      }
    } else if (line.includes("while")) {
      const match = line.match(/while\s*\(([^)]+)\)/);
      return match ? `Поки ${match[1].trim()}` : "Поки умова виконується";
    }
    return "Повторити дії";
  };

  const parseJavaScript = (lines) => {
    const blocks = [];
    let hasVariables = false;

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("//") || line.startsWith("/*")) continue;
      if (line === "{" || line === "}") continue;

      if (line.includes("import") || line.includes("export")) {
        continue;
      } else if (
        line.includes("function") ||
        (line.includes("=>") && line.includes("("))
      ) {
        const funcName =
          line.match(/(?:function\s+)?(\w+)\s*\(/)?.[1] || "функція";
        blocks.push({
          type: "function",
          label: `Початок функції: ${funcName}`,
          color: "#8b5cf6",
          border: "#7c3aed",
        });
      } else if (
        (line.includes("const") ||
          line.includes("let") ||
          line.includes("var")) &&
        !line.includes("(") &&
        line.includes("=")
      ) {
        if (!hasVariables) {
          blocks.push({
            type: "input",
            label: `Ініціалізація змінних`,
            color: "#10b981",
            border: "#059669",
          });
          hasVariables = true;
        }
      } else if (line.includes("if") && !line.includes("else")) {
        const condition = extractCondition(line);
        blocks.push({
          type: "condition",
          label: `${condition}?`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("else if")) {
        const condition = extractCondition(line);
        blocks.push({
          type: "condition",
          label: `${condition}?`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("else") && line.includes("{")) {
        blocks.push({
          type: "condition",
          label: `Інакше`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("for") || line.includes("while")) {
        const loopDesc = extractLoop(line);
        blocks.push({
          type: "loop",
          label: loopDesc,
          color: "#ec4899",
          border: "#db2777",
        });
      } else if (line.includes("console.log") || line.includes("alert")) {
        blocks.push({
          type: "output",
          label: `Вивести результат`,
          color: "#10b981",
          border: "#059669",
        });
      } else if (line.includes("return")) {
        const returnVal = line.match(/return\s+(.+?)[;]?$/)?.[1];
        if (returnVal && returnVal !== ";") {
          blocks.push({
            type: "return",
            label: `Повернути: ${returnVal}`,
            color: "#ef4444",
            border: "#dc2626",
          });
        }
      } else if (
        (line.includes("=") && !line.includes("==") && !line.includes("===")) ||
        line.includes("++") ||
        line.includes("--") ||
        line.includes("+=") ||
        line.includes("-=")
      ) {
        blocks.push({
          type: "process",
          label: `Обчислити вираз`,
          color: "#3b82f6",
          border: "#2563eb",
        });
      }
    }
    return blocks;
  };

  const parseC = (lines) => {
    const blocks = [];
    let hasVariables = false;

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("//") || line.startsWith("/*")) continue;
      if (line === "{" || line === "}") continue;

      if (line.includes("#include") || line.includes("#define")) {
        continue;
      } else if (line.match(/^(int|void|float|double|char)\s+\w+\s*\(/)) {
        const funcName = line.match(/\s+(\w+)\s*\(/)?.[1] || "функція";
        blocks.push({
          type: "function",
          label: `Початок функції: ${funcName}`,
          color: "#8b5cf6",
          border: "#7c3aed",
        });
      } else if (
        line.match(/^(int|float|double|char)\s+\w+/) &&
        !line.includes("(")
      ) {
        if (!hasVariables) {
          blocks.push({
            type: "input",
            label: `Оголосити змінні`,
            color: "#10b981",
            border: "#059669",
          });
          hasVariables = true;
        }
      } else if (line.includes("if") && !line.includes("else")) {
        const condition = extractCondition(line);
        blocks.push({
          type: "condition",
          label: `${condition}?`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("else if")) {
        const condition = extractCondition(line);
        blocks.push({
          type: "condition",
          label: `${condition}?`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("else")) {
        blocks.push({
          type: "condition",
          label: `Інакше`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("for") || line.includes("while")) {
        const loopDesc = extractLoop(line);
        blocks.push({
          type: "loop",
          label: loopDesc,
          color: "#ec4899",
          border: "#db2777",
        });
      } else if (line.includes("printf")) {
        blocks.push({
          type: "output",
          label: `Вивести дані`,
          color: "#10b981",
          border: "#059669",
        });
      } else if (line.includes("scanf")) {
        blocks.push({
          type: "input",
          label: `Ввести дані`,
          color: "#10b981",
          border: "#059669",
        });
      } else if (line.includes("return")) {
        blocks.push({
          type: "return",
          label: `Повернути результат`,
          color: "#ef4444",
          border: "#dc2626",
        });
      } else if (
        (line.includes("=") && !line.includes("==")) ||
        line.includes("++") ||
        line.includes("--") ||
        line.includes("+=") ||
        line.includes("-=")
      ) {
        blocks.push({
          type: "process",
          label: `Обчислити вираз`,
          color: "#3b82f6",
          border: "#2563eb",
        });
      }
    }
    return blocks;
  };

  const parseCpp = (lines) => {
    const blocks = [];
    let hasVariables = false;

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("//") || line.startsWith("/*")) continue;
      if (line === "{" || line === "}" || line === "};") continue;

      if (line.includes("#include") || line.includes("using namespace")) {
        continue;
      } else if (line.includes("class") || line.includes("struct")) {
        const className = line.match(/(?:class|struct)\s+(\w+)/)?.[1] || "клас";
        blocks.push({
          type: "class",
          label: `Клас: ${className}`,
          color: "#a855f7",
          border: "#9333ea",
        });
      } else if (line.match(/^(int|void|float|double|string)\s+\w+\s*\(/)) {
        const funcName = line.match(/\s+(\w+)\s*\(/)?.[1] || "метод";
        blocks.push({
          type: "function",
          label: `Початок методу: ${funcName}`,
          color: "#8b5cf6",
          border: "#7c3aed",
        });
      } else if (
        line.match(/^(int|float|double|string)\s+\w+/) &&
        !line.includes("(")
      ) {
        if (!hasVariables) {
          blocks.push({
            type: "input",
            label: `Оголосити змінні`,
            color: "#10b981",
            border: "#059669",
          });
          hasVariables = true;
        }
      } else if (line.includes("if") && !line.includes("else")) {
        const condition = extractCondition(line);
        blocks.push({
          type: "condition",
          label: `${condition}?`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("else if")) {
        const condition = extractCondition(line);
        blocks.push({
          type: "condition",
          label: `${condition}?`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("else")) {
        blocks.push({
          type: "condition",
          label: `Інакше`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("for") || line.includes("while")) {
        const loopDesc = extractLoop(line);
        blocks.push({
          type: "loop",
          label: loopDesc,
          color: "#ec4899",
          border: "#db2777",
        });
      } else if (line.includes("cout")) {
        blocks.push({
          type: "output",
          label: `Вивести дані`,
          color: "#10b981",
          border: "#059669",
        });
      } else if (line.includes("cin")) {
        blocks.push({
          type: "input",
          label: `Ввести дані`,
          color: "#10b981",
          border: "#059669",
        });
      } else if (line.includes("return")) {
        blocks.push({
          type: "return",
          label: `Повернути результат`,
          color: "#ef4444",
          border: "#dc2626",
        });
      } else if (
        (line.includes("=") && !line.includes("==")) ||
        line.includes("++") ||
        line.includes("--") ||
        line.includes("+=") ||
        line.includes("-=")
      ) {
        blocks.push({
          type: "process",
          label: `Обчислити вираз`,
          color: "#3b82f6",
          border: "#2563eb",
        });
      }
    }
    return blocks;
  };

  const parseJava = (lines) => {
    const blocks = [];
    let hasVariables = false;

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("//") || line.startsWith("/*")) continue;
      if (line === "{" || line === "}") continue;

      if (line.includes("import") || line.includes("package")) {
        continue;
      } else if (line.includes("class")) {
        const className = line.match(/class\s+(\w+)/)?.[1] || "клас";
        blocks.push({
          type: "class",
          label: `Клас: ${className}`,
          color: "#a855f7",
          border: "#9333ea",
        });
      } else if (
        line.match(
          /(public|private|protected)?\s*(static)?\s*(void|int|String|double)\s+\w+\s*\(/,
        )
      ) {
        const funcName = line.match(/\s+(\w+)\s*\(/)?.[1] || "метод";
        blocks.push({
          type: "method",
          label: `Початок методу: ${funcName}`,
          color: "#8b5cf6",
          border: "#7c3aed",
        });
      } else if (
        line.match(/^(int|String|double|float)\s+\w+/) &&
        !line.includes("(")
      ) {
        if (!hasVariables) {
          blocks.push({
            type: "input",
            label: `Оголосити змінні`,
            color: "#10b981",
            border: "#059669",
          });
          hasVariables = true;
        }
      } else if (line.includes("if") && !line.includes("else")) {
        const condition = extractCondition(line);
        blocks.push({
          type: "condition",
          label: `${condition}?`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("else if")) {
        const condition = extractCondition(line);
        blocks.push({
          type: "condition",
          label: `${condition}?`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("else")) {
        blocks.push({
          type: "condition",
          label: `Інакше`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("for") || line.includes("while")) {
        const loopDesc = extractLoop(line);
        blocks.push({
          type: "loop",
          label: loopDesc,
          color: "#ec4899",
          border: "#db2777",
        });
      } else if (line.includes("System.out")) {
        blocks.push({
          type: "output",
          label: `Вивести дані`,
          color: "#10b981",
          border: "#059669",
        });
      } else if (line.includes("Scanner")) {
        blocks.push({
          type: "input",
          label: `Ввести дані`,
          color: "#10b981",
          border: "#059669",
        });
      } else if (line.includes("return") && line.length > 7) {
        blocks.push({
          type: "return",
          label: `Повернути результат`,
          color: "#ef4444",
          border: "#dc2626",
        });
      } else if (
        (line.includes("=") && !line.includes("==")) ||
        line.includes("++") ||
        line.includes("--") ||
        line.includes("+=") ||
        line.includes("-=") ||
        line.includes("*=")
      ) {
        blocks.push({
          type: "process",
          label: `Обчислити вираз`,
          color: "#3b82f6",
          border: "#2563eb",
        });
      }
    }
    return blocks;
  };

  const parseAssembly = (lines) => {
    const blocks = [];

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith(";")) continue;

      if (line.includes("section") || line.includes("segment")) {
        continue;
      } else if (line.match(/^\w+:$/)) {
        const label = line.replace(":", "");
        blocks.push({
          type: "label",
          label: `Мітка: ${label}`,
          color: "#a855f7",
          border: "#9333ea",
        });
      } else if (line.includes("call")) {
        blocks.push({
          type: "jump",
          label: `Викликати підпрограму`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.match(/j[a-z]+/)) {
        blocks.push({
          type: "jump",
          label: `Умовний перехід`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("cmp") || line.includes("test")) {
        blocks.push({
          type: "condition",
          label: `Порівняти значення`,
          color: "#f59e0b",
          border: "#d97706",
        });
      } else if (line.includes("loop")) {
        blocks.push({
          type: "loop",
          label: `Цикл`,
          color: "#ec4899",
          border: "#db2777",
        });
      } else if (line.includes("ret")) {
        blocks.push({
          type: "return",
          label: `Повернутися`,
          color: "#ef4444",
          border: "#dc2626",
        });
      } else if (line.includes("mov")) {
        blocks.push({
          type: "instruction",
          label: `Присвоїти значення`,
          color: "#3b82f6",
          border: "#2563eb",
        });
      } else if (line.match(/add|sub|mul|div|inc|dec/)) {
        blocks.push({
          type: "instruction",
          label: `Арифметична операція`,
          color: "#3b82f6",
          border: "#2563eb",
        });
      } else if (line.includes("int") || line.includes("syscall")) {
        blocks.push({
          type: "syscall",
          label: `Системний виклик`,
          color: "#10b981",
          border: "#059669",
        });
      }
    }
    return blocks;
  };

  const generateFlowchart = () => {
    if (!code.trim()) {
      alert("Будь ласка, введіть код!");
      return;
    }

    const lines = code.trim().split("\n");
    let parsedBlocks = [];

    switch (language) {
      case "javascript":
        parsedBlocks = parseJavaScript(lines);
        break;
      case "c":
        parsedBlocks = parseC(lines);
        break;
      case "cpp":
        parsedBlocks = parseCpp(lines);
        break;
      case "java":
        parsedBlocks = parseJava(lines);
        break;
      case "assembly":
        parsedBlocks = parseAssembly(lines);
        break;
      default:
        parsedBlocks = parseJavaScript(lines);
    }

    setBlocks(parsedBlocks);
  };

  const exampleCodes = {
    javascript: `function calculateSum() {
  const a = 10;
  const b = 20;
  let sum = 0;
  
  if (a > 0 && b > 0) {
    // console.log(
  }
  
  for (let i = 0; i < 5; i++) {
    sum += i;
  }
  
  return sum;
}`,
    c: `#include <stdio.h>

int main() {
    int n, sum = 0;
    
    printf("Введіть число: ");
    scanf("%d", &n);
    
    if (n > 0) {
        printf("Число додатнє");
    } else {
        printf("Число від'ємне");
    }
    
    for (int i = 1; i <= n; i++) {
        sum = sum + i;
    }
    
    printf("Сума: %d", sum);
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

class Calculator {
public:
    int calculate(int x, int y) {
        int result = 0;
        
        if (x > y) {
            result = x - y;
        } else {
            result = x + y;
        }
        
        cout << "Результат: " << result;
        return result;
    }
};`,
    java: `public class Main {
    public static void main(String[] args) {
        int num = 10;
        int factorial = 1;
        
        if (num > 0) {
            for (int i = 1; i <= num; i++) {
                factorial = factorial * i;
            }
            System.out.println("Факторіал: " + factorial);
        } else {
            System.out.println("Число має бути додатнім");
        }
    }
}`,
    assembly: `section .text
    global _start

_start:
    mov eax, 5
    mov ebx, 10
    
    cmp eax, ebx
    jl smaller
    
    add eax, ebx
    jmp end
    
smaller:
    sub ebx, eax
    
end:
    mov eax, 1
    int 0x80
    ret`,
  };

  const loadExample = () => {
    setCode(exampleCodes[language]);
  };

  return (
    <div className="flowchart-container">
      {/* Заголовок */}
      <div className="header">
        <h1 className="title">🔄 Генератор блок-схем</h1>
        <p className="subtitle">
          Підтримка JavaScript, C, C++, Java та Assembly
        </p>
      </div>

      {/* Панель керування */}
      <div className="control-panel">
        <div className="language-selector">
          <label>Мова програмування:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={loadExample} className="btn btn-secondary">
          📝 Завантажити приклад
        </button>

        <button onClick={generateFlowchart} className="btn btn-primary">
          🚀 Згенерувати блок-схему
        </button>
      </div>

      {/* Основний контент */}
      <div className="main-content">
        {/* Редактор коду */}
        <div className="code-editor">
          <div className="editor-header">
            <h3>💻 Ваш код</h3>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Введіть ваш ${
              languages.find((l) => l.value === language)?.label
            } код тут...`}
            className="code-textarea"
          />
        </div>

        {/* Візуалізація блок-схеми */}
        <div className="flowchart-display">
          {blocks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div>Введіть код та натисніть "Згенерувати блок-схему"</div>
            </div>
          ) : (
            <div className="flowchart">
              {/* Початок */}
              <div className="node node-start">▶ Початок</div>

              <div className="arrow"></div>

              {/* Блоки коду */}
              {blocks.map((block, index) => (
                <React.Fragment key={index}>
                  <div
                    className="node node-block"
                    style={{
                      backgroundColor: block.color,
                      borderColor: block.border,
                    }}
                  >
                    {block.label}
                  </div>
                  <div className="arrow"></div>
                </React.Fragment>
              ))}

              {/* Кінець */}
              <div className="node node-end">⬛ Кінець</div>
            </div>
          )}
        </div>
      </div>

      {/* Легенда */}
      <div className="legend">
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#4ade80" }}
          ></div>
          <span>Початок/Кінець</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#8b5cf6" }}
          ></div>
          <span>Функція/Метод</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#f59e0b" }}
          ></div>
          <span>Умова</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#ec4899" }}
          ></div>
          <span>Цикл</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#3b82f6" }}
          ></div>
          <span>Процес</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#06b6d4" }}
          ></div>
          <span>Імпорт/Препроцесор</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#10b981" }}
          ></div>
          <span>Введення/Виведення</span>
        </div>
      </div>
    </div>
  );
};

export default MultiLanguageFlowchart;
