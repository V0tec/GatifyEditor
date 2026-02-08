import { propagateSignalFromPoints } from "../Workspace/utils/signalPropagation";

/**
 * Генерує всі можливі комбінації для N входів
 * @param {number} n - кількість входів
 * @returns {Array<Array<number>>} - масив комбінацій [0,0], [0,1], [1,0], [1,1]
 */
export const generateCombinations = (n) => {
  const combinations = [];
  const total = Math.pow(2, n); // 2^n комбінацій

  for (let i = 0; i < total; i++) {
    // Перетворюємо число в бінарний рядок і доповнюємо нулями зліва
    const binary = i.toString(2).padStart(n, "0");
    // Перетворюємо рядок в масив чисел [0, 1, 1, 0]
    const combination = binary.split("").map(Number);
    combinations.push(combination);
  }

  return combinations;
};

/**
 * Генерує таблицю істинності для заданих INPUT та OUTPUT точок
 * @param {Array} inputPoints - масив INPUT точок
 * @param {Array} outputPoints - масив OUTPUT точок
 * @param {Array} wires - масив проводів
 * @param {Array} junctions - масив junction'ів
 * @param {Array} components - масив компонентів
 * @returns {Object} - {headers, rows}
 */
export const generateTruthTable = (
  inputPoints,
  outputPoints,
  wires,
  junctions,
  components,
) => {

  const n = inputPoints.length;
  const combinations = generateCombinations(n);
  const rows = [];

  // Створюємо копії для симуляції (щоб не змінювати оригінальні дані)
  const allPoints = [...inputPoints, ...outputPoints];

  combinations.forEach((combination, index) => {
    

    // Створюємо копію точок з новими значеннями
    const pointsCopy = allPoints.map((point) => {
      const inputIndex = inputPoints.findIndex((p) => p.id === point.id);

      if (inputIndex !== -1) {
        // INPUT точка - встановлюємо значення з комбінації
        return { ...point, value: combination[inputIndex] };
      } else {
        // OUTPUT точка - залишаємо 0 (буде оновлено після симуляції)
        return { ...point, value: 0 };
      }
    });

    // Запускаємо симуляцію з новими значеннями
    const { components: updatedComponents } = propagateSignalFromPoints(
      pointsCopy,
      wires,
      junctions,
      components,
    );

    // Збираємо результати з OUTPUT точок
    const outputs = outputPoints.map((outputPoint) => {
      // Шукаємо відповідний компонент і його вихід
      const TOUCH_THRESHOLD = 5;

      // Перевіряємо міні-проводи компонентів
      for (const comp of updatedComponents) {
        for (const output of comp.outputs) {
          const outputWorldX = comp.x + output.wireEndX + comp.width / 2;
          const outputWorldY = comp.y + output.wireEndY + comp.height / 2;

          const touches =
            Math.abs(outputPoint.x - outputWorldX) < TOUCH_THRESHOLD &&
            Math.abs(outputPoint.y - outputWorldY) < TOUCH_THRESHOLD;

          if (touches && output.connected) {
            
            return output.value;
          }
        }
      }

      // Якщо не знайшли - повертаємо 0
      return 0;
    });

    // Додаємо рядок в таблицю
    rows.push({
      inputs: combination,
      outputs: outputs,
    });
  });


  return {
    headers: {
      inputs: inputPoints.map((p) => p.label),
      outputs: outputPoints.map((p) => p.label),
    },
    rows: rows,
  };
};

/**
 * Експортує таблицю істинності в CSV формат
 */
export const exportToCSV = (truthTable) => {
  const { headers, rows } = truthTable;

  // Заголовки
  const headerRow = [...headers.inputs, ...headers.outputs].join(",");

  // Рядки даних
  const dataRows = rows
    .map((row) => {
      return [...row.inputs, ...row.outputs].join(",");
    })
    .join("\n");

  return `${headerRow}\n${dataRows}`;
};

/**
 * Експортує таблицю істинності в JSON формат
 */
export const exportToJSON = (truthTable) => {
  return JSON.stringify(truthTable, null, 2);
};
