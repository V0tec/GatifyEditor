export const ROM_GATES = {
  // ROM 16x4 (16 адрес × 4 біти)
  ROM_16x4: {
    label: "ROM 16×4",
    color: "#e8eaf6",
    logic: (inputs, previousState) => {
      // Входи: A0-A3 (адреса)
      const address = [
        inputs[0] ?? 0,
        inputs[1] ?? 0,
        inputs[2] ?? 0,
        inputs[3] ?? 0,
      ];

      // Перетворюємо адресу в число
      let addr = 0;
      for (let i = 0; i < 4; i++) {
        addr |= address[i] << i;
      }

      // Ініціалізуємо ROM з дефолтними даними (можна змінювати!)
      // Користувач може "прошити" ROM через UI
      const memory = previousState?.memory || [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7, // 0-7
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15, // 8-15
      ];

      // Читання (завжди активне, без WE!)
      const readValue = memory[addr] || 0;
      const Q0 = (readValue >> 0) & 1;
      const Q1 = (readValue >> 1) & 1;
      const Q2 = (readValue >> 2) & 1;
      const Q3 = (readValue >> 3) & 1;

      return {
        memory: [...memory], // Зберігаємо пам'ять
        Q0,
        Q1,
        Q2,
        Q3,
      };
    },
  },

  // ROM 16x8 (16 адрес × 8 біт)
  ROM_16x8: {
    label: "ROM 16×8",
    color: "#e8eaf6",
    logic: (inputs, previousState) => {
      // Входи: A0-A3 (адреса)
      const address = [
        inputs[0] ?? 0,
        inputs[1] ?? 0,
        inputs[2] ?? 0,
        inputs[3] ?? 0,
      ];

      let addr = 0;
      for (let i = 0; i < 4; i++) {
        addr |= address[i] << i;
      }

      // Дефолтні дані (lookup table приклад)
      const memory = previousState?.memory || [
        0,
        1,
        2,
        4,
        8,
        16,
        32,
        64, // 0-7: степені 2
        128,
        127,
        64,
        32,
        16,
        8,
        4,
        2, // 8-15: зворотні
      ];

      // Читання
      const readValue = memory[addr] || 0;
      const outputs = {};
      for (let i = 0; i < 8; i++) {
        outputs[`Q${i}`] = (readValue >> i) & 1;
      }

      return {
        memory: [...memory],
        ...outputs,
      };
    },
  },

  // ROM 256x8 (256 адрес × 8 біт) - велика lookup table
  ROM_256x8: {
    label: "ROM 256×8",
    color: "#e8eaf6",
    logic: (inputs, previousState) => {
      // Входи: A0-A7 (адреса)
      const address = [];
      for (let i = 0; i < 8; i++) {
        address.push(inputs[i] ?? 0);
      }

      let addr = 0;
      for (let i = 0; i < 8; i++) {
        addr |= address[i] << i;
      }

      // Ініціалізуємо велику таблицю
      // Приклад: sin table (наближення)
      const memory =
        previousState?.memory ||
        Array.from({ length: 256 }, (_, i) => {
          // Простий патерн для демонстрації
          // Користувач може змінити через UI
          return i % 256;
        });

      // Читання
      const readValue = memory[addr] || 0;
      const outputs = {};
      for (let i = 0; i < 8; i++) {
        outputs[`Q${i}`] = (readValue >> i) & 1;
      }

      return {
        memory: [...memory],
        ...outputs,
      };
    },
  },

  // ROM 256x8 з Chip Select (для каскадування!)
  ROM_256x8_CS: {
    label: "ROM 256×8 CS",
    color: "#e8eaf6",
    logic: (inputs, previousState) => {
      // Входи: A0-A7 (адреса), CS
      const address = [];
      for (let i = 0; i < 8; i++) {
        address.push(inputs[i] ?? 0);
      }
      const CS = inputs[8] ?? 1; // Chip Select (default = 1 = активна)

      let addr = 0;
      for (let i = 0; i < 8; i++) {
        addr |= address[i] << i;
      }

      // Ініціалізуємо пам'ять
      const memory =
        previousState?.memory || Array.from({ length: 256 }, (_, i) => i % 256);

      // Читання (тільки якщо CS = 1, інакше 0!)
      const readValue = CS === 1 ? memory[addr] || 0 : 0;
      const outputs = {};
      for (let i = 0; i < 8; i++) {
        outputs[`Q${i}`] = (readValue >> i) & 1;
      }

      return {
        memory: [...memory],
        ...outputs,
      };
    },
  },
};
