import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roadmaps: [],
  decks: [],
  selectedDeck: null,
  loading: false,
  error: null,
};

const deckSlice = createSlice({
  name: "deck",
  initialState,

  reducers: {
    setRoadmaps: (state, action) => {
      state.roadmaps = action.payload;
    },

    addRoadmap: (state, action) => {
      state.roadmaps.push(action.payload);
    },

    updateRoadmap: (state, action) => {
      const index = state.roadmaps.findIndex(
        (roadmap) => roadmap.id === action.payload.id
      );

      if (index !== -1) {
        state.roadmaps[index] = action.payload;
      }
    },

    removeRoadmap: (state, action) => {
      state.roadmaps = state.roadmaps.filter(
        (roadmap) => roadmap.id !== action.payload
      );
    },

    setDecks: (state, action) => {
      state.decks = action.payload;
    },

    addDeck: (state, action) => {
      state.decks.push(action.payload);
    },

    updateDeck: (state, action) => {
      const index = state.decks.findIndex(
        (deck) => deck.id === action.payload.id
      );

      if (index !== -1) {
        state.decks[index] = action.payload;
      }

      if (state.selectedDeck?.id === action.payload.id) {
        state.selectedDeck = action.payload;
      }
    },

    removeDeck: (state, action) => {
      state.decks = state.decks.filter(
        (deck) => deck.id !== action.payload
      );

      if (state.selectedDeck?.id === action.payload) {
        state.selectedDeck = null;
      }
    },

    setSelectedDeck: (state, action) => {
      state.selectedDeck = action.payload;
    },

    clearSelectedDeck: (state) => {
      state.selectedDeck = null;
    },

    setDeckLoading: (state, action) => {
      state.loading = action.payload;
    },

    setDeckError: (state, action) => {
      state.error = action.payload;
    },

    clearDeckError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setRoadmaps,
  addRoadmap,
  updateRoadmap,
  removeRoadmap,
  setDecks,
  addDeck,
  updateDeck,
  removeDeck,
  setSelectedDeck,
  clearSelectedDeck,
  setDeckLoading,
  setDeckError,
  clearDeckError,
} = deckSlice.actions;

export default deckSlice.reducer;