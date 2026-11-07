import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice";
import deckReducer from "./slices/deckSlice";
import languageReducer from "./slices/languageSlice";
import studyReducer from "./slices/studySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    decks: deckReducer,
    languages: languageReducer,
    study: studyReducer,
  },
});

export default store;