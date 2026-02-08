export const COUNTER_GATES = {
  // 4-бітний лічильник (0-15)
  COUNTER_4BIT: {
    label: "CNT 4-bit",
    color: "#e1f5fe",
    logic: (inputs, previousState) => {
      // Входи: CLK, EN, RST, UP/DOWN
      const CLK = inputs[0] ?? 0;
      const EN = inputs[1] ?? 0;
      const RST = inputs[2] ?? 0;
      const UP = inputs[3] ?? 0; // 1 = вверх, 0 = вниз

      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      // Reset має найвищий пріоритет
      if (RST === 1) {
        return {
          count: 0,
          Q0: 0,
          Q1: 0,
          Q2: 0,
          Q3: 0,
          overflow: 0,
          prevCLK: CLK,
        };
      }

      // Якщо rising edge і Enable = 1
      if (isRisingEdge && EN === 1) {
        const currentCount = previousState?.count || 0;
        let newCount;

        if (UP === 1) {
          // Рахуємо вверх
          newCount = (currentCount + 1) & 0x0F; // Маска 4 біти
        } else {
          // Рахуємо вниз
          newCount = (currentCount - 1) & 0x0F;
        }

        // Визначаємо overflow (переповнення)
        const overflow =
          UP === 1
            ? currentCount === 15 && newCount === 0
              ? 1
              : 0
            : currentCount === 0 && newCount === 15
              ? 1
              : 0;

        return {
          count: newCount,
          Q0: (newCount >> 0) & 1,
          Q1: (newCount >> 1) & 1,
          Q2: (newCount >> 2) & 1,
          Q3: (newCount >> 3) & 1,
          overflow: overflow,
          prevCLK: CLK,
        };
      }

      // Зберігаємо попередній стан
      return {
        count: previousState?.count || 0,
        Q0: previousState?.Q0 || 0,
        Q1: previousState?.Q1 || 0,
        Q2: previousState?.Q2 || 0,
        Q3: previousState?.Q3 || 0,
        overflow: previousState?.overflow || 0,
        prevCLK: CLK,
      };
    },
  },

  // 8-бітний лічильник (0-255)
  COUNTER_8BIT: {
    label: "CNT 8-bit",
    color: "#e1f5fe",
    logic: (inputs, previousState) => {
      const CLK = inputs[0] ?? 0;
      const EN = inputs[1] ?? 0;
      const RST = inputs[2] ?? 0;
      const UP = inputs[3] ?? 0;

      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      if (RST === 1) {
        return {
          count: 0,
          Q0: 0,
          Q1: 0,
          Q2: 0,
          Q3: 0,
          Q4: 0,
          Q5: 0,
          Q6: 0,
          Q7: 0,
          overflow: 0,
          prevCLK: CLK,
        };
      }

      if (isRisingEdge && EN === 1) {
        const currentCount = previousState?.count || 0;
        let newCount;

        if (UP === 1) {
          newCount = (currentCount + 1) & 0xFF;
        } else {
          newCount = (currentCount - 1) & 0xFF;
        }

        const overflow =
          UP === 1
            ? currentCount === 255 && newCount === 0
              ? 1
              : 0
            : currentCount === 0 && newCount === 255
              ? 1
              : 0;

        return {
          count: newCount,
          Q0: (newCount >> 0) & 1,
          Q1: (newCount >> 1) & 1,
          Q2: (newCount >> 2) & 1,
          Q3: (newCount >> 3) & 1,
          Q4: (newCount >> 4) & 1,
          Q5: (newCount >> 5) & 1,
          Q6: (newCount >> 6) & 1,
          Q7: (newCount >> 7) & 1,
          overflow: overflow,
          prevCLK: CLK,
        };
      }

      return {
        count: previousState?.count || 0,
        Q0: previousState?.Q0 || 0,
        Q1: previousState?.Q1 || 0,
        Q2: previousState?.Q2 || 0,
        Q3: previousState?.Q3 || 0,
        Q4: previousState?.Q4 || 0,
        Q5: previousState?.Q5 || 0,
        Q6: previousState?.Q6 || 0,
        Q7: previousState?.Q7 || 0,
        overflow: previousState?.overflow || 0,
        prevCLK: CLK,
      };
    },
  },

  // Простий лічильник (тільки вверх, без DOWN)
  COUNTER_4BIT_UP: {
    label: "CNT 4-bit UP",
    color: "#e1f5fe",
    logic: (inputs, previousState) => {
      const CLK = inputs[0] ?? 0;
      const EN = inputs[1] ?? 0;
      const RST = inputs[2] ?? 0;

      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      if (RST === 1) {
        return {
          count: 0,
          Q0: 0,
          Q1: 0,
          Q2: 0,
          Q3: 0,
          overflow: 0,
          prevCLK: CLK,
        };
      }

      if (isRisingEdge && EN === 1) {
        const currentCount = previousState?.count || 0;
        const newCount = (currentCount + 1) & 0x0F;
        const overflow = currentCount === 15 && newCount === 0 ? 1 : 0;

        return {
          count: newCount,
          Q0: (newCount >> 0) & 1,
          Q1: (newCount >> 1) & 1,
          Q2: (newCount >> 2) & 1,
          Q3: (newCount >> 3) & 1,
          overflow: overflow,
          prevCLK: CLK,
        };
      }

      return {
        count: previousState?.count || 0,
        Q0: previousState?.Q0 || 0,
        Q1: previousState?.Q1 || 0,
        Q2: previousState?.Q2 || 0,
        Q3: previousState?.Q3 || 0,
        overflow: previousState?.overflow || 0,
        prevCLK: CLK,
      };
    },
  },
};
