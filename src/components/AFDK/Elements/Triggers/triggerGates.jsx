export const TRIGGER_GATES = {
  D_TRIGGER: {
    label: "D",
    color: "#e3f2fd",
    logic: (inputs, previousState) => {
      const D = inputs[0];
      const CLK = inputs[1];
      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      if (isRisingEdge) {
        return {
          Q: D,
          Qbar: D === 1 ? 0 : 1,
          prevCLK: CLK,
        };
      }

      return {
        Q: previousState?.Q || 0,
        Qbar: previousState?.Qbar !== undefined ? previousState.Qbar : 1,
        prevCLK: CLK,
      };
    },
  },

  RS_TRIGGER: {
    label: "RS",
    color: "#fff3e0",
    logic: (inputs, previousState) => {
      const S = inputs[0];
      const R = inputs[1];

      if (S === 1 && R === 1) {
        return {
          Q: 0,
          Qbar: 0,
          error: true,
        };
      }

      if (S === 1 && R === 0) {
        return { Q: 1, Qbar: 0 };
      }

      if (S === 0 && R === 1) {
        return { Q: 0, Qbar: 1 };
      }

      return {
        Q: previousState?.Q || 0,
        Qbar: previousState?.Qbar !== undefined ? previousState.Qbar : 1,
      };
    },
  },

  JK_TRIGGER: {
    label: "JK",
    color: "#f3e5f5",
    logic: (inputs, previousState) => {
      const J = inputs[0];
      const K = inputs[1];
      const CLK = inputs[2];
      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      if (!isRisingEdge) {
        return {
          Q: previousState?.Q || 0,
          Qbar: previousState?.Qbar !== undefined ? previousState.Qbar : 1,
          prevCLK: CLK,
        };
      }

      const currentQ = previousState?.Q || 0;

      if (J === 0 && K === 0) {
        return { Q: currentQ, Qbar: currentQ === 1 ? 0 : 1, prevCLK: CLK };
      }

      if (J === 1 && K === 0) {
        return { Q: 1, Qbar: 0, prevCLK: CLK };
      }

      if (J === 0 && K === 1) {
        return { Q: 0, Qbar: 1, prevCLK: CLK };
      }

      if (J === 1 && K === 1) {
        return {
          Q: currentQ === 1 ? 0 : 1,
          Qbar: currentQ === 1 ? 1 : 0,
          prevCLK: CLK,
        };
      }

      return { ...previousState, prevCLK: CLK };
    },
  },

  T_TRIGGER: {
    label: "T",
    color: "#e8f5e9",
    logic: (inputs, previousState) => {
      const T = inputs[0];
      const CLK = inputs[1];
      const prevCLK = previousState?.prevCLK || 0;
      const isRisingEdge = CLK === 1 && prevCLK === 0;

      if (!isRisingEdge) {
        return {
          Q: previousState?.Q || 0,
          Qbar: previousState?.Qbar !== undefined ? previousState.Qbar : 1,
          prevCLK: CLK,
        };
      }

      const currentQ = previousState?.Q || 0;

      if (T === 1) {
        return {
          Q: currentQ === 1 ? 0 : 1,
          Qbar: currentQ === 1 ? 1 : 0,
          prevCLK: CLK,
        };
      }

      return {
        Q: currentQ,
        Qbar: currentQ === 1 ? 0 : 1,
        prevCLK: CLK,
      };
    },
  },
};
