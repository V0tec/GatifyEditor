const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;

export const createTrigger = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // D-тригер: 2 входи (D, CLK), 2 виходи (Q, Q̅)
  if (type === "D_TRIGGER") {
    const triggerHeight = 120;
    return {
      id,
      type,
      x,
      y,
      width,
      height: triggerHeight,
      inputCount: 2,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -triggerHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -triggerHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "D",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: triggerHeight / 2 - 20,
          wireEndX: -width / 2,
          wireEndY: triggerHeight / 2 - 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -triggerHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -triggerHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Q",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: triggerHeight / 2 - 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: triggerHeight / 2 - 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Q̅",
        },
      ],
      state: { Q: 0, Qbar: 1, prevCLK: 0 },
    };
  }

  // RS-тригер: 2 входи (S, R), 2 виходи (Q, Q̅)
  if (type === "RS_TRIGGER") {
    const triggerHeight = 120;
    return {
      id,
      type,
      x,
      y,
      width,
      height: triggerHeight,
      inputCount: 2,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -triggerHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -triggerHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "S",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: triggerHeight / 2 - 20,
          wireEndX: -width / 2,
          wireEndY: triggerHeight / 2 - 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "R",
        },
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -triggerHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -triggerHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Q",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: triggerHeight / 2 - 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: triggerHeight / 2 - 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Q̅",
        },
      ],
      state: { Q: 0, Qbar: 1 },
    };
  }

  // JK-тригер: 3 входи (J, K, CLK), 2 виходи (Q, Q̅)
  if (type === "JK_TRIGGER") {
    const triggerHeight = 120;
    return {
      id,
      type,
      x,
      y,
      width,
      height: triggerHeight,
      inputCount: 3,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -triggerHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -triggerHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "J",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: 0,
          wireEndX: -width / 2,
          wireEndY: 0,
          value: 0,
          inverted: false,
          connected: false,
          label: "K",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: triggerHeight / 2 - 20,
          wireEndX: -width / 2,
          wireEndY: triggerHeight / 2 - 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -triggerHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -triggerHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Q",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: triggerHeight / 2 - 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: triggerHeight / 2 - 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Q̅",
        },
      ],
      state: { Q: 0, Qbar: 1, prevCLK: 0 },
    };
  }

  // T-тригер: 2 входи (T, CLK), 2 виходи (Q, Q̅)
  if (type === "T_TRIGGER") {
    const triggerHeight = 120;
    return {
      id,
      type,
      x,
      y,
      width,
      height: triggerHeight,
      inputCount: 2,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -triggerHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -triggerHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "T",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: triggerHeight / 2 - 20,
          wireEndX: -width / 2,
          wireEndY: triggerHeight / 2 - 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -triggerHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -triggerHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Q",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: triggerHeight / 2 - 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: triggerHeight / 2 - 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Q̅",
        },
      ],
      state: { Q: 0, Qbar: 1, prevCLK: 0 },
    };
  }

  return null;
};
