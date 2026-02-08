const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20;

export const createEncoder = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // Encoder 4:2
  if (type === "ENCODER_4_2") {
    const encHeight = 20 + 4 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: encHeight,
      inputCount: 4,
      inputs: Array.from({ length: 4 }, (_, i) => ({
        id: `${id}-input-${i}`,
        localX: -width / 2 - WIRE_LENGTH,
        localY: -encHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: -width / 2,
        wireEndY: -encHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        inverted: false,
        connected: false,
        label: `I${i}`,
      })),
      outputs: Array.from({ length: 2 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -encHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -encHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `O${i}`,
      })),
    };
  }

  // Encoder 8:3
  if (type === "ENCODER_8_3") {
    const encHeight = 20 + 8 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: encHeight,
      inputCount: 8,
      inputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-input-${i}`,
        localX: -width / 2 - WIRE_LENGTH,
        localY: -encHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: -width / 2,
        wireEndY: -encHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        inverted: false,
        connected: false,
        label: `I${i}`,
      })),
      outputs: Array.from({ length: 3 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -encHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -encHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `O${i}`,
      })),
    };
  }

  // Encoder 16:4
  if (type === "ENCODER_16_4") {
    const encHeight = 20 + 16 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: encHeight,
      inputCount: 16,
      inputs: Array.from({ length: 16 }, (_, i) => ({
        id: `${id}-input-${i}`,
        localX: -width / 2 - WIRE_LENGTH,
        localY: -encHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: -width / 2,
        wireEndY: -encHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        inverted: false,
        connected: false,
        label: `I${i}`,
      })),
      outputs: Array.from({ length: 4 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -encHeight / 2 + 20 + i * PORT_SPACING,
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -encHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `O${i}`,
      })),
    };
  }

  return null;
};
