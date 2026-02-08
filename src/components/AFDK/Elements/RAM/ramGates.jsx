export const RAM_GATES = {
  // RAM 16x4 (16 адрес × 4 біти)
  RAM_16x4: {
    label: "RAM 16×4",
    color: "#f3e5f5",
    logic: (inputs, previousState) => {
      // Входи: A0-A3 (адреса), D0-D3 (дані), WE (Write Enable), CLK
      const address = [
        inputs[0] ?? 0,
        inputs[1] ?? 0,
        inputs[2] ?? 0,
        inputs[3] ?? 0,
      ];
      const dataIn = [
        inputs[4] ?? 0,
        inputs[5] ?? 0,
        inputs[6] ?? 0,
        inputs[7] ?? 0,
      ];
      const WE = inputs[8] ?? 0;
      const CLK = inputs[9] ?? 0;

      // Перетворюємо адресу в число
      let addr = 0;
      for (let i = 0; i < 4; i++) {
        addr |= address[i] << i;
      }

      // Ініціалізуємо пам'ять якщо її немає
      const memory = previousState?.memory || new Array(16).fill(0);
      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      // Запис: якщо WE=1 і rising edge
      if (isRisingEdge && WE === 1) {
        let dataValue = 0;
        for (let i = 0; i < 4; i++) {
          dataValue |= dataIn[i] << i;
        }
        memory[addr] = dataValue;
      }

      // Читання: завжди читаємо з поточної адреси
      const readValue = memory[addr] || 0;
      const Q0 = (readValue >> 0) & 1;
      const Q1 = (readValue >> 1) & 1;
      const Q2 = (readValue >> 2) & 1;
      const Q3 = (readValue >> 3) & 1;

      return {
        memory: [...memory], // Копіюємо масив
        prevCLK: CLK,
        Q0,
        Q1,
        Q2,
        Q3,
      };
    },
  },

  // RAM 256x8 (256 адрес × 8 біт)
  RAM_256x8: {
    label: "RAM 256×8",
    color: "#f3e5f5",
    logic: (inputs, previousState) => {
      // Входи: A0-A7 (адреса), D0-D7 (дані), WE, CLK
      const address = [];
      const dataIn = [];

      for (let i = 0; i < 8; i++) {
        address.push(inputs[i] ?? 0);
        dataIn.push(inputs[i + 8] ?? 0);
      }

      const WE = inputs[16] ?? 0;
      const CLK = inputs[17] ?? 0;

      // Перетворюємо адресу в число
      let addr = 0;
      for (let i = 0; i < 8; i++) {
        addr |= address[i] << i;
      }

      // Ініціалізуємо пам'ять
      const memory = previousState?.memory || new Array(256).fill(0);
      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      // Запис
      if (isRisingEdge && WE === 1) {
        let dataValue = 0;
        for (let i = 0; i < 8; i++) {
          dataValue |= dataIn[i] << i;
        }
        memory[addr] = dataValue;
      }

      // Читання
      const readValue = memory[addr] || 0;
      const outputs = {};
      for (let i = 0; i < 8; i++) {
        outputs[`Q${i}`] = (readValue >> i) & 1;
      }

      return {
        memory: [...memory],
        prevCLK: CLK,
        ...outputs,
      };
    },
  },

  // RAM 16x8 (16 адрес × 8 біт) - золота середина
  RAM_16x8: {
    label: "RAM 16×8",
    color: "#f3e5f5",
    logic: (inputs, previousState) => {
      // Входи: A0-A3 (адреса), D0-D7 (дані), WE, CLK
      const address = [
        inputs[0] ?? 0,
        inputs[1] ?? 0,
        inputs[2] ?? 0,
        inputs[3] ?? 0,
      ];
      const dataIn = [];
      for (let i = 0; i < 8; i++) {
        dataIn.push(inputs[i + 4] ?? 0);
      }
      const WE = inputs[12] ?? 0;
      const CLK = inputs[13] ?? 0;

      // Адреса
      let addr = 0;
      for (let i = 0; i < 4; i++) {
        addr |= address[i] << i;
      }

      // Пам'ять
      const memory = previousState?.memory || new Array(16).fill(0);
      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      // Запис
      if (isRisingEdge && WE === 1) {
        let dataValue = 0;
        for (let i = 0; i < 8; i++) {
          dataValue |= dataIn[i] << i;
        }
        memory[addr] = dataValue;
      }

      // Читання
      const readValue = memory[addr] || 0;
      const outputs = {};
      for (let i = 0; i < 8; i++) {
        outputs[`Q${i}`] = (readValue >> i) & 1;
      }

      return {
        memory: [...memory],
        prevCLK: CLK,
        ...outputs,
      };
    },
  },

  // RAM 256x8 з Chip Select (для каскадування!)
  RAM_256x8_CS: {
    label: "RAM 256×8 CS",
    color: "#f3e5f5",
    logic: (inputs, previousState) => {
      // Входи: A0-A7 (адреса), D0-D7 (дані), WE, CLK, CS
      const address = [];
      const dataIn = [];

      for (let i = 0; i < 8; i++) {
        address.push(inputs[i] ?? 0);
        dataIn.push(inputs[i + 8] ?? 0);
      }

      const WE = inputs[16] ?? 0;
      const CLK = inputs[17] ?? 0;
      const CS = inputs[18] ?? 1; // Chip Select (default = 1 = активна)

      // Перетворюємо адресу в число
      let addr = 0;
      for (let i = 0; i < 8; i++) {
        addr |= address[i] << i;
      }

      // Ініціалізуємо пам'ять
      const memory = previousState?.memory || new Array(256).fill(0);
      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      // Запис (тільки якщо CS = 1!)
      if (isRisingEdge && WE === 1 && CS === 1) {
        let dataValue = 0;
        for (let i = 0; i < 8; i++) {
          dataValue |= dataIn[i] << i;
        }
        memory[addr] = dataValue;
      }

      // Читання (тільки якщо CS = 1, інакше 0!)
      const readValue = CS === 1 ? memory[addr] || 0 : 0;
      const outputs = {};
      for (let i = 0; i < 8; i++) {
        outputs[`Q${i}`] = (readValue >> i) & 1;
      }

      return {
        memory: [...memory],
        prevCLK: CLK,
        ...outputs,
      };
    },
  },
};
