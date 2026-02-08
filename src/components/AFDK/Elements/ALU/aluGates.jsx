export const ALU_GATES = {
  // 4-бітний ALU
  ALU_4BIT: {
    label: "ALU 4-bit",
    color: "#fff3e0",
    logic: (inputs) => {
      // Входи: A0-A3, B0-B3, OP0-OP2, Cin
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
      const OP = [
        inputs[8] ?? 0,   // OP0
        inputs[9] ?? 0,   // OP1
        inputs[10] ?? 0,  // OP2
      ];
      const Cin = inputs[11] ?? 0;

      // Перетворюємо в числа
      let numA = 0;
      let numB = 0;
      for (let i = 0; i < 4; i++) {
        numA |= A[i] << i;
        numB |= B[i] << i;
      }

      // Визначаємо операцію
      const operation = (OP[2] << 2) | (OP[1] << 1) | OP[0];
      
      let result = 0;
      let carry = 0;
      let zero = 0;
      let negative = 0;
      let overflow = 0;

      switch (operation) {
        case 0: // ADD (A + B + Cin)
          result = numA + numB + Cin;
          carry = result > 15 ? 1 : 0;
          result &= 0x0F;
          // Overflow для знакових чисел
          const signA = (numA >> 3) & 1;
          const signB = (numB >> 3) & 1;
          const signR = (result >> 3) & 1;
          overflow = (signA === signB && signA !== signR) ? 1 : 0;
          break;

        case 1: // SUB (A - B)
          result = numA - numB;
          carry = result < 0 ? 1 : 0; // Borrow
          result &= 0x0F;
          break;

        case 2: // AND (A & B)
          result = numA & numB;
          break;

        case 3: // OR (A | B)
          result = numA | numB;
          break;

        case 4: // XOR (A ^ B)
          result = numA ^ numB;
          break;

        case 5: // NOT A
          result = (~numA) & 0x0F;
          break;

        case 6: // SHL (shift left)
          result = (numA << 1) & 0x0F;
          carry = (numA >> 3) & 1; // Біт що вилетів
          break;

        case 7: // SHR (shift right)
          carry = numA & 1; // Біт що вилетів
          result = numA >> 1;
          break;

        default:
          result = 0;
      }

      // Прапорці
      zero = result === 0 ? 1 : 0;
      negative = (result >> 3) & 1; // MSB

      // Виходи: R0-R3, Carry, Zero, Negative, Overflow
      return [
        (result >> 0) & 1, // R0
        (result >> 1) & 1, // R1
        (result >> 2) & 1, // R2
        (result >> 3) & 1, // R3
        carry,
        zero,
        negative,
        overflow,
      ];
    },
  },

  // 8-бітний ALU
  ALU_8BIT: {
    label: "ALU 8-bit",
    color: "#fff3e0",
    logic: (inputs) => {
      // Входи: A0-A7, B0-B7, OP0-OP2, Cin
      const A = [];
      const B = [];
      for (let i = 0; i < 8; i++) {
        A.push(inputs[i] ?? 0);
        B.push(inputs[i + 8] ?? 0);
      }
      const OP = [
        inputs[16] ?? 0,  // OP0
        inputs[17] ?? 0,  // OP1
        inputs[18] ?? 0,  // OP2
      ];
      const Cin = inputs[19] ?? 0;

      // Перетворюємо в числа
      let numA = 0;
      let numB = 0;
      for (let i = 0; i < 8; i++) {
        numA |= A[i] << i;
        numB |= B[i] << i;
      }

      const operation = (OP[2] << 2) | (OP[1] << 1) | OP[0];
      
      let result = 0;
      let carry = 0;
      let zero = 0;
      let negative = 0;
      let overflow = 0;

      switch (operation) {
        case 0: // ADD
          result = numA + numB + Cin;
          carry = result > 255 ? 1 : 0;
          result &= 0xFF;
          const signA = (numA >> 7) & 1;
          const signB = (numB >> 7) & 1;
          const signR = (result >> 7) & 1;
          overflow = (signA === signB && signA !== signR) ? 1 : 0;
          break;

        case 1: // SUB
          result = numA - numB;
          carry = result < 0 ? 1 : 0;
          result &= 0xFF;
          break;

        case 2: // AND
          result = numA & numB;
          break;

        case 3: // OR
          result = numA | numB;
          break;

        case 4: // XOR
          result = numA ^ numB;
          break;

        case 5: // NOT A
          result = (~numA) & 0xFF;
          break;

        case 6: // SHL
          result = (numA << 1) & 0xFF;
          carry = (numA >> 7) & 1;
          break;

        case 7: // SHR
          carry = numA & 1;
          result = numA >> 1;
          break;

        default:
          result = 0;
      }

      zero = result === 0 ? 1 : 0;
      negative = (result >> 7) & 1;

      // Виходи: R0-R7, Carry, Zero, Negative, Overflow
      const outputs = [];
      for (let i = 0; i < 8; i++) {
        outputs.push((result >> i) & 1);
      }
      outputs.push(carry, zero, negative, overflow);
      
      return outputs;
    },
  },
};
