import api from "./api";

const deckService = {
  // Get all decks
  getDecks: async () => {
    const response = await api.get("/decks");
    return response.data;
  },

  // Get a single deck
  getDeckById: async (deckId) => {
    const response = await api.get(`/decks/${deckId}`);
    return response.data;
  },

  // Create a new deck
  createDeck: async (deckData) => {
    const response = await api.post("/decks", deckData);
    return response.data;
  },

  // Update an existing deck
  updateDeck: async (deckId, deckData) => {
    const response = await api.put(`/decks/${deckId}`, deckData);
    return response.data;
  },

  // Delete a deck
  deleteDeck: async (deckId) => {
    const response = await api.delete(`/decks/${deckId}`);
    return response.data;
  },
};

export default deckService;