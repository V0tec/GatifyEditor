export const BASIC_GATES = {
  AND: {
    label: "AND",
    color: "#e8e8e8",
    logic: (inputs) => (inputs.every((v) => v === 1) ? 1 : 0),
  },
  OR: {
    label: "OR",
    color: "#ffe8cc",
    logic: (inputs) => (inputs.some((v) => v === 1) ? 1 : 0),
  },
  NOT: {
    label: "NOT",
    color: "#ffcccc",
    logic: (inputs) => (inputs[0] === 1 ? 0 : 1),
  },
  NAND: {
    label: "NAND",
    color: "#e8f5e9",
    logic: (inputs) => (inputs.every((v) => v === 1) ? 0 : 1),
  },
  NOR: {
    label: "NOR",
    color: "#f3e5f5",
    logic: (inputs) => (inputs.some((v) => v === 1) ? 0 : 1),
  },
  XOR: {
    label: "XOR",
    color: "#fffde7",
    logic: (inputs) => (inputs.filter((v) => v === 1).length % 2 === 1 ? 1 : 0),
  },
  XNOR: {
    label: "XNOR",
    color: "#e0f2f1",
    logic: (inputs) => (inputs.filter((v) => v === 1).length % 2 === 0 ? 1 : 0),
  },
};
