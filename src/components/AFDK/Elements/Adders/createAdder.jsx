const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20; // Інтервал між портами

export const createAdder = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // Напівсуматор (Half Adder): 2 входи (A, B), 2 виходи (Sum, Carry)
  if (type === "HALF_ADDER") {
    const adderHeight = 20 + 2 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: adderHeight,
      inputCount: 2,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "A",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "B",
        },
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -adderHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -adderHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "S",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: -adderHeight / 2 + 20 + PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -adderHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "C",
        },
      ],
    };
  }

  // Повний суматор (Full Adder): 3 входи (A, B, Cin), 2 виходи (Sum, Cout)
  if (type === "FULL_ADDER") {
    const adderHeight = 20 + 3 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: adderHeight,
      inputCount: 3,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "A",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "B",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + PORT_SPACING * 2,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + PORT_SPACING * 2,
          value: 0,
          inverted: false,
          connected: false,
          label: "Cin",
        },
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -adderHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -adderHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "S",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: -adderHeight / 2 + 20 + PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -adderHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "Cout",
        },
      ],
    };
  }

  // 4-бітний суматор: A0-A3, B0-B3, Cin → S0-S3, Cout
  if (type === "ADDER_4BIT") {
    const adderHeight = 20 + 9 * PORT_SPACING; // 9 входів, 5 виходів
    return {
      id,
      type,
      x,
      y,
      width,
      height: adderHeight,
      inputCount: 9,
      inputs: [
        // Перша група: A0-A3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // Друга група: B0-B3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i + 4}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `B${i}`,
        })),
        // Cin
        {
          id: `${id}-input-8`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + 8 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + 8 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "Cin",
        },
      ],
      outputs: [
        // S0-S3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-output-${i}`,
          localX: width / 2,
          localY: -adderHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -adderHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: `S${i}`,
        })),
        // Cout
        {
          id: `${id}-output-4`,
          localX: width / 2,
          localY: -adderHeight / 2 + 20 + 4 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -adderHeight / 2 + 20 + 4 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "Cout",
        },
      ],
    };
  }

  // 8-бітний суматор: A0-A7, B0-B7, Cin → S0-S7, Cout
  if (type === "ADDER_8BIT") {
    const adderHeight = 20 + 17 * PORT_SPACING; // 17 входів, 9 виходів
    return {
      id,
      type,
      x,
      y,
      width,
      height: adderHeight,
      inputCount: 17,
      inputs: [
        // Перша група: A0-A7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // Друга група: B0-B7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i + 8}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `B${i}`,
        })),
        // Cin
        {
          id: `${id}-input-16`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -adderHeight / 2 + 20 + 16 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -adderHeight / 2 + 20 + 16 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "Cin",
        },
      ],
      outputs: [
        // S0-S7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-output-${i}`,
          localX: width / 2,
          localY: -adderHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -adderHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: `S${i}`,
        })),
        // Cout
        {
          id: `${id}-output-8`,
          localX: width / 2,
          localY: -adderHeight / 2 + 20 + 8 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -adderHeight / 2 + 20 + 8 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "Cout",
        },
      ],
    };
  }

  return null;
};
