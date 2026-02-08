const ELEMENT_WIDTH = 140;
const WIRE_LENGTH = 20;
const PORT_SPACING = 20; // 20px відступ від краю + 20px між портами

export const createDecoder = (id, type, x, y) => {
  const width = ELEMENT_WIDTH;

  // Дешифратор 2:4 (2 входи адреси, 4 виходи)
  if (type === "DECODER2") {
    // Висота = 20px (верхній відступ) + 4 порти * 40px = 180px
    const decoderHeight = 20 + 4 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: decoderHeight,
      inputCount: 2,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20, // Перший вхід - 20px від верху
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "A0",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING, // Другий вхід - +40px
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "A1",
        },
      ],
      outputs: [
        {
          id: `${id}-output-0`,
          localX: width / 2,
          localY: -decoderHeight / 2 + 20, // Y0 - 20px від верху
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -decoderHeight / 2 + 20,
          value: 0,
          connected: false,
          inverted: false,
          label: "Y0",
        },
        {
          id: `${id}-output-1`,
          localX: width / 2,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING, // Y1 - +40px
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          connected: false,
          inverted: false,
          label: "Y1",
        },
        {
          id: `${id}-output-2`,
          localX: width / 2,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING * 2, // Y2 - +80px
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING * 2,
          value: 0,
          connected: false,
          inverted: false,
          label: "Y2",
        },
        {
          id: `${id}-output-3`,
          localX: width / 2,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING * 3, // Y3 - +120px
          wireEndX: width / 2 + WIRE_LENGTH,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING * 3,
          value: 0,
          connected: false,
          inverted: false,
          label: "Y3",
        },
      ],
    };
  }

  // Дешифратор 3:8 (3 входи адреси, 8 виходів)
  if (type === "DECODER3") {
    // Висота = 20px (верхній відступ) + 8 портів * 40px = 340px
    const decoderHeight = 20 + 8 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: decoderHeight,
      inputCount: 3,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20, // A0 - 20px від верху
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "A0",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING, // A1 - +40px
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "A1",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING * 2, // A2 - +80px
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING * 2,
          value: 0,
          inverted: false,
          connected: false,
          label: "A2",
        },
      ],
      outputs: Array.from({ length: 8 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -decoderHeight / 2 + 20 + i * PORT_SPACING, // Кожні 40px
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -decoderHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Y${i}`,
      })),
    };
  }

  // Дешифратор 4:16 (4 входи адреси, 16 виходів)
  if (type === "DECODER4") {
    // Висота = 20px (верхній відступ) + 16 портів * 40px = 660px
    const decoderHeight = 20 + 16 * PORT_SPACING;
    return {
      id,
      type,
      x,
      y,
      width,
      height: decoderHeight,
      inputCount: 4,
      inputs: [
        {
          id: `${id}-input-0`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20, // A0 - 20px від верху
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20,
          value: 0,
          inverted: false,
          connected: false,
          label: "A0",
        },
        {
          id: `${id}-input-1`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING, // A1 - +40px
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING,
          value: 0,
          inverted: false,
          connected: false,
          label: "A1",
        },
        {
          id: `${id}-input-2`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING * 2, // A2 - +80px
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING * 2,
          value: 0,
          inverted: false,
          connected: false,
          label: "A2",
        },
        {
          id: `${id}-input-3`,
          localX: -width / 2 - WIRE_LENGTH,
          localY: -decoderHeight / 2 + 20 + PORT_SPACING * 3, // A3 - +120px
          wireEndX: -width / 2,
          wireEndY: -decoderHeight / 2 + 20 + PORT_SPACING * 3,
          value: 0,
          inverted: false,
          connected: false,
          label: "A3",
        },
      ],
      outputs: Array.from({ length: 16 }, (_, i) => ({
        id: `${id}-output-${i}`,
        localX: width / 2,
        localY: -decoderHeight / 2 + 20 + i * PORT_SPACING, // Кожні 40px
        wireEndX: width / 2 + WIRE_LENGTH,
        wireEndY: -decoderHeight / 2 + 20 + i * PORT_SPACING,
        value: 0,
        connected: false,
        inverted: false,
        label: `Y${i}`,
      })),
    };
  }

  return null;
};
