export const MUX4Config = {
  type: "MUX4",
  label: "MUX 4:1",
  width: 120,
  height: 120,
  inputs: [
    { id: "I0", label: "I0", localX: -60, localY: -45, invertible: true },
    { id: "I1", label: "I1", localX: -60, localY: -15, invertible: true },
    { id: "I2", label: "I2", localX: -60, localY: 15, invertible: true },
    { id: "I3", label: "I3", localX: -60, localY: 45, invertible: true },
    { id: "S0", label: "S0", localX: -20, localY: 70, invertible: true },
    { id: "S1", label: "S1", localX: 20, localY: 70, invertible: true },
  ],
  outputs: [{ id: "Y", label: "Y", localX: 60, localY: 0, invertible: false }],
  logic: (inputs) => {
    const i0 = inputs.I0 !== undefined ? inputs.I0 : 0;
    const i1 = inputs.I1 !== undefined ? inputs.I1 : 0;
    const i2 = inputs.I2 !== undefined ? inputs.I2 : 0;
    const i3 = inputs.I3 !== undefined ? inputs.I3 : 0;
    const s0 = inputs.S0 !== undefined ? inputs.S0 : 0;
    const s1 = inputs.S1 !== undefined ? inputs.S1 : 0;

    // Обчислюємо індекс селектора (0-3)
    // s1 - старший біт, s0 - молодший біт
    const selector = (s1 << 1) | s0; // s1*2 + s0

    // Вибираємо відповідний вхід
    let output = 0;
    switch (selector) {
      case 0:
        output = i0;
        break;
      case 1:
        output = i1;
        break;
      case 2:
        output = i2;
        break;
      case 3:
        output = i3;
        break;
      default:
        output = 0;
    }

    return { Y: output };
  },
  color: "#9C27B0", // Фіолетовий для MUX
};
