const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20;

export const createCounter = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // 4-бітний лічильник UP/DOWN
  if (type === "COUNTER_4BIT") {
    const counterHeight = 20 + 5 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: counterHeight,
      inputCount: 4,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20 + PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "EN",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20 + 2 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20 + 2 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "RST",
        },
        {
          id: `${id}-input-3`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20 + 3 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20 + 3 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "UP",
        },
      ],
      outputs: [
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-output-${i}`,
          localX: width / 2,
          localY: -counterHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -counterHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: `Q${i}`,
        })),
        {
          id: `${id}-output-4`,
          localX: width / 2,
          localY: -counterHeight / 2 + 20 + 4 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -counterHeight / 2 + 20 + 4 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "OVF",
        },
      ],
      state: { count: 0, Q0: 0, Q1: 0, Q2: 0, Q3: 0, overflow: 0, prevCLK: 0 },
    };
  }

  // 8-бітний лічильник UP/DOWN
  if (type === "COUNTER_8BIT") {
    const counterHeight = 20 + 9 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: counterHeight,
      inputCount: 4,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20 + PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "EN",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20 + 2 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20 + 2 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "RST",
        },
        {
          id: `${id}-input-3`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20 + 3 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20 + 3 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "UP",
        },
      ],
      outputs: [
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-output-${i}`,
          localX: width / 2,
          localY: -counterHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -counterHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: `Q${i}`,
        })),
        {
          id: `${id}-output-8`,
          localX: width / 2,
          localY: -counterHeight / 2 + 20 + 8 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -counterHeight / 2 + 20 + 8 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "OVF",
        },
      ],
      state: {
        count: 0,
        Q0: 0,
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        Q5: 0,
        Q6: 0,
        Q7: 0,
        overflow: 0,
        prevCLK: 0,
      },
    };
  }

  // Простий 4-бітний лічильник (тільки UP)
  if (type === "COUNTER_4BIT_UP") {
    const counterHeight = 20 + 5 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: counterHeight,
      inputCount: 3,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20 + PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "EN",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -counterHeight / 2 + 20 + 2 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -counterHeight / 2 + 20 + 2 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "RST",
        },
      ],
      outputs: [
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-output-${i}`,
          localX: width / 2,
          localY: -counterHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -counterHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: `Q${i}`,
        })),
        {
          id: `${id}-output-4`,
          localX: width / 2,
          localY: -counterHeight / 2 + 20 + 4 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -counterHeight / 2 + 20 + 4 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "OVF",
        },
      ],
      state: { count: 0, Q0: 0, Q1: 0, Q2: 0, Q3: 0, overflow: 0, prevCLK: 0 },
    };
  }

  return null;
};
