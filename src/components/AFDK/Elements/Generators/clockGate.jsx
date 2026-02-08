export const CLOCK_GATE = {
  CLOCK: {
    label: "CLK",
    color: "#9C27B0",
    logic: (inputs, state) => {
      return state?.value ?? 0;
    },
    inputs: [],
    outputs: 2,
    width: 100,
    height: 80,
    description: "Генератор тактових імпульсів",
  },
};
