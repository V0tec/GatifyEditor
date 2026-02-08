export const COMPARATOR_GATES = {
  // 4-бітний компаратор
  COMPARATOR_4BIT: {
    label: "CMP 4-bit",
    color: "#ffe0b2",
    logic: (inputs) => {
      // Входи: A0-A3, B0-B3
      const A = [
        inputs[0] ?? 0,
        inputs[1] ?? 0,
        inputs[2] ?? 0,
        inputs[3] ?? 0,
      ];
      const B = [
        inputs[4] ?? 0,
        inputs[5] ?? 0,
        inputs[6] ?? 0,
        inputs[7] ?? 0,
      ];

      // Перетворюємо в числа
      let numA = 0;
      let numB = 0;
      for (let i = 0; i < 4; i++) {
        numA |= A[i] << i;
        numB |= B[i] << i;
      }

      // Порівнюємо
      const greater = numA > numB ? 1 : 0;
      const equal = numA === numB ? 1 : 0;
      const less = numA < numB ? 1 : 0;

      // Виходи: GT (A>B), EQ (A=B), LT (A<B)
      return [greater, equal, less];
    },
  },

  // 8-бітний компаратор
  COMPARATOR_8BIT: {
    label: "CMP 8-bit",
    color: "#ffe0b2",
    logic: (inputs) => {
      // Входи: A0-A7, B0-B7
      const A = [];
      const B = [];
      for (let i = 0; i < 8; i++) {
        A.push(inputs[i] ?? 0);
        B.push(inputs[i + 8] ?? 0);
      }

      // Перетворюємо в числа
      let numA = 0;
      let numB = 0;
      for (let i = 0; i < 8; i++) {
        numA |= A[i] << i;
        numB |= B[i] << i;
      }

      // Порівнюємо
      const greater = numA > numB ? 1 : 0;
      const equal = numA === numB ? 1 : 0;
      const less = numA < numB ? 1 : 0;

      // Виходи: GT (A>B), EQ (A=B), LT (A<B)
      return [greater, equal, less];
    },
  },

  // 1-бітний компаратор (простий)
  COMPARATOR_1BIT: {
    label: "CMP 1-bit",
    color: "#ffe0b2",
    logic: (inputs) => {
      const A = inputs[0] ?? 0;
      const B = inputs[1] ?? 0;

      const greater = A > B ? 1 : 0;
      const equal = A === B ? 1 : 0;
      const less = A < B ? 1 : 0;

      return [greater, equal, less];
    },
  },
};
