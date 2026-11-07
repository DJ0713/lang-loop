import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSession: null,
  currentCard: null,
  sessionCards: [],
  currentIndex: 0,
  completedCards: [],
  spacedRepetition: {},
  isStudying: false,
  loading: false,
  error: null,
};

const studySlice = createSlice({
  name: "study",
  initialState,

  reducers: {
    startSession: (state, action) => {
      state.currentSession = action.payload;
      state.sessionCards = action.payload.cards || [];
      state.currentIndex = 0;
      state.completedCards = [];
      state.isStudying = true;

      state.currentCard =
        state.sessionCards.length > 0
          ? state.sessionCards[0]
          : null;
    },

    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },

    setSessionCards: (state, action) => {
      state.sessionCards = action.payload;
      state.currentIndex = 0;

      state.currentCard =
        action.payload.length > 0
          ? action.payload[0]
          : null;
    },

    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
    },

    nextCard: (state) => {
      if (state.currentIndex < state.sessionCards.length - 1) {
        state.currentIndex += 1;
        state.currentCard =
          state.sessionCards[state.currentIndex];
      } else {
        state.currentCard = null;
      }
    },

    previousCard: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentCard =
          state.sessionCards[state.currentIndex];
      }
    },

    completeCard: (state, action) => {
      const card = action.payload;

      const exists = state.completedCards.some(
        (item) => item.id === card.id
      );

      if (!exists) {
        state.completedCards.push(card);
      }
    },

    updateSpacedRepetition: (state, action) => {
      const { cardId, data } = action.payload;

      state.spacedRepetition[cardId] = {
        ...state.spacedRepetition[cardId],
        ...data,
      };
    },

    setSpacedRepetition: (state, action) => {
      state.spacedRepetition = action.payload;
    },

    finishSession: (state) => {
      state.isStudying = false;
      state.currentCard = null;
    },

    resetStudy: () => initialState,

    setStudyLoading: (state, action) => {
      state.loading = action.payload;
    },

    setStudyError: (state, action) => {
      state.error = action.payload;
    },

    clearStudyError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startSession,
  setCurrentSession,
  setSessionCards,
  setCurrentCard,
  nextCard,
  previousCard,
  completeCard,
  updateSpacedRepetition,
  setSpacedRepetition,
  finishSession,
  resetStudy,
  setStudyLoading,
  setStudyError,
  clearStudyError,
} = studySlice.actions;

export default studySlice.reducer;