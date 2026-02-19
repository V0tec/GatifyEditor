export const MULTIPLEXER_GATES = {
  MUX2: {
    label: "MUX 2:1",
    color: "#9C27B0",
    logic: (inputs) => {
      const I0 = inputs[0] ?? 0;
      const I1 = inputs[1] ?? 0;
      const S = inputs[2] ?? 0;

      // S=0 → вибираємо I0
      // S=1 → вибираємо I1
      return S === 0 ? I0 : I1;
    },
  },

  MUX4: {
    label: "MUX 4:1",
    color: "#9C27B0",
    logic: (inputs) => {
      const I0 = inputs[0] ?? 0;
      const I1 = inputs[1] ?? 0;
      const I2 = inputs[2] ?? 0;
      const I3 = inputs[3] ?? 0;
      const S0 = inputs[4] ?? 0;
      const S1 = inputs[5] ?? 0;

      // S1 S0 | Вибір
      //  0  0  | I0
      //  0  1  | I1
      //  1  0  | I2
      //  1  1  | I3
      const selector = S1 * 2 + S0; // 0, 1, 2, або 3

      if (selector === 0) return I0;
      if (selector === 1) return I1;
      if (selector === 2) return I2;
      if (selector === 3) return I3;

      return 0;
    },
  },

  MUX8: {
    label: "MUX 8:1",
    color: "#9C27B0",
    logic: (inputs) => {
      const I0 = inputs[0] ?? 0;
      const I1 = inputs[1] ?? 0;
      const I2 = inputs[2] ?? 0;
      const I3 = inputs[3] ?? 0;
      const I4 = inputs[4] ?? 0;
      const I5 = inputs[5] ?? 0;
      const I6 = inputs[6] ?? 0;
      const I7 = inputs[7] ?? 0;
      const S0 = inputs[8] ?? 0;
      const S1 = inputs[9] ?? 0;
      const S2 = inputs[10] ?? 0;

      // S2 S1 S0 | Вибір
      //  0  0  0  | I0
      //  0  0  1  | I1
      //  0  1  0  | I2
      //  0  1  1  | I3
      //  1  0  0  | I4
      //  1  0  1  | I5
      //  1  1  0  | I6
      //  1  1  1  | I7
      const selector = S2 * 4 + S1 * 2 + S0; // 0-7

      const dataInputs = [I0, I1, I2, I3, I4, I5, I6, I7];
      return dataInputs[selector] ?? 0;
    },
  },
};
