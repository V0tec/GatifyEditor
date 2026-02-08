const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20;

export const createRAM = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // RAM 16x4 (16 адрес × 4 біти)
  if (type === "RAM_16x4") {
    const ramHeight = 20 + 10 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: ramHeight,
      inputCount: 10,
      inputs: [
        // Address A0-A3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // Data D0-D3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i + 4}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `D${i}`,
        })),
        // WE (Write Enable)
        {
          id: `${id}-input-8`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 8 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 8 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "WE",
        },
        // CLK
        {
          id: `${id}-input-9`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 9 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 9 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
      ],
      outputs: Array.from({ length: 4 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -ramHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -ramHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        memory: new Array(16).fill(0),
        prevCLK: 0,
        Q0: 0,
        Q1: 0,
        Q2: 0,
        Q3: 0,
      },
    };
  }

  // RAM 16x8 (16 адрес × 8 біт)
  if (type === "RAM_16x8") {
    const ramHeight = 20 + 14 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: ramHeight,
      inputCount: 14,
      inputs: [
        // Address A0-A3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // Data D0-D7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i + 4}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `D${i}`,
        })),
        // WE
        {
          id: `${id}-input-12`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 12 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 12 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "WE",
        },
        // CLK
        {
          id: `${id}-input-13`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 13 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 13 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -ramHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -ramHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        memory: new Array(16).fill(0),
        prevCLK: 0,
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

  // RAM 256x8 (256 адрес × 8 біт)
  if (type === "RAM_256x8") {
    const ramHeight = 20 + 18 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: ramHeight,
      inputCount: 18,
      inputs: [
        // Address A0-A7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // Data D0-D7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i + 8}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `D${i}`,
        })),
        // WE
        {
          id: `${id}-input-16`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 16 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 16 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "WE",
        },
        // CLK
        {
          id: `${id}-input-17`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 17 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 17 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -ramHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -ramHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        memory: new Array(256).fill(0),
        prevCLK: 0,
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

  // RAM 256x8 з Chip Select (для каскадування!)
  if (type === "RAM_256x8_CS") {
    const ramHeight = 20 + 19 * PORT_SPACING; // +1 для CS
    return {
      id,
      type,
      x,
      y,
      width,
      height: ramHeight,
      inputCount: 19,
      inputs: [
        // Address A0-A7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // Data D0-D7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i + 8}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `D${i}`,
        })),
        // WE
        {
          id: `${id}-input-16`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 16 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 16 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "WE",
        },
        // CLK
        {
          id: `${id}-input-17`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 17 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 17 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "CLK",
        },
        // CS (Chip Select) - НОВИЙ!
        {
          id: `${id}-input-18`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -ramHeight / 2 + 20 + 18 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -ramHeight / 2 + 20 + 18 * PORT_SPACING,
          value: 1, // Default = 1 (активна)
          inverted: false,
          connected: false,
          label: "CS",
        },
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -ramHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -ramHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Q${i}`,
      })),
      state: {
        memory: new Array(256).fill(0),
        prevCLK: 0,
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
