export const DEMUX4Config = {
  type: "DEMUX4",
  label: "DEMUX 1:4",
  width: 120,
  height: 120,
  inputs: [
    { id: "I", label: "I", localX: -60, localY: 0, invertible: true },
    { id: "S0", label: "S0", localX: -20, localY: 70, invertible: true },
    { id: "S1", label: "S1", localX: 20, localY: 70, invertible: true },
  ],
  outputs: [
    { id: "Y0", label: "Y0", localX: 60, localY: -45, invertible: false },
    { id: "Y1", label: "Y1", localX: 60, localY: -15, invertible: false },
    { id: "Y2", label: "Y2", localX: 60, localY: 15, invertible: false },
    { id: "Y3", label: "Y3", localX: 60, localY: 45, invertible: false },
  ],
  logic: (inputs) => {
    const i = inputs.I !== undefined ? inputs.I : 0;
    const s0 = inputs.S0 !== undefined ? inputs.S0 : 0;
    const s1 = inputs.S1 !== undefined ? inputs.S1 : 0;

    // Обчислюємо індекс селектора (0-3)
    const selector = (s1 << 1) | s0; // s1*2 + s0

    // Передаємо вхід на відповідний вихід
    const y0 = selector === 0 ? i : 0;
    const y1 = selector === 1 ? i : 0;
    const y2 = selector === 2 ? i : 0;
    const y3 = selector === 3 ? i : 0;

    return { Y0: y0, Y1: y1, Y2: y2, Y3: y3 };
  },
  color: "#673AB7", // Темно-фіолетовий для DEMUX
};
