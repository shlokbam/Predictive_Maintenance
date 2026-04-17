import os
import pickle
import numpy as np
import pandas as pd
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Define paths for models and scaler
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "..", "phase2_models", "saved_models")

# Load Models and Scaler
def load_models():
    models = {}
    model_files = {
        "logistic": "logistic.pkl",
        "dt": "dt.pkl",
        "knn": "knn.pkl",
        "rf": "rf.pkl",
        "hybrid": "hybrid.pkl"
    }
    
    for name, filename in model_files.items():
        path = os.path.join(MODELS_DIR, filename)
        if os.path.exists(path):
            with open(path, "rb") as f:
                models[name] = pickle.load(f)
        else:
            print(f"Warning: {filename} not found at {path}")
            
    scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
    scaler = None
    if os.path.exists(scaler_path):
        with open(scaler_path, "rb") as f:
            scaler = pickle.load(f)
    else:
        print(f"Warning: scaler.pkl not found at {scaler_path}")
            
    return models, scaler

models, _scaler = load_models()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        
        # Machine Type Mapping (L=0, M=1, H=2)
        type_mapping = {"L": 0, "M": 1, "H": 2}
        machine_type = type_mapping.get(data.get("type"), 0)
        
        # Extract features
        features = [
            machine_type,
            float(data.get("air_temp")),
            float(data.get("process_temp")),
            float(data.get("rot_speed")),
            float(data.get("torque")),
            float(data.get("tool_wear"))
        ]
        
        # Prepare for scaling (must be 2D array)
        features_df = pd.DataFrame([features], columns=[
            "Type", "Air temperature [K]", "Process temperature [K]", 
            "Rotational speed [rpm]", "Torque [Nm]", "Tool wear [min]"
        ])
        
        # Get predictions from all models
        predictions = {}
        for name, model in models.items():
            # If the model expects scaled data, we should apply scaler
            # However, the user might have some models trained on unscaled data (unlikely here)
            # We'll use the global _scaler if it exists
            if _scaler:
                features_scaled = _scaler.transform(features_df)
            else:
                features_scaled = features_df.values
                
            pred = int(model.predict(features_scaled)[0])
            predictions[name] = "Failure" if pred == 1 else "No Failure"
            
        return jsonify({
            "status": "success",
            "predictions": predictions
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)