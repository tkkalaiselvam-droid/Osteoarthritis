const BASE_URL = "http://127.0.0.1:8000/api";

export const KneeSenseAPI = {
  async submitAssessment(patientId, videoFile, questionnaireAnswers = {}) {
    const formData = new FormData();
    formData.append("patient_id", patientId);
    
    if (videoFile) {
      formData.append("video", videoFile);
    }
    
    formData.append("q1_answer", questionnaireAnswers.Q_BASE_1 || "");
    formData.append("q2_answer", questionnaireAnswers.Q_BASE_2 || "");
    formData.append("q3_answer", questionnaireAnswers.Q_AI_CONTEXT_1 || "");

    try {
      const response = await fetch(`${BASE_URL}/assessments/process`, {
        method: "POST",
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error("Error submitting assessment:", error);
      throw error;
    }
  }
};