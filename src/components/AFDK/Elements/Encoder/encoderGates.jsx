export const ENCODER_GATES = {
  // Encoder 4:2 (4 входи → 2 біти)
  ENCODER_4_2: {
    label: "ENC 4:2",
    color: "#fff9c4",
    logic: (inputs) => {
      // Входи: I0-I3 (тільки ОДИН має бути активний!)
      const I = [
        inputs[0] ?? 0,
        inputs[1] ?? 0,
        inputs[2] ?? 0,
        inputs[3] ?? 0,
      ];

      // Priority Encoder: якщо кілька активних - вибираємо найстарший
      let output = 0;
      for (let i = 3; i >= 0; i--) {
        if (I[i] === 1) {
          output = i;
          break;
        }
      }

      // Виходи: O0, O1 (двійковий код)
      const O0 = (output >> 0) & 1;
      const O1 = (output >> 1) & 1;

      return [O0, O1];
    },
  },

  // Encoder 8:3 (8 входів → 3 біти)
  ENCODER_8_3: {
    label: "ENC 8:3",
    color: "#fff9c4",
    logic: (inputs) => {
      // Входи: I0-I7
      const I = [];
      for (let i = 0; i < 8; i++) {
        I.push(inputs[i] ?? 0);
      }

      // Priority Encoder
      let output = 0;
      for (let i = 7; i >= 0; i--) {
        if (I[i] === 1) {
          output = i;
          break;
        }
      }

      // Виходи: O0, O1, O2
      const O0 = (output >> 0) & 1;
      const O1 = (output >> 1) & 1;
      const O2 = (output >> 2) & 1;

      return [O0, O1, O2];
    },
  },

  // Encoder 16:4 (16 входів → 4 біти)
  ENCODER_16_4: {
    label: "ENC 16:4",
    color: "#fff9c4",
    logic: (inputs) => {
      // Входи: I0-I15
      const I = [];
      for (let i = 0; i < 16; i++) {
        I.push(inputs[i] ?? 0);
      }

      // Priority Encoder
      let output = 0;
      for (let i = 15; i >= 0; i--) {
        if (I[i] === 1) {
          output = i;
          break;
        }
      }

      // Виходи: O0-O3
      const O0 = (output >> 0) & 1;
      const O1 = (output >> 1) & 1;
      const O2 = (output >> 2) & 1;
      const O3 = (output >> 3) & 1;

      return [O0, O1, O2, O3];
    },
  },
};
