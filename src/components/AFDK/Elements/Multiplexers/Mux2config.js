export const MUX2Config = {
  type: "MUX2",
  label: "MUX 2:1",
  width: 100,
  height: 80,
  inputs: [
    { id: "I0", label: "I0", localX: -50, localY: -20, invertible: true },
    { id: "I1", label: "I1", localX: -50, localY: 20, invertible: true },
    { id: "S", label: "S", localX: 0, localY: 50, invertible: true },
  ],
  outputs: [{ id: "Y", label: "Y", localX: 50, localY: 0, invertible: false }],
  logic: (inputs) => {
    const i0 = inputs.I0 !== undefined ? inputs.I0 : 0;
    const i1 = inputs.I1 !== undefined ? inputs.I1 : 0;
    const s = inputs.S !== undefined ? inputs.S : 0;

    // Якщо S=0 → вибираємо I0, якщо S=1 → вибираємо I1
    const output = s === 0 ? i0 : i1;

    return { Y: output };
  },
  color: "#9C27B0", // Фіолетовий для MUX
};
