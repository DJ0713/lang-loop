import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  languages: [],
  selectedLanguage: null,
  selectedLevel: null,
  searchQuery: "",
  filter: "all",
  loading: false,
  error: null,
};

const languageSlice = createSlice({
  name: "language",
  initialState,

  reducers: {
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },

    addLanguage: (state, action) => {
      state.languages.push(action.payload);
    },

    updateLanguage: (state, action) => {
      const index = state.languages.findIndex(
        (language) => language.id === action.payload.id
      );

      if (index !== -1) {
        state.languages[index] = action.payload;
      }
    },

    removeLanguage: (state, action) => {
      state.languages = state.languages.filter(
        (language) => language.id !== action.payload
      );

      if (state.selectedLanguage?.id === action.payload) {
        state.selectedLanguage = null;
      }
    },

    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },

    clearSelectedLanguage: (state) => {
      state.selectedLanguage = null;
    },

    setSelectedLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    resetFilters: (state) => {
      state.selectedLevel = null;
      state.searchQuery = "";
      state.filter = "all";
    },

    setLanguageLoading: (state, action) => {
      state.loading = action.payload;
    },

    setLanguageError: (state, action) => {
      state.error = action.payload;
    },

    clearLanguageError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLanguages,
  addLanguage,
  updateLanguage,
  removeLanguage,
  setSelectedLanguage,
  clearSelectedLanguage,
  setSelectedLevel,
  setSearchQuery,
  setFilter,
  resetFilters,
  setLanguageLoading,
  setLanguageError,
  clearLanguageError,
} = languageSlice.actions;

export default languageSlice.reducer;