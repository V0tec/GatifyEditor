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
      result = config.logic(inputValues, comp.state);
      updatedState = result;

      const dataBits = comp.type === "RAM_16x4" ? 4 : 8;

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
    if (
      comp.type === "ROM_16x4" ||
      comp.type === "ROM_16x8" ||
      comp.type === "ROM_256x8" ||
      comp.type === "ROM_256x8_CS"
    ) {
      result = config.logic(inputValues, comp.state);
      updatedState = result;

      const dataBits = comp.type === "ROM_16x4" ? 4 : 8;

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
export const propagateSignalFromPoints = (
  points,
  wires,
  junctions = [],
  components = [],
) => {
  const MAX_ITERATIONS = 100;
  let iteration = 0;
  let allConflicts = [];

  let activeGroupsMap = new Map();
  let processedGroups = new Set();
  let previousConflictSignature = ""; // ⭐ НОВИЙ

  // ===== КРОК 1: Активація від точок =====
  const inputPoints = points.filter((point) => point.type === "input");

  inputPoints.forEach((point) => {
    const touchedWires = findWiresTouchedByPoint(point, wires);
    if (touchedWires.length === 0) return;

    const initialGroups = [...new Set(touchedWires.map((w) => w.wireGroupId))];
    const groupsToProcess = [...initialGroups];

    while (groupsToProcess.length > 0) {
      const currentGroupId = groupsToProcess.shift();
      if (processedGroups.has(currentGroupId)) continue;

      activeGroupsMap.set(currentGroupId, point.value);
      processedGroups.add(currentGroupId);

      // Junction
      const relevantJunctions = findJunctionsOnActiveWires(
        [currentGroupId],
        junctions,
      );
      relevantJunctions.forEach((junction) => {
        const newGroups = getNewGroupsFromJunction(
          junction,
          Array.from(processedGroups),
        );
        newGroups.forEach((groupId) => {
          if (!groupsToProcess.includes(groupId)) {
            groupsToProcess.push(groupId);
          }
        });
      });

      // Продовження
      const continuationGroups = findContinuationGroups(
        currentGroupId,
        wires,
        processedGroups,
      );
      continuationGroups.forEach((groupId) => {
        if (!groupsToProcess.includes(groupId)) {
          groupsToProcess.push(groupId);
        }
      });
    }
  });

  // ===== КРОК 2: Ітеративна обробка компонентів =====
  let updatedComponents = [...components];

  let previousState = {
    components: JSON.stringify(
      updatedComponents.map((c) => ({
        id: c.id,
        inputs: c.inputs.map((i) => ({
          value: i.value,
          connected: i.connected,
        })),
        outputs: c.outputs.map((o) => ({
          value: o.value,
          connected: o.connected,
        })),
      })),
    ),
    activeGroupsSize: activeGroupsMap.size,
    activeGroupsValues: JSON.stringify(Array.from(activeGroupsMap.entries())),
  };

  while (iteration < MAX_ITERATIONS) {
    updatedComponents = propagateToComponentInputs(
      activeGroupsMap,
      wires,
      updatedComponents,
      points,
    );
    updatedComponents = calculateComponentLogic(updatedComponents);

    const previousSize = activeGroupsMap.size;
    const result = propagateFromComponentOutputs(
      updatedComponents,
      wires,
      activeGroupsMap,
    );
    activeGroupsMap = result.activeGroupsMap;

    if (result.conflicts.length > 0) {
      allConflicts = [...allConflicts, ...result.conflicts];

      // ⭐ ПЕРЕВІРКА НА ОСЦИЛЯТОР
      const conflictSignature = result.conflicts
        .map((c) => `${c.groupId}:${c.newValue}`)
        .sort()
        .join(",");

      if (conflictSignature === previousConflictSignature) {
        console.log("⚠️ Виявлено осцилятор, пропускаємо перепоширення");
      } else {
        console.log(
          `🔄 Виявлено ${result.conflicts.length} конфліктів, перепоширюємо...`,
        );

        result.conflicts.forEach((conflict) => {
          const changedGroupId = conflict.groupId;
          const newValue = conflict.newValue;

          console.log(
            `🔄 Поширюємо зміну групи ${changedGroupId}: ${conflict.existingValue} → ${newValue}`,
          );

          activeGroupsMap.set(changedGroupId, newValue);

          const groupsToReprocess = [changedGroupId];
          const reprocessed = new Set();

          while (groupsToReprocess.length > 0) {
            const gId = groupsToReprocess.shift();

            if (reprocessed.has(gId)) continue;
            reprocessed.add(gId);

            activeGroupsMap.set(gId, newValue);
            console.log(`  ↳ Оновлено групу ${gId} на ${newValue}`);

            const relevantJunctions = findJunctionsOnActiveWires(
              [gId],
              junctions,
            );
            relevantJunctions.forEach((junction) => {
              const connectedGroups = junction.wireGroups || [];
              connectedGroups.forEach((connGId) => {
                if (!reprocessed.has(connGId) && activeGroupsMap.has(connGId)) {
                  groupsToReprocess.push(connGId);
                }
              });
            });

            const continuations = findContinuationGroups(
              gId,
              wires,
              reprocessed,
            );
            continuations.forEach((cId) => {
              if (!reprocessed.has(cId) && activeGroupsMap.has(cId)) {
                groupsToReprocess.push(cId);
              }
            });
          }

          console.log(
            `✅ Перепоширено ${reprocessed.size} груп для конфлікту ${changedGroupId}`,
          );
        });

        // ⭐⭐⭐ ДОДАЙ ЦЕ ПІСЛЯ ПЕРЕПОШИРЕННЯ: ⭐⭐⭐
        console.log("🔄 Оновлюємо компоненти після перепоширення...");
        updatedComponents = propagateToComponentInputs(
          activeGroupsMap,
          wires,
          updatedComponents,
          points,
        );
        updatedComponents = calculateComponentLogic(updatedComponents);

        previousConflictSignature = conflictSignature;
      }
    }

    // Поширення нових груп від компонентів
    if (activeGroupsMap.size > previousSize) {
      let newGroups = Array.from(activeGroupsMap.keys()).filter(
        (id) => !processedGroups.has(id),
      );

      while (newGroups.length > 0) {
        const currentGroupId = newGroups.shift();
        if (processedGroups.has(currentGroupId)) continue;

        processedGroups.add(currentGroupId);

        const relevantJunctions = findJunctionsOnActiveWires(
          [currentGroupId],
          junctions,
        );
        relevantJunctions.forEach((junction) => {
          const groups = getNewGroupsFromJunction(
            junction,
            Array.from(processedGroups),
          );
          groups.forEach((gId) => {
            if (!activeGroupsMap.has(gId)) {
              const groupValue = activeGroupsMap.get(currentGroupId);
              activeGroupsMap.set(gId, groupValue);
              newGroups.push(gId);
            }
          });
        });

        const continuations = findContinuationGroups(
          currentGroupId,
          wires,
          processedGroups,
        );
        continuations.forEach((gId) => {
          if (!activeGroupsMap.has(gId)) {
            const groupValue = activeGroupsMap.get(currentGroupId);
            activeGroupsMap.set(gId, groupValue);
            newGroups.push(gId);
          }
        });
      }
    }

    // Перевірка стабілізації
    const currentState = {
      components: JSON.stringify(
        updatedComponents.map((c) => ({
          id: c.id,
          inputs: c.inputs.map((i) => ({
            value: i.value,
            connected: i.connected,
          })),
          outputs: c.outputs.map((o) => ({
            value: o.value,
            connected: o.connected,
          })),
        })),
      ),
      activeGroupsSize: activeGroupsMap.size,
      activeGroupsValues: JSON.stringify(Array.from(activeGroupsMap.entries())),
    };

    const nothingChanged =
      currentState.components === previousState.components &&
      currentState.activeGroupsSize === previousState.activeGroupsSize &&
      currentState.activeGroupsValues === previousState.activeGroupsValues;

    if (nothingChanged && iteration >= 2) {
      console.log(`✅ Стабілізація досягнута на ітерації ${iteration}`);
      break;
    }

    previousState = currentState;
    iteration++;

    if (iteration === MAX_ITERATIONS) {
      console.warn(`⚠️ Досягнуто максимум ітерацій (${MAX_ITERATIONS})`);
    }
  }

  // ===== КРОК 3: Оновлюємо проводи =====
  console.log("\n🔌 ОНОВЛЕННЯ ПРОВОДІВ:");
  console.log("activeGroupsMap:", Array.from(activeGroupsMap.entries()));

  const updatedWires = wires.map((wire) => {
    const isActive = activeGroupsMap.has(wire.wireGroupId);
    const value = activeGroupsMap.get(wire.wireGroupId) || 0;

    if (isActive) {
      console.log(
        `📍 Провід ${wire.id}: група ${wire.wireGroupId}, value=${value}, ` +
          `coords: (${wire.x}, ${wire.y}), direction: ${wire.direction}`,
      );
    }

    return {
      ...wire,
      active: isActive,
      value: value,
    };
  });

  return {
    wires: updatedWires,
    components: updatedComponents,
    conflicts: allConflicts,
  };
};
