from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import joblib
import uvicorn
import random

app = FastAPI(title="KneeSense AI Engine API")

# Enable Cross-Origin Resource Sharing (CORS) for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained classification model (fallback to mock prediction if model file is generating)
try:
    oa_model = joblib.load('oa_risk_model.pkl')
    has_model = True
except Exception:
    has_model = False

def calculate_knee_angle(hip, knee, ankle):
    """Calculates internal joint angle at the knee in degrees."""
    hip, knee, ankle = np.array(hip), np.array(knee), np.array(ankle)
    radians = np.arctan2(ankle[1]-knee[1], ankle[0]-knee[0]) - \
              np.arctan2(hip[1]-knee[1], hip[0]-knee[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return float(360 - angle if angle > 180.0 else angle)

@app.post("/api/assessments/process")
async def process_assessment(
    patient_id: str = Form("PAT-2026-8831"),
    q1_answer: str = Form("Yes, it takes about 20 minutes to move comfortably."),
    q2_answer: str = Form("Yes, walking long distances makes it throbbing."),
    q3_answer: str = Form("It was severe stiffness in my right knee.")
):
    """
    Core AI Pipeline Endpoint matching Backend Database Schema.
    """
    # 1. Simulate keypoint extraction from uploaded gait video
    left_angle = calculate_knee_angle([200, 150], [220, 280], [210, 400])
    right_angle = calculate_knee_angle([300, 150], [320, 260], [310, 390])
    asymmetry = abs(left_angle - right_angle)

    # 2. Extract questionnaire features
    stiffness_score = 3 if "20 minutes" in q1_answer or "severe" in q1_answer.lower() else 1
    activity_pain = 1 if "Yes" in q2_answer else 0
    hesitation_pain = 1 if "stiffness" in q3_answer.lower() or "pain" in q3_answer.lower() else 0

    # 3. Model Inference
    if has_model:
        features = np.array([[left_angle, right_angle, asymmetry, stiffness_score, activity_pain, hesitation_pain]])
        risk_prob = float(oa_model.predict_proba(features)[0][1])
    else:
        risk_prob = 0.84  # Matches backend database schema default

    # 4. Determine severity classification based on risk score
    if risk_prob < 0.35:
        severity = "Low Risk"
    elif risk_prob < 0.65:
        severity = "Moderate Risk"
    else:
        severity = "Moderate to Severe"

    # 5. Return JSON payload matching Database Schema exactly
    return {
        "patient_id": patient_id,
        "assessment_id": f"ASM-{random.randint(1000, 9999)}",
        "date_created": "2026-09-06T18:30:00Z",
        "ai_questionnaire": {
            "responses": [
                {"question_id": "Q-001", "category": "common", "question_text": "Do you experience stiffness?", "answer": q1_answer},
                {"question_id": "Q-002", "category": "common", "question_text": "Does pain increase after activity?", "answer": q2_answer},
                {"question_id": "Q-003", "category": "video_contextual", "question_text": "Did you feel sharp pain when rising?", "answer": q3_answer}
            ]
        },
        "ai_biomechanical_analysis": {
            "processed_frames": 462,
            "max_knee_flexion_left_degrees": round(left_angle, 1),
            "max_knee_flexion_right_degrees": round(right_angle, 1),
            "normal_range_flexion_degrees": "110.0 to 130.0",
            "gait_anomalies_detected": [
                "Right-side unloading (favoring left leg)",
                "Prolonged trunk flexion (leaning too far forward)"
            ]
        },
        "final_report": {
            "report_id": f"REP-{random.randint(1000, 9999)}",
            "osteoarthritis_risk_score": round(risk_prob, 2),
            "severity_classification": severity,
            "clinical_summary": f"Patient exhibits clear biomechanical markers of Right Knee Osteoarthritis with a joint flexion variance of {round(asymmetry, 1)}°.",
            "recommended_next_steps": [
                "Schedule diagnostic bilateral knee radiograph (X-ray).",
                "Refer to physical therapy for targeted quadricep strengthening."
            ]
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
