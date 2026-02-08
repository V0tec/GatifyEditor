const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20;

export const createALU = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // 4-бітний ALU
  if (type === "ALU_4BIT") {
    const aluHeight = 20 + 12 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: aluHeight,
      inputCount: 12,
      inputs: [
        // A0-A3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -aluHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -aluHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // B0-B3
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-input-${i + 4}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -aluHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -aluHeight / 2 + 20 + (i + 4) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `B${i}`,
        })),
        // OP0-OP2 (операція)
        ...Array.from({ length: 3 }, (_, i) => ({
          id: `${id}-input-${i + 8}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -aluHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -aluHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `OP${i}`,
        })),
        // Cin
        {
          id: `${id}-input-11`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -aluHeight / 2 + 20 + 11 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -aluHeight / 2 + 20 + 11 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "Cin",
        },
      ],
      outputs: [
        // R0-R3 (результат)
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `${id}-output-${i}`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: `R${i}`,
        })),
        // Прапорці
        {
          id: `${id}-output-4`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + 4 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + 4 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "C",
        },
        {
          id: `${id}-output-5`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + 5 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + 5 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "Z",
        },
        {
          id: `${id}-output-6`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + 6 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + 6 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "N",
        },
        {
          id: `${id}-output-7`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + 7 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + 7 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "V",
        },
      ],
    };
  }

  // 8-бітний ALU
  if (type === "ALU_8BIT") {
    const aluHeight = 20 + 20 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: aluHeight,
      inputCount: 20,
      inputs: [
        // A0-A7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -aluHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -aluHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `A${i}`,
        })),
        // B0-B7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-input-${i + 8}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -aluHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -aluHeight / 2 + 20 + (i + 8) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `B${i}`,
        })),
        // OP0-OP2
        ...Array.from({ length: 3 }, (_, i) => ({
          id: `${id}-input-${i + 16}`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -aluHeight / 2 + 20 + (i + 16) * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -aluHeight / 2 + 20 + (i + 16) * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: `OP${i}`,
        })),
        // Cin
        {
          id: `${id}-input-19`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -aluHeight / 2 + 20 + 19 * PORT_SPACING,
          wireEndX: -width / 2,
          wireEndY: -aluHeight / 2 + 20 + 19 * PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "Cin",
        },
      ],
      outputs: [
        // R0-R7
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `${id}-output-${i}`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + i * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + i * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: `R${i}`,
        })),
        // Прапорці
        {
          id: `${id}-output-8`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + 8 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + 8 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "C",
        },
        {
          id: `${id}-output-9`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + 9 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + 9 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "Z",
        },
        {
          id: `${id}-output-10`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + 10 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + 10 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "N",
        },
        {
          id: `${id}-output-11`,
          localX: width / 2,
          localY: -aluHeight / 2 + 20 + 11 * PORT_SPACING,
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -aluHeight / 2 + 20 + 11 * PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "V",
        },
      ],
    };
  }

  return null;
};
