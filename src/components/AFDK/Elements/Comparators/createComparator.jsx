const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20;

export const createComparator = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // 1-бітний компаратор: A, B → GT, EQ, LT
  if (type === "COMPARATOR_1BIT") {
    const cmpHeight = 20 + 3 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: cmpHeight,
      inputCount: 2,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -cmpHeight / 2 + 20,
          wireEndX: -width / 2,
          wireEndY: -cmpHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "A",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -cmpHeight / 2 + 20 + PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -cmpHeight / 2 + 20 + PORT_SPACING,
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
          localY: -cmpHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "GT",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: -cmpHeight / 2 + 20 + PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "EQ",
        },
        {
          id: `${id}-output-2`,
          localX: width / 2,
          localY: -cmpHeight / 2 + 20 + 2 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20 + 2 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "LT",
        },
      ],
    };
  }

  // 4-бітний компаратор: A0-A3, B0-B3 → GT, EQ, LT
  if (type === "COMPARATOR_4BIT") {
    const cmpHeight = 20 + 8 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: cmpHeight,
      inputCount: 8,
      inputs: [
        // A0-A3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -cmpHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -cmpHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // B0-B3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i + 4}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -cmpHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -cmpHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `B${i}`,
        })),
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -cmpHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "GT",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: -cmpHeight / 2 + 20 + PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "EQ",
        },
        {
          id: `${id}-output-2`,
          localX: width / 2,
          localY: -cmpHeight / 2 + 20 + 2 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20 + 2 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "LT",
        },
      ],
    };
  }

  // 8-бітний компаратор: A0-A7, B0-B7 → GT, EQ, LT
  if (type === "COMPARATOR_8BIT") {
    const cmpHeight = 20 + 16 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: cmpHeight,
      inputCount: 16,
      inputs: [
        // A0-A7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -cmpHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -cmpHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // B0-B7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i + 8}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -cmpHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -cmpHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `B${i}`,
        })),
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -cmpHeight / 2 + 20,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "GT",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: -cmpHeight / 2 + 20 + PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "EQ",
        },
        {
          id: `${id}-output-2`,
          localX: width / 2,
          localY: -cmpHeight / 2 + 20 + 2 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -cmpHeight / 2 + 20 + 2 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "LT",
        },
      ],
    };
  }

  return null;
};
