export const MUX8Config = {
  type: "MUX8",
  label: "MUX 8:1",
  width: 140,
  height: 200,
  inputs: [
    { id: "I0", label: "I0", localX: -70, localY: -85, invertible: true },
    { id: "I1", label: "I1", localX: -70, localY: -60, invertible: true },
    { id: "I2", label: "I2", localX: -70, localY: -35, invertible: true },
    { id: "I3", label: "I3", localX: -70, localY: -10, invertible: true },
    { id: "I4", label: "I4", localX: -70, localY: 15, invertible: true },
    { id: "I5", label: "I5", localX: -70, localY: 40, invertible: true },
    { id: "I6", label: "I6", localX: -70, localY: 65, invertible: true },
    { id: "I7", label: "I7", localX: -70, localY: 90, invertible: true },
    { id: "S0", label: "S0", localX: -30, localY: 110, invertible: true },
    { id: "S1", label: "S1", localX: 0, localY: 110, invertible: true },
    { id: "S2", label: "S2", localX: 30, localY: 110, invertible: true },
  ],
  outputs: [{ id: "Y", label: "Y", localX: 70, localY: 0, invertible: false }],
  logic: (inputs) => {
    const i0 = inputs.I0 !== undefined ? inputs.I0 : 0;
    const i1 = inputs.I1 !== undefined ? inputs.I1 : 0;
    const i2 = inputs.I2 !== undefined ? inputs.I2 : 0;
    const i3 = inputs.I3 !== undefined ? inputs.I3 : 0;
    const i4 = inputs.I4 !== undefined ? inputs.I4 : 0;
    const i5 = inputs.I5 !== undefined ? inputs.I5 : 0;
    const i6 = inputs.I6 !== undefined ? inputs.I6 : 0;
    const i7 = inputs.I7 !== undefined ? inputs.I7 : 0;
    const s0 = inputs.S0 !== undefined ? inputs.S0 : 0;
    const s1 = inputs.S1 !== undefined ? inputs.S1 : 0;
    const s2 = inputs.S2 !== undefined ? inputs.S2 : 0;

    // Обчислюємо індекс селектора (0-7)
    // s2 - старший біт, s0 - молодший біт
    const selector = (s2 << 2) | (s1 << 1) | s0; // s2*4 + s1*2 + s0

    // Вибираємо відповідний вхід
    const dataInputs = [i0, i1, i2, i3, i4, i5, i6, i7];
    const output =
      dataInputs[selector] !== undefined ? dataInputs[selector] : 0;

    return { Y: output };
  },
  color: "#9C27B0", // Фіолетовий для MUX
};
