import api from "./api";

const studyService = {
  // Get study sessions
  getStudySessions: async () => {
    const response = await api.get("/study/sessions");
    return response.data;
  },

  // Get a specific study session
  getStudySessionById: async (sessionId) => {
    const response = await api.get(`/study/sessions/${sessionId}`);
    return response.data;
  },

  // Start a study session
  startStudySession: async (data) => {
    const response = await api.post("/study/sessions/start", data);
    return response.data;
  },

  // Complete a study session
  completeStudySession: async (sessionId, data = {}) => {
    const response = await api.post(
      `/study/sessions/${sessionId}/complete`,
      data
    );

    return response.data;
  },

  // Get review schedule
  getReviewSchedule: async () => {
    const response = await api.get("/study/reviews");
    return response.data;
  },

  // Schedule a review
  scheduleReview: async (reviewData) => {
    const response = await api.post("/study/reviews", reviewData);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(
      `/study/reviews/${reviewId}`,
      reviewData
    );

    return response.data;
  },
};

export default studyService;