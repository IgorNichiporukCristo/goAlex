import {
  createAssistant,
  createSmartappDebugger,
} from "@salutejs/client";

export const initialize = (getState) => {
  if (process.env.REACT_APP_DEB === "test") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_ASSISTANT_TOKEN,

      initPhrase: "Запусти N_News",

      // initPhrase: "запусти news123",
      getState,
      enableRecord: true,
      recordParams: {
        defaultActive: false,
      },
    });
  }
  return createAssistant({ getState });
};
