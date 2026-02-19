export const DEMULTIPLEXER_GATES = {
  DEMUX2: {
    label: "DEMUX 1:2",
    color: "#673AB7",
    logic: (inputs) => {
      const D = inputs[0] ?? 0; // Вхідні дані
      const S = inputs[1] ?? 0; // Селектор

      // S=0 → вихід Y0 = D, Y1 = 0
      // S=1 → вихід Y0 = 0, Y1 = D
      if (S === 0) {
        return [D, 0]; // [Y0, Y1]
      } else {
        return [0, D];
      }
    },
  },

  DEMUX4: {
    label: "DEMUX 1:4",
    color: "#673AB7",
    logic: (inputs) => {
      const D = inputs[0] ?? 0; // Вхідні дані
      const S0 = inputs[1] ?? 0; // Селектор біт 0
      const S1 = inputs[2] ?? 0; // Селектор біт 1

      // S1 S0 | Активний вихід
      //  0  0  | Y0
      //  0  1  | Y1
      //  1  0  | Y2
      //  1  1  | Y3
      const selector = S1 * 2 + S0;

      const outputs = [0, 0, 0, 0];
      outputs[selector] = D;

      return outputs; // [Y0, Y1, Y2, Y3]
    },
  },

  DEMUX8: {
    label: "DEMUX 1:8",
    color: "#673AB7",
    logic: (inputs) => {
      const D = inputs[0] ?? 0; // Вхідні дані
      const S0 = inputs[1] ?? 0; // Селектор біт 0
      const S1 = inputs[2] ?? 0; // Селектор біт 1
      const S2 = inputs[3] ?? 0; // Селектор біт 2

      // S2 S1 S0 | Активний вихід
      //  0  0  0  | Y0
      //  0  0  1  | Y1
      //  ...
      //  1  1  1  | Y7
      const selector = S2 * 4 + S1 * 2 + S0;

      const outputs = [0, 0, 0, 0, 0, 0, 0, 0];
      outputs[selector] = D;

      return outputs; // [Y0, Y1, Y2, Y3, Y4, Y5, Y6, Y7]
    },
  },
};
