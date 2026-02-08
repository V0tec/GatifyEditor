export const DEMUX2Config = {
  type: "DEMUX2",
  label: "DEMUX 1:2",
  width: 100,
  height: 80,
  inputs: [
    { id: "I", label: "I", localX: -50, localY: 0, invertible: true },
    { id: "S", label: "S", localX: 0, localY: 50, invertible: true },
  ],
  outputs: [
    { id: "Y0", label: "Y0", localX: 50, localY: -20, invertible: false },
    { id: "Y1", label: "Y1", localX: 50, localY: 20, invertible: false },
  ],
  logic: (inputs) => {
    const i = inputs.I !== undefined ? inputs.I : 0;
    const s = inputs.S !== undefined ? inputs.S : 0;

    // Якщо S=0 → передаємо на Y0, інакше на Y1
    const y0 = s === 0 ? i : 0;
    const y1 = s === 1 ? i : 0;

    return { Y0: y0, Y1: y1 };
  },
  color: "#673AB7", // Темно-фіолетовий для DEMUX
};
