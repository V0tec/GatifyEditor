const PORT_SPACING = 20;
const EDGE_PADDING = 20;
const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;

export const createLogicGate = (id, type, inputCount, x, y) => {
  const width = ELEMENT_WIDTH;

  // NOT завжди 1 вхід
  const actualInputCount = type === "NOT" ? 1 : inputCount;
  const actualOutputCount = 1;

  const height =
    EDGE_PADDING * 2 +
    (Math.max(actualInputCount, actualOutputCount) - 1) * PORT_SPACING;

  const inputs = [];
  for (let i = 0; i < actualInputCount; i++) {
    const localY = EDGE_PADDING + i * PORT_SPACING - height / 2;

    inputs.push({
      id: `${id}-input-${i}`,
      localX: -width / 2 - WIRE_LENGTH,
      localY: localY,
      wireEndX: -width / 2,
      wireEndY: localY,
      value: 0,
      inverted: false,
      connected: false,
    });
  }

  const outputs = [];
  for (let i = 0; i < actualOutputCount; i++) {
    const localY = EDGE_PADDING + i * PORT_SPACING - height / 2;

    outputs.push({
      id: `${id}-output-${i}`,
      localX: width / 2,
      localY: localY,
      wireEndX: width / 2 + WIRE_LENGTH,
      wireEndY: localY,
      value: 0,
      connected: false,
      inverted: false,
    });
  }

  return {
    id,
    type,
    x,
    y,
    width,
    height,
    inputCount: actualInputCount,
    inputs,
    outputs,
  };
};
