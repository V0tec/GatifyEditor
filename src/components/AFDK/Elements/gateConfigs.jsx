import { BASIC_GATES } from "./LogicGates/logicGates.jsx";
import { TRIGGER_GATES } from "./Triggers/triggerGates.jsx";
import { CLOCK_GATE } from "./Generators/clockGate.jsx";
import { MULTIPLEXER_GATES } from "./Multiplexers/multiplexerGates.jsx";
import { DEMULTIPLEXER_GATES } from "./Demultiplexers/demultiplexerGates.jsx";
import { DECODER_GATES } from "./Decoders/decoderGates.jsx";
import { ADDER_GATES } from "./Adders/adderGates.jsx"; // ⭐ ДОДАНО
import { REGISTER_GATES } from "./Registers/registerGates.jsx";
import { COMPARATOR_GATES } from "./Comparators/comparatorGates.jsx";
import { COUNTER_GATES } from "./Counters/counterGates.jsx";
import { RAM_GATES } from "./RAM/ramGates.jsx";
import { ALU_GATES } from "./ALU/aluGates.jsx";
import { ROM_GATES } from "./ROM/romGates.jsx";
import { ENCODER_GATES } from "./Encoder/encoderGates.jsx";

import { createLogicGate } from "./LogicGates/createLogicGate.jsx";
import { createTrigger } from "./Triggers/createTrigger.jsx";
import { createClock } from "./Generators/createClock.jsx";
import { createMultiplexer } from "./Multiplexers/createMultiplexer.jsx";
import { createDemultiplexer } from "./Demultiplexers/createDemultiplexer.jsx";
import { createDecoder } from "./Decoders/createDecoder.jsx";
import { createAdder } from "./Adders/createAdder.jsx"; // ⭐ ДОДАНО
import { createRegister } from "./Registers/createRegister.jsx";
import { createComparator } from "./Comparators/createComparator.jsx";
import { createCounter } from "./Counters/createCounter.jsx";
import { createRAM } from "./RAM/createRAM.jsx";
import { createALU } from "./ALU/createALU.jsx";
import { createROM } from "./ROM/createROM.jsx";
import { createEncoder } from "./Encoder/createEncoder.jsx";

// Об'єднуємо всі конфігурації
export const GATE_CONFIGS = {
  ...BASIC_GATES,
  ...TRIGGER_GATES,
  ...CLOCK_GATE,
  ...MULTIPLEXER_GATES,
  ...DEMULTIPLEXER_GATES,
  ...DECODER_GATES,
  ...ADDER_GATES, // ⭐ ДОДАНО
  ...REGISTER_GATES,
  ...COMPARATOR_GATES,
  ...COUNTER_GATES,
  ...RAM_GATES,
  ...ALU_GATES,
  ...ROM_GATES,
  ...ENCODER_GATES,
};

// Головна функція створення компонента
export const createComponent = (id, type, inputCount, x, y) => {
  const config = GATE_CONFIGS[type];
  if (!config) return null;

  // Тригери
  if (
    type === "D_TRIGGER" ||
    type === "RS_TRIGGER" ||
    type === "JK_TRIGGER" ||
    type === "T_TRIGGER"
  ) {
    return createTrigger(id, type, x, y);
  }

  // Clock
  if (type === "CLOCK") {
    return createClock(id, x, y);
  }

  // Мультиплексори
  if (type === "MUX2" || type === "MUX4" || type === "MUX8") {
    return createMultiplexer(id, type, x, y);
  }

  // Демультиплексори
  if (type === "DEMUX2" || type === "DEMUX4" || type === "DEMUX8") {
    return createDemultiplexer(id, type, x, y);
  }

  // Дешифратори
  if (type === "DECODER2" || type === "DECODER3" || type === "DECODER4") {
    return createDecoder(id, type, x, y);
  }

  // ⭐ Суматори
  if (
    type === "HALF_ADDER" ||
    type === "FULL_ADDER" ||
    type === "ADDER_4BIT" ||
    type === "ADDER_8BIT"
  ) {
    return createAdder(id, type, x, y);
  }

  //  Регістри
  if (
    type === "REGISTER_4BIT" ||
    type === "REGISTER_8BIT" ||
    type === "SHIFT_REGISTER_4BIT" ||
    type === "SHIFT_REGISTER_8BIT"
  ) {
    return createRegister(id, type, x, y);
  }

  // Компаратори
  if (
    type === "COMPARATOR_1BIT" ||
    type === "COMPARATOR_4BIT" ||
    type === "COMPARATOR_8BIT"
  ) {
    return createComparator(id, type, x, y);
  }

  // Лічильники
  if (
    type === "COUNTER_4BIT" ||
    type === "COUNTER_8BIT" ||
    type === "COUNTER_4BIT_UP"
  ) {
    return createCounter(id, type, x, y);
  }

  // RAM
  if (
    type === "RAM_16x4" ||
    type === "RAM_16x8" ||
    type === "RAM_256x8" ||
    type === "RAM_256x8_CS"
  ) {
    return createRAM(id, type, x, y);
  }

  // ALU
  if (type === "ALU_4BIT" || type === "ALU_8BIT") {
    return createALU(id, type, x, y);
  }

  // ROM
  if (
    type === "ROM_16x4" ||
    type === "ROM_16x8" ||
    type === "ROM_256x8" ||
    type === "ROM_256x8_CS"
  ) {
    return createROM(id, type, x, y);
  }

  // ENCODER
  if (
    type === "ENCODER_4_2" ||
    type === "ENCODER_8_3" ||
    type === "ENCODER_16_4"
  ) {
    return createEncoder(id, type, x, y);
  }

  // Звичайні логічні елементи
  return createLogicGate(id, type, inputCount, x, y);
};
