const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20;

export const createRegister = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // 4-бітний регістр: D0-D3, CLK, EN → Q0-Q3
  if (type === "REGISTER_4BIT") {
    const registerHeight = 20 + 6 * PORT_SPACING; // 6 входів
    return {
      id,
      type,
      x,
      y,
      width,
      height: registerHeight,
      inputCount: 6,
      inputs: [
        // Data inputs D0-D3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `D${i}`,
        })),
        // Clock
        {
          id: `${id}-input-4`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + 4 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + 4 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
        // Enable
        {
          id: `${id}-input-5`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + 5 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + 5 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "EN",
        },
      ],
      outputs: Array.from({ length: 4 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -registerHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -registerHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: { Q0: 0, Q1: 0, Q2: 0, Q3: 0, prevCLK: 0 },
    };
  }

  // 8-бітний регістр: D0-D7, CLK, EN → Q0-Q7
  if (type === "REGISTER_8BIT") {
    const registerHeight = 20 + 10 * PORT_SPACING; // 10 входів
    return {
      id,
      type,
      x,
      y,
      width,
      height: registerHeight,
      inputCount: 10,
      inputs: [
        // Data inputs D0-D7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `D${i}`,
        })),
        // Clock
        {
          id: `${id}-input-8`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + 8 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + 8 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
        // Enable
        {
          id: `${id}-input-9`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + 9 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + 9 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "EN",
        },
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -registerHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -registerHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        Q0: 0,
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        Q5: 0,
        Q6: 0,
        Q7: 0,
        prevCLK: 0,
      },
    };
  }

  // Зсувний регістр 4-bit: Data_In, CLK, Shift_EN → Q0-Q3
  if (type === "SHIFT_REGISTER_4BIT") {
    const registerHeight = 20 + 4 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: registerHeight,
      inputCount: 3,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "Din",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + 2 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + 2 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "SH",
        },
      ],
      outputs: Array.from({ length: 4 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -registerHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -registerHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: { Q0: 0, Q1: 0, Q2: 0, Q3: 0, prevCLK: 0 },
    };
  }

  // Зсувний регістр 8-bit
  if (type === "SHIFT_REGISTER_8BIT") {
    const registerHeight = 20 + 8 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: registerHeight,
      inputCount: 3,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "Din",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -registerHeight / 2 + 20 + 2 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -registerHeight / 2 + 20 + 2 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "SH",
        },
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -registerHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -registerHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        Q0: 0,
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        Q5: 0,
        Q6: 0,
        Q7: 0,
        prevCLK: 0,
      },
    };
  }

  return null;
};
