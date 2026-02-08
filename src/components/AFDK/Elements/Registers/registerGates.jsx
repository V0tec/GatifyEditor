export const REGISTER_GATES = {
  // 4-бітний регістр
  REGISTER_4BIT: {
    label: "REG 4-bit",
    color: "#e8eaf6",
    logic: (inputs, previousState) => {
      // Входи: D0-D3, Clock, Enable
      const D0 = inputs[0] ?? 0;
      const D1 = inputs[1] ?? 0;
      const D2 = inputs[2] ?? 0;
      const D3 = inputs[3] ?? 0;
      const CLK = inputs[4] ?? 0;
      const EN = inputs[5] ?? 0; // Enable - дозволяє запис

      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      // Якщо rising edge і Enable = 1, зберігаємо нові дані
      if (isRisingEdge && EN === 1) {
        return {
          Q0: D0,
          Q1: D1,
          Q2: D2,
          Q3: D3,
          prevCLK: CLK,
        };
      }

      // Інакше - зберігаємо попередні дані
      return {
        Q0: previousState?.Q0 || 0,
        Q1: previousState?.Q1 || 0,
        Q2: previousState?.Q2 || 0,
        Q3: previousState?.Q3 || 0,
        prevCLK: CLK,
      };
    },
  },

  // 8-бітний регістр
  REGISTER_8BIT: {
    label: "REG 8-bit",
    color: "#e8eaf6",
    logic: (inputs, previousState) => {
      // Входи: D0-D7, Clock, Enable
      const data = [];
      for (let i = 0; i < 8; i++) {
        data.push(inputs[i] ?? 0);
      }
      const CLK = inputs[8] ?? 0;
      const EN = inputs[9] ?? 0;

      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      if (isRisingEdge && EN === 1) {
        return {
          Q0: data[0],
          Q1: data[1],
          Q2: data[2],
          Q3: data[3],
          Q4: data[4],
          Q5: data[5],
          Q6: data[6],
          Q7: data[7],
          prevCLK: CLK,
        };
      }

      return {
        Q0: previousState?.Q0 || 0,
        Q1: previousState?.Q1 || 0,
        Q2: previousState?.Q2 || 0,
        Q3: previousState?.Q3 || 0,
        Q4: previousState?.Q4 || 0,
        Q5: previousState?.Q5 || 0,
        Q6: previousState?.Q6 || 0,
        Q7: previousState?.Q7 || 0,
        prevCLK: CLK,
      };
    },
  },

  // Зсувний регістр (Shift Register) 4-bit
  SHIFT_REGISTER_4BIT: {
    label: "SHIFT 4-bit",
    color: "#e8eaf6",
    logic: (inputs, previousState) => {
      // Входи: Data_In, Clock, Shift_Enable
      const dataIn = inputs[0] ?? 0;
      const CLK = inputs[1] ?? 0;
      const shiftEn = inputs[2] ?? 0;

      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      if (isRisingEdge && shiftEn === 1) {
        // Зсув вправо: новий біт заходить зліва
        return {
          Q0: dataIn,
          Q1: previousState?.Q0 || 0,
          Q2: previousState?.Q1 || 0,
          Q3: previousState?.Q2 || 0,
          prevCLK: CLK,
        };
      }

      return {
        Q0: previousState?.Q0 || 0,
        Q1: previousState?.Q1 || 0,
        Q2: previousState?.Q2 || 0,
        Q3: previousState?.Q3 || 0,
        prevCLK: CLK,
      };
    },
  },

  // Зсувний регістр (Shift Register) 8-bit
  SHIFT_REGISTER_8BIT: {
    label: "SHIFT 8-bit",
    color: "#e8eaf6",
    logic: (inputs, previousState) => {
      const dataIn = inputs[0] ?? 0;
      const CLK = inputs[1] ?? 0;
      const shiftEn = inputs[2] ?? 0;

      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      if (isRisingEdge && shiftEn === 1) {
        return {
          Q0: dataIn,
          Q1: previousState?.Q0 || 0,
          Q2: previousState?.Q1 || 0,
          Q3: previousState?.Q2 || 0,
          Q4: previousState?.Q3 || 0,
          Q5: previousState?.Q4 || 0,
          Q6: previousState?.Q5 || 0,
          Q7: previousState?.Q6 || 0,
          prevCLK: CLK,
        };
      }

      return {
        Q0: previousState?.Q0 || 0,
        Q1: previousState?.Q1 || 0,
        Q2: previousState?.Q2 || 0,
        Q3: previousState?.Q3 || 0,
        Q4: previousState?.Q4 || 0,
        Q5: previousState?.Q5 || 0,
        Q6: previousState?.Q6 || 0,
        Q7: previousState?.Q7 || 0,
        prevCLK: CLK,
      };
    },
  },
};
