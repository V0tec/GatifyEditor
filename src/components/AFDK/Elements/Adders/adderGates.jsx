export const ADDER_GATES = {
  // Напівсуматор (Half Adder) - складає 2 біти
  HALF_ADDER: {
    label: "HA",
    color: "#fff9c4",
    logic: (inputs) => {
      const A = inputs[0] ?? 0;
      const B = inputs[1] ?? 0;

      // Sum = A XOR B
      const sum = A ^ B;
      // Carry = A AND B
      const carry = A & B;

      return [sum, carry];
    },
  },

  // Повний суматор (Full Adder) - складає 2 біти + Carry
  FULL_ADDER: {
    label: "FA",
    color: "#fff9c4",
    logic: (inputs) => {
      const A = inputs[0] ?? 0;
      const B = inputs[1] ?? 0;
      const Cin = inputs[2] ?? 0;

      // Sum = A XOR B XOR Cin
      const sum = A ^ B ^ Cin;
      // Carry = (A AND B) OR (Cin AND (A XOR B))
      const carry = (A & B) | (Cin & (A ^ B));

      return [sum, carry];
    },
  },

  // 4-бітний суматор
  ADDER_4BIT: {
    label: "ADD 4-bit",
    color: "#fff9c4",
    logic: (inputs) => {
      // A0-A3, B0-B3, Cin
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
      const Cin = inputs[8] ?? 0;

      const result = [];
      let carry = Cin;

      // Складаємо кожен біт
      for (let i = 0; i < 4; i++) {
        const sum = A[i] ^ B[i] ^ carry;
        carry = (A[i] & B[i]) | (carry & (A[i] ^ B[i]));
        result.push(sum);
      }

      // Виходи: S0, S1, S2, S3, Cout
      result.push(carry);
      return result;
    },
  },

  // 8-бітний суматор
  ADDER_8BIT: {
    label: "ADD 8-bit",
    color: "#fff9c4",
    logic: (inputs) => {
      // A0-A7, B0-B7, Cin
      const A = [];
      const B = [];

      for (let i = 0; i < 8; i++) {
        A.push(inputs[i] ?? 0);
        B.push(inputs[i + 8] ?? 0);
      }
      const Cin = inputs[16] ?? 0;

      const result = [];
      let carry = Cin;

      // Складаємо кожен біт
      for (let i = 0; i < 8; i++) {
        const sum = A[i] ^ B[i] ^ carry;
        carry = (A[i] & B[i]) | (carry & (A[i] ^ B[i]));
        result.push(sum);
      }

      // Виходи: S0-S7, Cout
      result.push(carry);
      return result;
    },
  },
};
