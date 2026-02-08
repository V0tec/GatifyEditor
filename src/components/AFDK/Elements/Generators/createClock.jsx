export const createClock = (id, x, y) => {
  const clockWidth = 100;
  const clockHeight = 60;

  return {
    id,
    type: "CLOCK",
    x,
    y,
    width: clockWidth,
    height: clockHeight,
    inputs: [],
    outputs: [
      {
        id: `${id}-output-0`,
        label: "CLK",
        value: 1,
        localX: clockWidth / 2,
        localY: -10,
        wireEndX: clockWidth / 2 + 20,
        wireEndY: -10,
        valueOffsetX: -35,
        inverted: false,
        connected: false,
      },
      {
        id: `${id}-output-1`,
        label: "CLK̅",
        value: 0,
        localX: clockWidth / 2,
        localY: 10,
        wireEndX: clockWidth / 2 + 20,
        wireEndY: 10,
        valueOffsetX: -35,
        inverted: true,
        connected: false,
      },
    ],
    state: { value: 1 },
  };
};
