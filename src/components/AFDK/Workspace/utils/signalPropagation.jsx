import { GATE_CONFIGS } from "../../Elements/gateConfigs.jsx";

/**
 * Перевіряє чи точка торкається проводу
 */
const isPointTouchingWire = (point, wire) => {
  const TOUCH_THRESHOLD = 5;

  const wireStart = wire.wireStart || { x: wire.x, y: wire.y };
  const wireEnd = wire.wireEnd || { x: wire.x, y: wire.y };

  const touchesStart =
    Math.abs(point.x - wireStart.x) < TOUCH_THRESHOLD &&
    Math.abs(point.y - wireStart.y) < TOUCH_THRESHOLD;

  const touchesEnd =
    Math.abs(point.x - wireEnd.x) < TOUCH_THRESHOLD &&
    Math.abs(point.y - wireEnd.y) < TOUCH_THRESHOLD;

  return touchesStart || touchesEnd;
};

/**
 * Знаходить всі проводи що торкаються точки
 */
const findWiresTouchedByPoint = (point, wires) => {
  return wires.filter((wire) => isPointTouchingWire(point, wire));
};

/**
 * Знаходить всі проводи з однієї групи (wireGroupId)
 */
const getAllWiresInGroup = (wireGroupId, wires) => {
  return wires.filter((wire) => wire.wireGroupId === wireGroupId);
};

/**
 * Отримує координати кінців групи проводів
 */
const getGroupEndpoints = (wireGroupId, wires) => {
  const groupWires = getAllWiresInGroup(wireGroupId, wires);
  if (groupWires.length === 0) return { start: null, end: null };

  const firstWire = groupWires[0];
  return {
    start: firstWire.wireStart,
    end: firstWire.wireEnd,
  };
};

/**
 * Знаходить групи проводів що є продовженням (торкаються кінцями)
 */
const findContinuationGroups = (activeGroupId, allWires, processedGroups) => {
  const TOUCH_THRESHOLD = 5;
  const { start, end } = getGroupEndpoints(activeGroupId, allWires);

  if (!start || !end) return [];

  const continuations = [];

  // Групуємо проводи по wireGroupId
  const groupsMap = new Map();
  allWires.forEach((wire) => {
    if (!groupsMap.has(wire.wireGroupId)) {
      groupsMap.set(wire.wireGroupId, {
        wireGroupId: wire.wireGroupId,
        wireStart: wire.wireStart,
        wireEnd: wire.wireEnd,
      });
    }
  });

  // Перевіряємо кожну іншу групу
  groupsMap.forEach((otherGroup, otherGroupId) => {
    if (otherGroupId === activeGroupId || processedGroups.has(otherGroupId)) {
      return;
    }

    const otherStart = otherGroup.wireStart;
    const otherEnd = otherGroup.wireEnd;

    const endTouchesStart =
      Math.abs(end.x - otherStart.x) < TOUCH_THRESHOLD &&
      Math.abs(end.y - otherStart.y) < TOUCH_THRESHOLD;

    const endTouchesEnd =
      Math.abs(end.x - otherEnd.x) < TOUCH_THRESHOLD &&
      Math.abs(end.y - otherEnd.y) < TOUCH_THRESHOLD;

    const startTouchesStart =
      Math.abs(start.x - otherStart.x) < TOUCH_THRESHOLD &&
      Math.abs(start.y - otherStart.y) < TOUCH_THRESHOLD;

    const startTouchesEnd =
      Math.abs(start.x - otherEnd.x) < TOUCH_THRESHOLD &&
      Math.abs(start.y - otherEnd.y) < TOUCH_THRESHOLD;

    if (
      endTouchesStart ||
      endTouchesEnd ||
      startTouchesStart ||
      startTouchesEnd
    ) {
      continuations.push(otherGroupId);
    }
  });

  return continuations;
};

/**
 * Знаходить всі junction на активних проводах
 */
const findJunctionsOnActiveWires = (activeWireGroupIds, junctions) => {
  const foundJunctions = junctions.filter(
    (junction) =>
      junction.wireGroups &&
      junction.wireGroups.some((groupId) =>
        activeWireGroupIds.includes(groupId),
      ),
  );

  if (foundJunctions.length > 0) {
  }

  return foundJunctions;
};

/**
 * Отримує всі групи проводів з junction (крім вже активних)
 */
const getNewGroupsFromJunction = (junction, alreadyActiveGroups) => {
  if (!junction.wireGroups) return [];

  const newGroups = junction.wireGroups.filter(
    (groupId) => !alreadyActiveGroups.includes(groupId),
  );

  if (newGroups.length > 0) {
  }

  return newGroups;
};

/**
 * Передає сигнал на входи компонентів від активних проводів
 */
/**
 * Передає сигнал на входи компонентів від активних проводів
 */
const propagateToComponentInputs = (
  activeGroupsMap,
  wires,
  components,
  points = [],
) => {
  const TOUCH_THRESHOLD = 5;

  const updatedComponents = components.map((comp) => {
    const updatedInputs = comp.inputs.map((input) => {
      const inputWorldX = comp.x + input.localX + comp.width / 2;
      const inputWorldY = comp.y + input.localY + comp.height / 2;

      let connected = false;
      let value = 0;

      // ⭐ НОВИЙ КОД: Спочатку перевіряємо прямий контакт з точками
      points.forEach((point) => {
        const touchesPoint =
          Math.abs(point.x - inputWorldX) < TOUCH_THRESHOLD &&
          Math.abs(point.y - inputWorldY) < TOUCH_THRESHOLD;

        if (touchesPoint) {
          connected = true;
          value = point.value;
        }
      });

      // Якщо вже підключено напряму - пропускаємо перевірку проводів
      if (connected) {
        return {
          ...input,
          value: value,
          connected: true,
        };
      }

      // Якщо не підключено напряму - перевіряємо через проводи
      activeGroupsMap.forEach((groupValue, groupId) => {
        const { start, end } = getGroupEndpoints(groupId, wires);

        if (start && end) {
          // ⭐ ПЕРЕВІРЯЄМО ОБА КІНЦІ ПРОВОДУ
          const distanceToStart = Math.sqrt(
            Math.pow(start.x - inputWorldX, 2) +
              Math.pow(start.y - inputWorldY, 2),
          );
          const distanceToEnd = Math.sqrt(
            Math.pow(end.x - inputWorldX, 2) + Math.pow(end.y - inputWorldY, 2),
          );

          const touchesStart = distanceToStart < TOUCH_THRESHOLD;
          const touchesEnd = distanceToEnd < TOUCH_THRESHOLD;

          if (touchesStart || touchesEnd) {
            connected = true;
            value = groupValue;
          } else {
          }
        } else {
        }
      });

      return {
        ...input,
        value: value,
        connected: connected,
      };
    });

    return {
      ...comp,
      inputs: updatedInputs,
    };
  });

  return updatedComponents;
};

/**
 * Обчислює логіку всіх компонентів
 */
const calculateComponentLogic = (components) => {
  return components.map((comp) => {
    const config = GATE_CONFIGS[comp.type];
    if (!config) return comp;

    // Для CLOCK просто повертаємо поточний стан
    if (comp.type === "CLOCK") {
      const clockValue = comp.state?.value || 0;

      const updatedOutputs = comp.outputs.map((output) => ({
        ...output,
        value: output.inverted ? (clockValue === 1 ? 0 : 1) : clockValue,
        connected: true, // Clock завжди активний
      }));

      return {
        ...comp,
        outputs: updatedOutputs,
      };
    }

    // Збираємо значення входів з урахуванням інверторів
    const inputValues = comp.inputs.map((input) => {
      const isInverted = input.inverted || false;
      return isInverted ? (input.value === 1 ? 0 : 1) : input.value;
    });

    // Обчислюємо вихід
    let result;
    let updatedState = comp.state;

    // ========== ТРИГЕРИ ==========
    if (
      comp.type === "D_TRIGGER" ||
      comp.type === "RS_TRIGGER" ||
      comp.type === "JK_TRIGGER" ||
      comp.type === "T_TRIGGER"
    ) {
      result = config.logic(inputValues, comp.state);
      updatedState = result;

      // Логування для тригерів
      if (comp.type === "D_TRIGGER") {
      } else if (comp.type === "RS_TRIGGER") {
      } else if (comp.type === "JK_TRIGGER") {
      } else if (comp.type === "T_TRIGGER") {
      }

      // Оновлюємо виходи тригерів
      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = index === 0 ? updatedState.Q : updatedState.Qbar;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: baseValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
        state: updatedState,
      };
    }

    // ========== МУЛЬТИПЛЕКСОРИ ==========
    if (comp.type === "MUX2") {
      const i0 = inputValues[0] ?? 0;
      const i1 = inputValues[1] ?? 0;
      const s = inputValues[2] ?? 0;

      result = s === 0 ? i0 : i1;

      const updatedOutputs = comp.outputs.map((output) => {
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (result === 1 ? 0 : 1) : result;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    if (comp.type === "MUX4") {
      const i0 = inputValues[0] ?? 0;
      const i1 = inputValues[1] ?? 0;
      const i2 = inputValues[2] ?? 0;
      const i3 = inputValues[3] ?? 0;
      const s0 = inputValues[4] ?? 0;
      const s1 = inputValues[5] ?? 0;

      const selector = (s1 << 1) | s0;
      if (selector === 0) result = i0;
      else if (selector === 1) result = i1;
      else if (selector === 2) result = i2;
      else if (selector === 3) result = i3;

      const updatedOutputs = comp.outputs.map((output) => {
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (result === 1 ? 0 : 1) : result;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    if (comp.type === "MUX8") {
      const i0 = inputValues[0] ?? 0;
      const i1 = inputValues[1] ?? 0;
      const i2 = inputValues[2] ?? 0;
      const i3 = inputValues[3] ?? 0;
      const i4 = inputValues[4] ?? 0;
      const i5 = inputValues[5] ?? 0;
      const i6 = inputValues[6] ?? 0;
      const i7 = inputValues[7] ?? 0;
      const s0 = inputValues[8] ?? 0;
      const s1 = inputValues[9] ?? 0;
      const s2 = inputValues[10] ?? 0;

      const selector = (s2 << 2) | (s1 << 1) | s0;
      const dataInputs = [i0, i1, i2, i3, i4, i5, i6, i7];
      result = dataInputs[selector] ?? 0;

      const updatedOutputs = comp.outputs.map((output) => {
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (result === 1 ? 0 : 1) : result;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    // ========== ДЕМУЛЬТИПЛЕКСОРИ ==========
    if (comp.type === "DEMUX2") {
      const i = inputValues[0] ?? 0;
      const s = inputValues[1] ?? 0;

      const y0 = s === 0 ? i : 0;
      const y1 = s === 1 ? i : 0;

      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = index === 0 ? y0 : y1;
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    if (comp.type === "DEMUX4") {
      const i = inputValues[0] ?? 0;
      const s0 = inputValues[1] ?? 0;
      const s1 = inputValues[2] ?? 0;

      const selector = (s1 << 1) | s0;

      const outputValues = [
        selector === 0 ? i : 0,
        selector === 1 ? i : 0,
        selector === 2 ? i : 0,
        selector === 3 ? i : 0,
      ];

      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = outputValues[index];
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    if (comp.type === "DEMUX8") {
      const i = inputValues[0] ?? 0;
      const s0 = inputValues[1] ?? 0;
      const s1 = inputValues[2] ?? 0;
      const s2 = inputValues[3] ?? 0;

      const selector = (s2 << 2) | (s1 << 1) | s0;

      const outputValues = [];
      for (let j = 0; j < 8; j++) {
        outputValues[j] = selector === j ? i : 0;
      }

      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = outputValues[index];
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    // ========== ДЕШИФРАТОРИ ==========
    if (
      comp.type === "DECODER2" ||
      comp.type === "DECODER3" ||
      comp.type === "DECODER4"
    ) {
      const outputValues = config.logic(inputValues);

      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = outputValues[index] ?? 0;
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    // ========== СУМАТОРИ ==========
    if (
      comp.type === "HALF_ADDER" ||
      comp.type === "FULL_ADDER" ||
      comp.type === "ADDER_4BIT" ||
      comp.type === "ADDER_8BIT"
    ) {
      const outputValues = config.logic(inputValues);

      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = outputValues[index] ?? 0;
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    // ========== РЕГІСТРИ ==========
    if (
      comp.type === "REGISTER_4BIT" ||
      comp.type === "REGISTER_8BIT" ||
      comp.type === "SHIFT_REGISTER_4BIT" ||
      comp.type === "SHIFT_REGISTER_8BIT"
    ) {
      result = config.logic(inputValues, comp.state);
      updatedState = result;

      // Оновлюємо виходи на основі стану
      const updatedOutputs = comp.outputs.map((output, index) => {
        const stateKey = `Q${index}`;
        const baseValue = updatedState[stateKey] ?? 0;
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
        state: updatedState,
      };
    }

    // ========== КОМПАРАТОРИ ==========
    if (
      comp.type === "COMPARATOR_1BIT" ||
      comp.type === "COMPARATOR_4BIT" ||
      comp.type === "COMPARATOR_8BIT"
    ) {
      const outputValues = config.logic(inputValues);

      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = outputValues[index] ?? 0;
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    // ========== ЛІЧИЛЬНИКИ ==========
    if (
      comp.type === "COUNTER_4BIT" ||
      comp.type === "COUNTER_8BIT" ||
      comp.type === "COUNTER_4BIT_UP"
    ) {
      result = config.logic(inputValues, comp.state);
      updatedState = result;

      // Оновлюємо виходи на основі стану
      const bitCount = comp.type === "COUNTER_8BIT" ? 8 : 4;
      const updatedOutputs = comp.outputs.map((output, index) => {
        let baseValue;
        if (index < bitCount) {
          // Q0-Q3 або Q0-Q7
          const stateKey = `Q${index}`;
          baseValue = updatedState[stateKey] ?? 0;
        } else {
          // Overflow
          baseValue = updatedState.overflow ?? 0;
        }

        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
        state: updatedState,
      };
    }

    // ========== RAM ==========
    if (
      comp.type === "RAM_16x4" ||
      comp.type === "RAM_16x8" ||
      comp.type === "RAM_256x8" ||
      comp.type === "RAM_256x8_CS"
    ) {
      const logicResult = config.logic(inputValues, comp.state);

      // ⭐ ЛОГУВАННЯ ДЛЯ ДІАГНОСТИКИ
      console.log(`  📊 RAM logic результат:`, logicResult);
      if (logicResult && logicResult.outputs) {
        console.log(`  📊 outputs array:`, logicResult.outputs);
        console.log(`  📊 outputs[0] type:`, typeof logicResult.outputs[0]);
        console.log(`  📊 outputs[0] value:`, logicResult.outputs[0]);
      }

      // ⭐ Перевіряємо новий формат {state, outputs}
      if (
        logicResult &&
        logicResult.state &&
        Array.isArray(logicResult.outputs)
      ) {
        console.log(`  ✅ Новий формат RAM виявлено`);

        // Новий формат RAM
        updatedState = logicResult.state;

        const updatedOutputs = comp.outputs.map((output, index) => {
          const baseValue = logicResult.outputs[index] ?? 0;

          console.log(
            `    📌 Вихід ${index}: baseValue = ${baseValue} (type: ${typeof baseValue})`,
          );

          const isInverted = output.inverted || false;
          const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
          const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

          return {
            ...output,
            value: finalValue,
            connected: hasConnectedInputs,
          };
        });

        console.log(`  📌 updatedOutputs:`, updatedOutputs);

        const outputsChanged = updatedOutputs.some(
          (output, i) => output.value !== comp.outputs[i].value,
        );

        if (outputsChanged) {
          console.log(`  ✅ Виходи змінились! Додаємо в чергу`);
          newQueue.push({
            type: "from_component",
            componentId: comp.id,
          });
        } else {
          console.log(`  ⏭️ Виходи не змінились`);
        }

        updatedComponents[compIndex] = {
          ...comp,
          outputs: updatedOutputs,
          state: updatedState,
        };
      } else {
        console.log(`  ⚠️ Старий формат RAM або невалідний результат`);

        // Старий формат (сумісність)
        updatedState = logicResult;

        const dataBits = comp.type === "RAM_16x4" ? 4 : 8;

        const updatedOutputs = comp.outputs.map((output, index) => {
          const stateKey = `Q${index}`;
          const baseValue = updatedState[stateKey] ?? 0;
          const isInverted = output.inverted || false;
          const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
          const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

          return {
            ...output,
            value: finalValue,
            connected: hasConnectedInputs,
          };
        });

        const outputsChanged = updatedOutputs.some(
          (output, i) => output.value !== comp.outputs[i].value,
        );

        if (outputsChanged) {
          console.log(`  ✅ Виходи змінились! Додаємо в чергу`);
          newQueue.push({
            type: "from_component",
            componentId: comp.id,
          });
        } else {
          console.log(`  ⏭️ Виходи не змінились`);
        }

        updatedComponents[compIndex] = {
          ...comp,
          outputs: updatedOutputs,
          state: updatedState,
        };
      }
    }

    // ========== ALU ==========
    if (comp.type === "ALU_4BIT" || comp.type === "ALU_8BIT") {
      const outputValues = config.logic(inputValues);

      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = outputValues[index] ?? 0;
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    // ========== ROM ==========
    else if (
      comp.type === "ROM_16x4" ||
      comp.type === "ROM_16x8" ||
      comp.type === "ROM_256x8" ||
      comp.type === "ROM_256x8_CS"
    ) {
      const logicResult = config.logic(inputValues, comp.state);

      console.log(`  📊 ROM logic результат:`, logicResult);
      if (logicResult && logicResult.Q0 !== undefined) {
        console.log(`  📊 ROM має Q0, Q1... формат`);
        console.log(`  📊 Q0 type:`, typeof logicResult.Q0);
        console.log(`  📊 Q0 value:`, logicResult.Q0);
      }

      // ROM повертає {memory, Q0, Q1, Q2, ...}
      updatedState = logicResult;

      const dataBits = comp.type === "ROM_16x4" ? 4 : 8;

      updatedOutputs = comp.outputs.map((output, index) => {
        const stateKey = `Q${index}`;
        const baseValue = updatedState[stateKey] ?? 0;

        console.log(
          `    📌 ROM Вихід ${index}: Q${index} = ${baseValue} (type: ${typeof baseValue})`,
        );

        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      console.log(`  📌 ROM updatedOutputs:`, updatedOutputs);
    }

    // ========== ENCODER ==========
    if (
      comp.type === "ENCODER_4_2" ||
      comp.type === "ENCODER_8_3" ||
      comp.type === "ENCODER_16_4"
    ) {
      const outputValues = config.logic(inputValues);

      const updatedOutputs = comp.outputs.map((output, index) => {
        const baseValue = outputValues[index] ?? 0;
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (baseValue === 1 ? 0 : 1) : baseValue;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
      };
    }

    // ========== ЗВИЧАЙНІ ЛОГІЧНІ ЕЛЕМЕНТИ ==========
    else {
      result = config.logic(inputValues, comp.state);

      const updatedOutputs = comp.outputs.map((output) => {
        const isInverted = output.inverted || false;
        const finalValue = isInverted ? (result === 1 ? 0 : 1) : result;
        const hasConnectedInputs = comp.inputs.some((inp) => inp.connected);

        return {
          ...output,
          value: finalValue,
          connected: hasConnectedInputs,
        };
      });

      return {
        ...comp,
        inputs: comp.inputs,
        outputs: updatedOutputs,
        state: updatedState,
      };
    }
  });
};

/**
 * Передає сигнал від виходів компонентів далі на проводи ТА на входи інших компонентів (міні-проводи)
 */
const propagateFromComponentOutputs = (components, wires, activeGroupsMap) => {
  const TOUCH_THRESHOLD = 5;
  const conflicts = []; // ⭐ НОВИЙ МАСИВ ДЛЯ КОНФЛІКТІВ

  components.forEach((sourceComp) => {
    sourceComp.outputs.forEach((output) => {
      if (!output.connected && sourceComp.type !== "CLOCK") return;

      const outputWorldX =
        sourceComp.x + output.wireEndX + sourceComp.width / 2;
      const outputWorldY =
        sourceComp.y + output.wireEndY + sourceComp.height / 2;

      // З'єднання з входами інших компонентів
      components.forEach((targetComp) => {
        if (targetComp.id === sourceComp.id) return;

        targetComp.inputs.forEach((input) => {
          const inputWorldX =
            targetComp.x + input.localX + targetComp.width / 2;
          const inputWorldY =
            targetComp.y + input.localY + targetComp.height / 2;

          const distance = Math.sqrt(
            Math.pow(outputWorldX - inputWorldX, 2) +
              Math.pow(outputWorldY - inputWorldY, 2),
          );

          if (distance < TOUCH_THRESHOLD) {
            input.value = output.value;
            input.connected = true;
          }
        });
      });

      // З'єднання зі звичайними проводами
      const groupsMap = new Map();
      wires.forEach((wire) => {
        if (!groupsMap.has(wire.wireGroupId)) {
          groupsMap.set(wire.wireGroupId, {
            wireGroupId: wire.wireGroupId,
            wireStart: wire.wireStart,
            wireEnd: wire.wireEnd,
          });
        }
      });

      groupsMap.forEach((group, groupId) => {
        const touchesStart =
          Math.abs(outputWorldX - group.wireStart.x) < TOUCH_THRESHOLD &&
          Math.abs(outputWorldY - group.wireStart.y) < TOUCH_THRESHOLD;

        const touchesEnd =
          Math.abs(outputWorldX - group.wireEnd.x) < TOUCH_THRESHOLD &&
          Math.abs(outputWorldY - group.wireEnd.y) < TOUCH_THRESHOLD;

        if (touchesStart || touchesEnd) {
          // Просто логуємо попередження, але ВСЕ ОДНО оновлюємо
          if (activeGroupsMap.has(groupId)) {
            const existingValue = activeGroupsMap.get(groupId);

            if (existingValue !== output.value) {
              console.warn(
                `⚠️ ПЕРЕЗАПИС! Група ${groupId}: ${existingValue} → ${output.value}`,
              );
              console.warn(
                `🔴 ВИНУВАТЕЦЬ: Компонент ${sourceComp.type} (ID: ${sourceComp.id})`,
              );
              console.warn(
                `🔴 Вихід: output index=${sourceComp.outputs.indexOf(output)}, value=${output.value}`,
              );
              console.warn(
                `🔴 Координати виходу: (${outputWorldX}, ${outputWorldY})`,
              );
              console.warn(
                `🔴 Координати групи: start=(${group.wireStart.x}, ${group.wireStart.y}), end=(${group.wireEnd.x}, ${group.wireEnd.y})`,
              );
            }

            if (existingValue !== output.value) {
              conflicts.push({
                groupId: groupId,
                componentType: sourceComp.type,
                componentId: sourceComp.id,
                existingValue: existingValue,
                newValue: output.value,
              });
            }
          } else {
          }

          // ⭐ ЗАВЖДИ ОНОВЛЮЄМО (винесено за межі if)
          activeGroupsMap.set(groupId, output.value);
        }
      });
    });
  });

  return { activeGroupsMap, conflicts }; // ⭐ ПОВЕРТАЄМО ОБА
};

/**
 * ГОЛОВНА ФУНКЦІЯ: Пускає сигнал від точки по проводах з урахуванням Junction, продовжень та компонентів
 */

/**
 * ІНІЦІАЛІЗАЦІЯ СИМУЛЯЦІЇ - створює початкову чергу від INPUT точок
 */
export const initializeSimulation = (points, wires, components) => {
  const updateQueue = [];
  const activeGroupsMap = new Map();
  const processedElements = {
    wireGroups: new Set(),
    components: new Set(),
    points: new Set(),
  };

  const inputPoints = points.filter((point) => point.type === "input");

  console.log(`\n🎬 ІНІЦІАЛІЗАЦІЯ: INPUT точок: ${inputPoints.length}`);

  inputPoints.forEach((point) => {
    console.log(
      `  ➕ Додаємо точку ${point.id} (value=${point.value}) в чергу`,
    );
    updateQueue.push({
      type: "from_point",
      point: point,
      value: point.value,
    });
  });

  console.log(`📋 Початкова черга: ${updateQueue.length} подій\n`);

  return {
    queue: updateQueue,
    activeGroupsMap: activeGroupsMap,
    processedElements: processedElements,
    components: components,
    step: 0,
  };
};

/**
 * ВИКОНАТИ ОДИН КРОК ЕСТАФЕТИ - обробляє ОДНУ подію з черги
 */
export const processSimulationStep = (
  queue,
  activeGroupsMap,
  processedElements,
  components,
  wires,
  junctions,
  points,
  stepNumber,
) => {
  if (queue.length === 0) {
    console.log("✅ Черга пуста - симуляція завершена");
    return {
      queue: [],
      activeGroupsMap,
      processedElements,
      components,
      wires,
      finished: true,
      step: stepNumber,
    };
  }

  const event = queue.shift();
  const newQueue = [...queue];

  console.log(`\n⚡ КРОК ${stepNumber}: Обробляємо подію type="${event.type}"`);
  console.log(`📋 Черга після взяття події: ${newQueue.length} подій`);

  let updatedComponents = [...components];
  const TOUCH_THRESHOLD = 5;

  // Копія processedElements для оновлення
  const newProcessedElements = {
    wireGroups: new Set(processedElements.wireGroups),
    components: new Set(processedElements.components),
    points: new Set(processedElements.points),
  };

  // ========================================
  // ПОДІЯ 1: Сигнал від точки → на проводи
  // ========================================
  if (event.type === "from_point") {
    console.log(`🔵 Точка ${event.point.id} → Проводи (value=${event.value})`);

    // Додаємо точку в оброблені
    newProcessedElements.points.add(event.point.id);

    // 1️⃣ ПЕРЕВІРКА ЗВИЧАЙНИХ ПРОВОДІВ
    const touchedWires = wires.filter((wire) => {
      const wireStart = wire.wireStart || { x: wire.x, y: wire.y };
      const wireEnd = wire.wireEnd || { x: wire.x, y: wire.y };

      const touchesStart =
        Math.abs(event.point.x - wireStart.x) < TOUCH_THRESHOLD &&
        Math.abs(event.point.y - wireStart.y) < TOUCH_THRESHOLD;

      const touchesEnd =
        Math.abs(event.point.x - wireEnd.x) < TOUCH_THRESHOLD &&
        Math.abs(event.point.y - wireEnd.y) < TOUCH_THRESHOLD;

      return touchesStart || touchesEnd;
    });

    console.log(`  🔍 Знайдено проводів: ${touchedWires.length}`);

    const touchedGroupIds = [
      ...new Set(touchedWires.map((w) => w.wireGroupId)),
    ];
    console.log(`  🔍 Унікальних груп: ${touchedGroupIds.length}`);

    touchedGroupIds.forEach((groupId) => {
      const oldValue = activeGroupsMap.get(groupId);

      if (oldValue !== event.value) {
        console.log(
          `  ✅ Група ${groupId}: ${oldValue} → ${event.value} (додаємо в чергу)`,
        );
        activeGroupsMap.set(groupId, event.value);

        // Додаємо групу в оброблені
        newProcessedElements.wireGroups.add(groupId);

        newQueue.push({
          type: "from_wire_group",
          wireGroupId: groupId,
          value: event.value,
        });
      } else {
        console.log(
          `  ⏭️ Група ${groupId}: значення не змінилось (${oldValue})`,
        );
      }
    });

    // 2️⃣ ⭐ НОВА ПЕРЕВІРКА: МІНІ-ПРОВОДИ КОМПОНЕНТІВ (INPUT точка → вхід компонента)
    updatedComponents = updatedComponents.map((comp) => {
      let componentChanged = false;

      const updatedInputs = comp.inputs.map((input) => {
        const inputWorldX = comp.x + input.localX + comp.width / 2;
        const inputWorldY = comp.y + input.localY + comp.height / 2;

        const distance = Math.sqrt(
          Math.pow(event.point.x - inputWorldX, 2) +
            Math.pow(event.point.y - inputWorldY, 2),
        );

        const touchesMiniWire = distance < TOUCH_THRESHOLD;

        if (touchesMiniWire && input.value !== event.value) {
          console.log(
            `  ✅ Точка → Міні-провід компонента ${comp.type} (${comp.id}): вхід оновлено на ${event.value}`,
          );
          componentChanged = true;
          return { ...input, value: event.value, connected: true };
        }

        return input;
      });

      if (componentChanged) {
        console.log(`  ➕ Додаємо recalculate_component для ${comp.id}`);
        newQueue.push({
          type: "recalculate_component",
          componentId: comp.id,
        });

        return { ...comp, inputs: updatedInputs };
      }

      return comp;
    });
  }

  // ========================================
  // ПОДІЯ 2: Сигнал від групи проводів → на компоненти і сусідні проводи
  // ========================================
  else if (event.type === "from_wire_group") {
    console.log(
      `🟢 Провід група ${event.wireGroupId} → Компоненти + Сусіди (value=${event.value})`,
    );

    // Група вже в processedElements (додана при активації)

    // 1️⃣ Поширення на СУСІДНІ ГРУПИ

    // Junction
    const relevantJunctions = junctions.filter(
      (junction) =>
        junction.wireGroups && junction.wireGroups.includes(event.wireGroupId),
    );

    console.log(`  🔍 Знайдено junction: ${relevantJunctions.length}`);

    relevantJunctions.forEach((junction) => {
      const connectedGroups = junction.wireGroups || [];
      connectedGroups.forEach((connectedGroupId) => {
        if (connectedGroupId === event.wireGroupId) return;

        const oldValue = activeGroupsMap.get(connectedGroupId);
        if (oldValue !== event.value) {
          console.log(
            `  ✅ Junction → Група ${connectedGroupId}: ${oldValue} → ${event.value}`,
          );
          activeGroupsMap.set(connectedGroupId, event.value);

          // Додаємо групу в оброблені
          newProcessedElements.wireGroups.add(connectedGroupId);

          newQueue.push({
            type: "from_wire_group",
            wireGroupId: connectedGroupId,
            value: event.value,
          });
        }
      });
    });

    // Продовження (торкання кінцями)
    const groupsMap = new Map();
    wires.forEach((wire) => {
      if (!groupsMap.has(wire.wireGroupId)) {
        groupsMap.set(wire.wireGroupId, {
          wireGroupId: wire.wireGroupId,
          wireStart: wire.wireStart,
          wireEnd: wire.wireEnd,
        });
      }
    });

    const currentGroup = groupsMap.get(event.wireGroupId);
    if (currentGroup) {
      const start = currentGroup.wireStart;
      const end = currentGroup.wireEnd;

      groupsMap.forEach((otherGroup, otherGroupId) => {
        if (otherGroupId === event.wireGroupId) return;

        const otherStart = otherGroup.wireStart;
        const otherEnd = otherGroup.wireEnd;

        const endTouchesStart =
          Math.abs(end.x - otherStart.x) < TOUCH_THRESHOLD &&
          Math.abs(end.y - otherStart.y) < TOUCH_THRESHOLD;

        const endTouchesEnd =
          Math.abs(end.x - otherEnd.x) < TOUCH_THRESHOLD &&
          Math.abs(end.y - otherEnd.y) < TOUCH_THRESHOLD;

        const startTouchesStart =
          Math.abs(start.x - otherStart.x) < TOUCH_THRESHOLD &&
          Math.abs(start.y - otherStart.y) < TOUCH_THRESHOLD;

        const startTouchesEnd =
          Math.abs(start.x - otherEnd.x) < TOUCH_THRESHOLD &&
          Math.abs(start.y - otherEnd.y) < TOUCH_THRESHOLD;

        if (
          endTouchesStart ||
          endTouchesEnd ||
          startTouchesStart ||
          startTouchesEnd
        ) {
          const oldValue = activeGroupsMap.get(otherGroupId);
          if (oldValue !== event.value) {
            console.log(
              `  ✅ Continuation → Група ${otherGroupId}: ${oldValue} → ${event.value}`,
            );
            activeGroupsMap.set(otherGroupId, event.value);

            // Додаємо групу в оброблені
            newProcessedElements.wireGroups.add(otherGroupId);

            newQueue.push({
              type: "from_wire_group",
              wireGroupId: otherGroupId,
              value: event.value,
            });
          }
        }
      });
    }

    // 2️⃣ Поширення на КОМПОНЕНТИ

    if (currentGroup) {
      const start = currentGroup.wireStart;
      const end = currentGroup.wireEnd;

      updatedComponents = updatedComponents.map((comp) => {
        let componentChanged = false;

        const updatedInputs = comp.inputs.map((input) => {
          const inputWorldX = comp.x + input.localX + comp.width / 2;
          const inputWorldY = comp.y + input.localY + comp.height / 2;

          const distanceToStart = Math.sqrt(
            Math.pow(start.x - inputWorldX, 2) +
              Math.pow(start.y - inputWorldY, 2),
          );
          const distanceToEnd = Math.sqrt(
            Math.pow(end.x - inputWorldX, 2) + Math.pow(end.y - inputWorldY, 2),
          );

          const touches =
            distanceToStart < TOUCH_THRESHOLD ||
            distanceToEnd < TOUCH_THRESHOLD;

          if (touches && input.value !== event.value) {
            console.log(
              `  ✅ Компонент ${comp.type} (${comp.id}): вхід оновлено на ${event.value}`,
            );
            componentChanged = true;
            return { ...input, value: event.value, connected: true };
          }

          return input;
        });

        if (componentChanged) {
          newQueue.push({
            type: "recalculate_component",
            componentId: comp.id,
          });

          return { ...comp, inputs: updatedInputs };
        }

        return comp;
      });
    }
  }

  // ========================================
  // ПОДІЯ 3: Компонент має перерахувати логіку
  // ========================================
  else if (event.type === "recalculate_component") {
    console.log(`🟡 Перерахунок компонента ${event.componentId}`);

    const compIndex = updatedComponents.findIndex(
      (c) => c.id === event.componentId,
    );

    if (compIndex === -1) {
      console.log(`  ❌ Компонент не знайдено!`);
    } else {
      const comp = updatedComponents[compIndex];

      // Додаємо компонент в оброблені
      newProcessedElements.components.add(comp.id);

      const config = GATE_CONFIGS[comp.type];
      if (!config) {
        console.log(`  ❌ Конфіг не знайдено для ${comp.type}`);
      } else {
        // CLOCK
        if (comp.type === "CLOCK") {
          const clockValue = comp.state?.value || 0;
          const updatedOutputs = comp.outputs.map((output) => ({
            ...output,
            value: output.inverted ? (clockValue === 1 ? 0 : 1) : clockValue,
            connected: true,
          }));

          updatedComponents[compIndex] = {
            ...comp,
            outputs: updatedOutputs,
          };
        }
        // Інші компоненти
        else {
          const inputValues = comp.inputs.map((input) => {
            const isInverted = input.inverted || false;
            return isInverted ? (input.value === 1 ? 0 : 1) : input.value;
          });

          let result = config.logic(inputValues, comp.state);
          let updatedState = comp.state;

          // Якщо є стан (тригери, регістри і т.д.)
          if (
            typeof result === "object" &&
            result !== null &&
            !Array.isArray(result)
          ) {
            updatedState = result;
          }

          // Оновлюємо виходи
          let updatedOutputs;

          if (
            comp.type === "D_TRIGGER" ||
            comp.type === "RS_TRIGGER" ||
            comp.type === "JK_TRIGGER" ||
            comp.type === "T_TRIGGER"
          ) {
            updatedOutputs = comp.outputs.map((output, index) => {
              const baseValue =
                index === 0 ? updatedState.Q : updatedState.Qbar;
              const hasConnectedInputs = comp.inputs.some(
                (inp) => inp.connected,
              );
              return {
                ...output,
                value: baseValue,
                connected: hasConnectedInputs,
              };
            });
          } else if (
            comp.type === "REGISTER_4BIT" ||
            comp.type === "REGISTER_8BIT" ||
            comp.type === "SHIFT_REGISTER_4BIT" ||
            comp.type === "SHIFT_REGISTER_8BIT"
          ) {
            const bitCount =
              comp.type === "REGISTER_8BIT" ||
              comp.type === "SHIFT_REGISTER_8BIT"
                ? 8
                : 4;
            updatedOutputs = comp.outputs.map((output, index) => {
              const stateKey = `Q${index}`;
              const baseValue = updatedState[stateKey] ?? 0;
              const isInverted = output.inverted || false;
              const finalValue = isInverted
                ? baseValue === 1
                  ? 0
                  : 1
                : baseValue;
              const hasConnectedInputs = comp.inputs.some(
                (inp) => inp.connected,
              );
              return {
                ...output,
                value: finalValue,
                connected: hasConnectedInputs,
              };
            });
          } else if (
            comp.type === "COUNTER_4BIT" ||
            comp.type === "COUNTER_8BIT" ||
            comp.type === "COUNTER_4BIT_UP"
          ) {
            const bitCount = comp.type === "COUNTER_8BIT" ? 8 : 4;
            updatedOutputs = comp.outputs.map((output, index) => {
              let baseValue;
              if (index < bitCount) {
                const stateKey = `Q${index}`;
                baseValue = updatedState[stateKey] ?? 0;
              } else {
                baseValue = updatedState.overflow ?? 0;
              }
              const isInverted = output.inverted || false;
              const finalValue = isInverted
                ? baseValue === 1
                  ? 0
                  : 1
                : baseValue;
              const hasConnectedInputs = comp.inputs.some(
                (inp) => inp.connected,
              );
              return {
                ...output,
                value: finalValue,
                connected: hasConnectedInputs,
              };
            });
          }
          // ========== RAM ==========
          else if (
            comp.type === "RAM_16x4" ||
            comp.type === "RAM_16x8" ||
            comp.type === "RAM_256x8" ||
            comp.type === "RAM_256x8_CS"
          ) {
            const logicResult = config.logic(inputValues, comp.state);

            console.log(`  📊 RAM logic результат:`, logicResult);
            if (logicResult && logicResult.outputs) {
              console.log(`  📊 outputs array:`, logicResult.outputs);
              console.log(
                `  📊 outputs[0] type:`,
                typeof logicResult.outputs[0],
              );
              console.log(`  📊 outputs[0] value:`, logicResult.outputs[0]);
            }

            // Перевіряємо новий формат {state, outputs}
            if (
              logicResult &&
              logicResult.state &&
              Array.isArray(logicResult.outputs)
            ) {
              console.log(`  ✅ Новий формат RAM виявлено`);

              updatedState = logicResult.state;

              updatedOutputs = comp.outputs.map((output, index) => {
                const baseValue = logicResult.outputs[index] ?? 0;

                console.log(
                  `    📌 Вихід ${index}: baseValue = ${baseValue} (type: ${typeof baseValue})`,
                );

                const isInverted = output.inverted || false;
                const finalValue = isInverted
                  ? baseValue === 1
                    ? 0
                    : 1
                  : baseValue;
                const hasConnectedInputs = comp.inputs.some(
                  (inp) => inp.connected,
                );

                return {
                  ...output,
                  value: finalValue,
                  connected: hasConnectedInputs,
                };
              });

              console.log(`  📌 updatedOutputs:`, updatedOutputs);
            } else {
              console.log(`  ⚠️ Старий формат RAM або невалідний результат`);

              // Старий формат (сумісність)
              updatedState = logicResult;

              updatedOutputs = comp.outputs.map((output, index) => {
                const stateKey = `Q${index}`;
                const baseValue = updatedState[stateKey] ?? 0;
                const isInverted = output.inverted || false;
                const finalValue = isInverted
                  ? baseValue === 1
                    ? 0
                    : 1
                  : baseValue;
                const hasConnectedInputs = comp.inputs.some(
                  (inp) => inp.connected,
                );

                return {
                  ...output,
                  value: finalValue,
                  connected: hasConnectedInputs,
                };
              });
            }
          }
          // ========== ROM ==========
          else if (
            comp.type === "ROM_16x4" ||
            comp.type === "ROM_16x8" ||
            comp.type === "ROM_256x8" ||
            comp.type === "ROM_256x8_CS"
          ) {
            const logicResult = config.logic(inputValues, comp.state);

            console.log(`  📊 ROM logic результат:`, logicResult);
            if (logicResult && logicResult.Q0 !== undefined) {
              console.log(`  📊 ROM має Q0, Q1... формат`);
              console.log(`  📊 Q0 type:`, typeof logicResult.Q0);
              console.log(`  📊 Q0 value:`, logicResult.Q0);
            }

            // ROM повертає {memory, Q0, Q1, Q2, ...}
            updatedState = logicResult;

            const dataBits = comp.type === "ROM_16x4" ? 4 : 8;

            updatedOutputs = comp.outputs.map((output, index) => {
              const stateKey = `Q${index}`;
              const baseValue = updatedState[stateKey] ?? 0;

              console.log(
                `    📌 ROM Вихід ${index}: Q${index} = ${baseValue} (type: ${typeof baseValue})`,
              );

              const isInverted = output.inverted || false;
              const finalValue = isInverted
                ? baseValue === 1
                  ? 0
                  : 1
                : baseValue;
              const hasConnectedInputs = comp.inputs.some(
                (inp) => inp.connected,
              );

              return {
                ...output,
                value: finalValue,
                connected: hasConnectedInputs,
              };
            });

            console.log(`  📌 ROM updatedOutputs:`, updatedOutputs);
          } else if (Array.isArray(result)) {
            // Масив виходів (дешифратори, ALU, тощо)
            updatedOutputs = comp.outputs.map((output, index) => {
              const baseValue = result[index] ?? 0;
              const isInverted = output.inverted || false;
              const finalValue = isInverted
                ? baseValue === 1
                  ? 0
                  : 1
                : baseValue;
              const hasConnectedInputs = comp.inputs.some(
                (inp) => inp.connected,
              );
              return {
                ...output,
                value: finalValue,
                connected: hasConnectedInputs,
              };
            });
          } else {
            // Прості логічні елементи (один вихід)
            const outputValue = result;
            updatedOutputs = comp.outputs.map((output) => {
              const isInverted = output.inverted || false;
              const finalValue = isInverted
                ? outputValue === 1
                  ? 0
                  : 1
                : outputValue;
              const hasConnectedInputs = comp.inputs.some(
                (inp) => inp.connected,
              );
              return {
                ...output,
                value: finalValue,
                connected: hasConnectedInputs,
              };
            });
          }

          // Перевіряємо чи змінились виходи
          const outputsChanged = updatedOutputs.some(
            (output, i) => output.value !== comp.outputs[i].value,
          );

          if (outputsChanged) {
            console.log(`  ✅ Виходи змінились! Додаємо в чергу`);

            newQueue.push({
              type: "from_component",
              componentId: comp.id,
            });
          } else {
            console.log(`  ⏭️ Виходи не змінились`);
          }

          updatedComponents[compIndex] = {
            ...comp,
            outputs: updatedOutputs,
            state: updatedState,
          };
        }
      }
    }
  }

  // ========================================
  // ПОДІЯ 4: Виходи компонента → на проводи
  // ========================================
  else if (event.type === "from_component") {
    console.log(`🟠 Компонент ${event.componentId} → Проводи`);

    const comp = updatedComponents.find((c) => c.id === event.componentId);
    if (!comp) {
      console.log(`  ❌ Компонент не знайдено!`);
    } else {
      comp.outputs.forEach((output, outputIndex) => {
        if (!output.connected && comp.type !== "CLOCK") return;

        const outputWorldX = comp.x + output.wireEndX + comp.width / 2;
        const outputWorldY = comp.y + output.wireEndY + comp.height / 2;

        console.log(
          `  🔍 Вихід ${outputIndex} (value=${output.value}) на (${outputWorldX}, ${outputWorldY})`,
        );

        // Знаходимо групи проводів
        const groupsMap = new Map();
        wires.forEach((wire) => {
          if (!groupsMap.has(wire.wireGroupId)) {
            groupsMap.set(wire.wireGroupId, {
              wireGroupId: wire.wireGroupId,
              wireStart: wire.wireStart,
              wireEnd: wire.wireEnd,
            });
          }
        });

        groupsMap.forEach((group, groupId) => {
          const touchesStart =
            Math.abs(outputWorldX - group.wireStart.x) < TOUCH_THRESHOLD &&
            Math.abs(outputWorldY - group.wireStart.y) < TOUCH_THRESHOLD;

          const touchesEnd =
            Math.abs(outputWorldX - group.wireEnd.x) < TOUCH_THRESHOLD &&
            Math.abs(outputWorldY - group.wireEnd.y) < TOUCH_THRESHOLD;

          if (touchesStart || touchesEnd) {
            const oldValue = activeGroupsMap.get(groupId);

            if (oldValue !== output.value) {
              console.log(
                `  ✅ Група ${groupId}: ${oldValue} → ${output.value} (додаємо в чергу)`,
              );
              activeGroupsMap.set(groupId, output.value);

              // Додаємо групу в оброблені
              newProcessedElements.wireGroups.add(groupId);

              newQueue.push({
                type: "from_wire_group",
                wireGroupId: groupId,
                value: output.value,
              });
            }
          }
        });

        // Прямі з'єднання компонент → компонент
        updatedComponents.forEach((targetComp, targetIndex) => {
          if (targetComp.id === comp.id) return;

          targetComp.inputs.forEach((input, inputIndex) => {
            const inputWorldX =
              targetComp.x + input.localX + targetComp.width / 2;
            const inputWorldY =
              targetComp.y + input.localY + targetComp.height / 2;

            const distance = Math.sqrt(
              Math.pow(outputWorldX - inputWorldX, 2) +
                Math.pow(outputWorldY - inputWorldY, 2),
            );

            if (distance < TOUCH_THRESHOLD && input.value !== output.value) {
              console.log(
                `  ✅ Прямо на компонент ${targetComp.type} вхід ${inputIndex}`,
              );

              updatedComponents[targetIndex] = {
                ...targetComp,
                inputs: targetComp.inputs.map((inp, i) =>
                  i === inputIndex
                    ? { ...inp, value: output.value, connected: true }
                    : inp,
                ),
              };

              newQueue.push({
                type: "recalculate_component",
                componentId: targetComp.id,
              });
            }
          });
        });
      });
    }
  }

  console.log(`📋 Черга після обробки: ${newQueue.length} подій`);
  console.log(
    `📊 Оброблено: точок=${newProcessedElements.points.size}, груп=${newProcessedElements.wireGroups.size}, компонентів=${newProcessedElements.components.size}\n`,
  );

  // Оновлюємо проводи
  const updatedWires = wires.map((wire) => ({
    ...wire,
    active: activeGroupsMap.has(wire.wireGroupId),
    value: activeGroupsMap.get(wire.wireGroupId) || 0,
  }));

  return {
    queue: newQueue,
    activeGroupsMap,
    processedElements: newProcessedElements,
    components: updatedComponents,
    wires: updatedWires,
    finished: false,
    step: stepNumber + 1,
  };
};

// ========================================
// ⭐ COMPATIBILITY WRAPPER для TruthTable
// ========================================

/**
 * Стара функція для зворотної сумісності з TruthTable Generator
 * Виконує ПОВНУ симуляцію (всі кроки одразу) і повертає результат
 */
export const propagateSignalFromPoints = (
  points,
  wires,
  junctions,
  components,
) => {
  console.log("\n📊 [TruthTable Mode] Запуск повної симуляції...");

  // Ініціалізуємо
  const initialState = initializeSimulation(points, wires, components);

  let state = {
    queue: initialState.queue,
    activeGroupsMap: initialState.activeGroupsMap,
    processedElements: initialState.processedElements,
    components: components,
    wires: wires,
  };

  // Виконуємо всі кроки до завершення
  let iteration = 0;
  const MAX_ITERATIONS = 100;

  while (state.queue.length > 0 && iteration < MAX_ITERATIONS) {
    const result = processSimulationStep(
      state.queue,
      state.activeGroupsMap,
      state.processedElements,
      state.components,
      wires,
      junctions,
      points,
      iteration,
    );

    state = {
      queue: result.queue,
      activeGroupsMap: result.activeGroupsMap,
      processedElements: result.processedElements,
      components: result.components,
      wires: result.wires,
    };

    iteration++;

    if (result.finished) {
      console.log(`✅ [TruthTable Mode] Завершено за ${iteration} кроків`);
      break;
    }
  }

  if (iteration === MAX_ITERATIONS) {
    console.warn(
      `⚠️ [TruthTable Mode] Досягнуто ліміт ${MAX_ITERATIONS} ітерацій`,
    );
  }

  return {
    wires: state.wires,
    components: state.components,
    conflicts: [],
  };
};
