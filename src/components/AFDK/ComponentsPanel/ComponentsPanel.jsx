import { useState } from "react";
import styles from "./ComponentsPanel.module.scss";

// Конфігурація
const GATE_TYPES = [
  { type: "AND", label: "AND", hasInputs: true },
  { type: "OR", label: "OR", hasInputs: true },
  { type: "NOT", label: "NOT", hasInputs: false },
  { type: "NAND", label: "NAND", hasInputs: true },
  { type: "NOR", label: "NOR", hasInputs: true },
  { type: "XOR", label: "XOR", hasInputs: true },
  { type: "XNOR", label: "XNOR", hasInputs: true },
];

const CATEGORIES = [
  {
    id: "logic",
    label: "Базові елементи",
    icon: "🔷",
    items: GATE_TYPES,
  },
  {
    id: "triggers",
    label: "Тригери",
    icon: "⚡",
    items: [
      { type: "D_TRIGGER", label: "D-тригер", hasInputs: false },
      { type: "RS_TRIGGER", label: "RS-тригер", hasInputs: false },
      { type: "JK_TRIGGER", label: "JK-тригер", hasInputs: false },
      { type: "T_TRIGGER", label: "T-тригер", hasInputs: false },
    ],
  },
  {
    id: "generators",
    label: "Генератори",
    icon: "⏱️",
    items: [{ type: "CLOCK", label: "Clock", hasInputs: false }],
  },
  {
    id: "multiplexers",
    label: "Мультиплексори",
    icon: "🔀",
    items: [
      { type: "MUX2", label: "MUX 2:1", hasInputs: false },
      { type: "MUX4", label: "MUX 4:1", hasInputs: false },
      { type: "MUX8", label: "MUX 8:1", hasInputs: false },
    ],
  },
  {
    id: "demultiplexers",
    label: "Демультиплексори",
    icon: "🔁",
    items: [
      { type: "DEMUX2", label: "DEMUX 1:2", hasInputs: false },
      { type: "DEMUX4", label: "DEMUX 1:4", hasInputs: false },
      { type: "DEMUX8", label: "DEMUX 1:8", hasInputs: false },
    ],
  },
  // ⭐ НОВА КАТЕГОРІЯ: Дешифратори
  {
    id: "decoders",
    label: "Дешифратори",
    icon: "🔢",
    items: [
      { type: "DECODER2", label: "DEC 2:4", hasInputs: false },
      { type: "DECODER3", label: "DEC 3:8", hasInputs: false },
      { type: "DECODER4", label: "DEC 4:16", hasInputs: false },
    ],
  },
  // ⭐ НОВА КАТЕГОРІЯ: Суматори
  {
    id: "adders",
    label: "Суматори",
    icon: "➕",
    items: [
      { type: "HALF_ADDER", label: "Half Adder", hasInputs: false },
      { type: "FULL_ADDER", label: "Full Adder", hasInputs: false },
      { type: "ADDER_4BIT", label: "4-bit Adder", hasInputs: false },
      { type: "ADDER_8BIT", label: "8-bit Adder", hasInputs: false },
    ],
  },
  // Регістри
  {
    id: "registers",
    label: "Регістри",
    icon: "💾",
    items: [
      { type: "REGISTER_4BIT", label: "REG 4-bit", hasInputs: false },
      { type: "REGISTER_8BIT", label: "REG 8-bit", hasInputs: false },
      { type: "SHIFT_REGISTER_4BIT", label: "SHIFT 4-bit", hasInputs: false },
      { type: "SHIFT_REGISTER_8BIT", label: "SHIFT 8-bit", hasInputs: false },
    ],
  },
  // Компаратори
  {
    id: "comparators",
    label: "Компаратори",
    icon: "⚖️",
    items: [
      { type: "COMPARATOR_1BIT", label: "CMP 1-bit", hasInputs: false },
      { type: "COMPARATOR_4BIT", label: "CMP 4-bit", hasInputs: false },
      { type: "COMPARATOR_8BIT", label: "CMP 8-bit", hasInputs: false },
    ],
  },
  // Лічильники
  {
    id: "counters",
    label: "Лічильники",
    icon: "🔢",
    items: [
      { type: "COUNTER_4BIT_UP", label: "CNT 4-bit UP", hasInputs: false },
      { type: "COUNTER_4BIT", label: "CNT 4-bit", hasInputs: false },
      { type: "COUNTER_8BIT", label: "CNT 8-bit", hasInputs: false },
    ],
  },
  // RAM && ROM
  {
    id: "memory",
    label: "Пам'ять",
    icon: "💾",
    items: [
      { type: "RAM_16x4", label: "RAM 16×4", hasInputs: false },
      { type: "RAM_16x8", label: "RAM 16×8", hasInputs: false },
      { type: "RAM_256x8", label: "RAM 256×8", hasInputs: false },
      { type: "RAM_256x8_CS", label: "RAM 256×8 CS", hasInputs: false },
      { type: "ROM_16x4", label: "ROM 16×4", hasInputs: false }, // ⭐ ДОДАТИ
      { type: "ROM_16x8", label: "ROM 16×8", hasInputs: false }, // ⭐ ДОДАТИ
      { type: "ROM_256x8", label: "ROM 256×8", hasInputs: false }, // ⭐ ДОДАТИ
      { type: "ROM_256x8_CS", label: "ROM 256×8 CS", hasInputs: false },
    ],
  },
  // ALU
  {
    id: "alu",
    label: "ALU",
    icon: "⚙️",
    items: [
      { type: "ALU_4BIT", label: "ALU 4-bit", hasInputs: false },
      { type: "ALU_8BIT", label: "ALU 8-bit", hasInputs: false },
    ],
  },
  // Encoder
  {
    id: "encoder",
    label: "Encoder",
    icon: "🔼",
    items: [
      { type: "ENCODER_4_2", label: "ENC 4:2", hasInputs: false },
      { type: "ENCODER_8_3", label: "ENC 8:3", hasInputs: false },
      { type: "ENCODER_16_4", label: "ENC 16:4", hasInputs: false },
    ],
  },
];

// ✅ Компонент для кнопки елемента
function GateButton({ item, onDragStart, inputOptions }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.hasInputs) {
    // ✅ Проста кнопка БЕЗ стрілочки
    return (
      <div className={styles.componentGroup}>
        <button
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          className={styles.mainButton}
        >
          {item.label}
        </button>
      </div>
    );
  }

  // ✅ Кнопка З СТРІЛОЧКОЮ та підменю
  return (
    <div className={styles.componentGroup}>
      <button className={styles.mainButton} onClick={() => setIsOpen(!isOpen)}>
        {item.label} {isOpen ? "▼" : "▶"}
      </button>

      {isOpen && (
        <div className={styles.submenu}>
          {inputOptions.map((count) => (
            <div
              key={count}
              draggable
              onDragStart={(e) => onDragStart(e, item.type, count)}
              className={styles.submenuItem}
            >
              {count} входів
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Головний компонент
function ComponentsPanel() {
  const [openCategories, setOpenCategories] = useState([]);

  const handleDragStart = (e, type, inputs = null) => {
    const componentData = inputs ? `${type}-${inputs}` : type;
    e.dataTransfer.setData("componentType", componentData);
  };

  const toggleCategory = (category) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const inputOptions = [2, 3, 4, 8];

  return (
    <div className={styles.panel}>
      <h3>Компоненти</h3>

      {CATEGORIES.map((category) => (
        <div key={category.id} className={styles.category}>
          <button
            className={styles.categoryButton}
            onClick={() => toggleCategory(category.id)}
          >
            {category.icon} {category.label}{" "}
            {openCategories.includes(category.id) ? "▼" : "▶"}
          </button>

          {openCategories.includes(category.id) && (
            <div className={styles.categoryContent}>
              {category.items.map((item) => (
                <GateButton
                  key={item.type}
                  item={item}
                  onDragStart={handleDragStart}
                  inputOptions={inputOptions}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ComponentsPanel;
