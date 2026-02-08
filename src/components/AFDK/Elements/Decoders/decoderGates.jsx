export const DECODER_GATES = {
  // Дешифратор 2:4 (2 входи, 4 виходи)
  DECODER2: {
    label: "DEC 2:4",
    color: "#e1f5fe",
    logic: (inputs) => {
      const A0 = inputs[0] ?? 0;
      const A1 = inputs[1] ?? 0;

      // Обчислюємо вхідний код
      const code = (A1 << 1) | A0;

      // Виходи: тільки один вихід = 1, решта = 0
      const outputs = [0, 0, 0, 0];
      outputs[code] = 1;

      return outputs;
    },
  },

  // Дешифратор 3:8 (3 входи, 8 виходів)
  DECODER3: {
    label: "DEC 3:8",
    color: "#e1f5fe",
    logic: (inputs) => {
      const A0 = inputs[0] ?? 0;
      const A1 = inputs[1] ?? 0;
      const A2 = inputs[2] ?? 0;

      // Обчислюємо вхідний код
      const code = (A2 << 2) | (A1 << 1) | A0;

      // Виходи: тільки один вихід = 1, решта = 0
      const outputs = [0, 0, 0, 0, 0, 0, 0, 0];
      outputs[code] = 1;

      return outputs;
    },
  },

  // Дешифратор 4:16 (4 входи, 16 виходів)
  DECODER4: {
    label: "DEC 4:16",
    color: "#e1f5fe",
    logic: (inputs) => {
      const A0 = inputs[0] ?? 0;
      const A1 = inputs[1] ?? 0;
      const A2 = inputs[2] ?? 0;
      const A3 = inputs[3] ?? 0;

      // Обчислюємо вхідний код
      const code = (A3 << 3) | (A2 << 2) | (A1 << 1) | A0;

      // Виходи: тільки один вихід = 1, решта = 0
      const outputs = Array(16).fill(0);
      outputs[code] = 1;

      return outputs;
    },
  },
};
