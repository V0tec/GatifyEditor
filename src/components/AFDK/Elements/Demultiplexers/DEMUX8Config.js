export const DEMUX8Config = {
  type: "DEMUX8",
  label: "DEMUX 1:8",
  width: 140,
  height: 200,
  inputs: [
    { id: "I", label: "I", localX: -70, localY: 0, invertible: true },
    { id: "S0", label: "S0", localX: -30, localY: 110, invertible: true },
    { id: "S1", label: "S1", localX: 0, localY: 110, invertible: true },
    { id: "S2", label: "S2", localX: 30, localY: 110, invertible: true },
  ],
  outputs: [
    { id: "Y0", label: "Y0", localX: 70, localY: -85, invertible: false },
    { id: "Y1", label: "Y1", localX: 70, localY: -60, invertible: false },
    { id: "Y2", label: "Y2", localX: 70, localY: -35, invertible: false },
    { id: "Y3", label: "Y3", localX: 70, localY: -10, invertible: false },
    { id: "Y4", label: "Y4", localX: 70, localY: 15, invertible: false },
    { id: "Y5", label: "Y5", localX: 70, localY: 40, invertible: false },
    { id: "Y6", label: "Y6", localX: 70, localY: 65, invertible: false },
    { id: "Y7", label: "Y7", localX: 70, localY: 90, invertible: false },
  ],
  logic: (inputs) => {
    const i = inputs.I !== undefined ? inputs.I : 0;
    const s0 = inputs.S0 !== undefined ? inputs.S0 : 0;
    const s1 = inputs.S1 !== undefined ? inputs.S1 : 0;
    const s2 = inputs.S2 !== undefined ? inputs.S2 : 0;

    // Обчислюємо індекс селектора (0-7)
    const selector = (s2 << 2) | (s1 << 1) | s0; // s2*4 + s1*2 + s0

    // Передаємо вхід на відповідний вихід
    const outputs = { Y0: 0, Y1: 0, Y2: 0, Y3: 0, Y4: 0, Y5: 0, Y6: 0, Y7: 0 };

    // Активуємо тільки обраний вихід
    outputs[`Y${selector}`] = i;

    return outputs;
  },
  color: "#673AB7", // Темно-фіолетовий для DEMUX
};
