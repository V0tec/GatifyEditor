const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20;

export const createROM = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // ROM 16x4 (16 адрес × 4 біти)
  if (type === "ROM_16x4") {
    const romHeight = 20 + 4 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: romHeight,
      inputCount: 4,
      inputs: [
        // Address A0-A3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -romHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -romHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
      ],
      outputs: Array.from({ length: 4 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -romHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -romHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        memory: Array.from({ length: 16 }, (_, i) => i), // 0-15
        Q0: 0,
        Q1: 0,
        Q2: 0,
        Q3: 0,
      },
    };
  }

  // ROM 16x8 (16 адрес × 8 біт)
  if (type === "ROM_16x8") {
    const romHeight = 20 + 8 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: romHeight,
      inputCount: 4,
      inputs: [
        // Address A0-A3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -romHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -romHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -romHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -romHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        memory: Array.from({ length: 16 }, (_, i) => i * 2), // 0, 2, 4, 6...
        Q0: 0,
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        Q5: 0,
        Q6: 0,
        Q7: 0,
      },
    };
  }

  // ROM 256x8 (256 адрес × 8 біт)
  if (type === "ROM_256x8") {
    const romHeight = 20 + 8 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: romHeight,
      inputCount: 8,
      inputs: [
        // Address A0-A7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -romHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -romHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -romHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -romHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        memory: Array.from({ length: 256 }, (_, i) => i % 256),
        Q0: 0,
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        Q5: 0,
        Q6: 0,
        Q7: 0,
      },
    };
  }

  // ROM 256x8 з Chip Select (для каскадування!)
  if (type === "ROM_256x8_CS") {
    const romHeight = 20 + 9 * PORT_SPACING; // +1 для CS
    return {
      id,
      type,
      x,
      y,
      width,
      height: romHeight,
      inputCount: 9,
      inputs: [
        // Address A0-A7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -romHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -romHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // CS (Chip Select) - НОВИЙ!
        {
          id: `${id}-input-8`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -romHeight / 2 + 20 + 8 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -romHeight / 2 + 20 + 8 * PORT_SPACING,
          value: 1, // Default = 1 (активна)
          inverted: false,
          connected: false,
          label: "CS",
        },
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -romHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -romHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        memory: Array.from({ length: 256 }, (_, i) => i % 256),
        Q0: 0,
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        Q5: 0,
        Q6: 0,
        Q7: 0,
      },
    };
  }

  return null;
};
