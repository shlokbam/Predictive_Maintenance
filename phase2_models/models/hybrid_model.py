# models/hybrid_model.py

import pandas as pd
import pickle

from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# ----------------------------
# Load Dataset
# ----------------------------
df = pd.read_csv("/Users/shlokbam/Documents/Code/mldl/phase2_models/data/normalized_dataset.csv")

X = df.drop("Target", axis=1)
y = df["Target"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ----------------------------
# Base Models
# ----------------------------
rf = RandomForestClassifier(n_estimators=100, random_state=42)
knn = KNeighborsClassifier(n_neighbors=5)

# ----------------------------
# Hybrid Model (Voting)
# ----------------------------
hybrid = VotingClassifier(
    estimators=[("rf", rf), ("knn", knn)],
    voting="hard"
)

# Train
hybrid.fit(X_train, y_train)

# Predict
y_pred = hybrid.predict(X_test)

# ----------------------------
# Evaluation
# ----------------------------
results = {
    "Model": "Hybrid (RF + KNN)",
    "Accuracy": accuracy_score(y_test, y_pred),
    "Precision": precision_score(y_test, y_pred),
    "Recall": recall_score(y_test, y_pred),
    "F1 Score": f1_score(y_test, y_pred)
}

print("\nHybrid Model Results:\n")
for k, v in results.items():
    print(f"{k}: {v}")

# ----------------------------
# Save Model
# ----------------------------
with open("/Users/shlokbam/Documents/Code/mldl/phase2_models/saved_models/hybrid.pkl", "wb") as f:
    pickle.dump(hybrid, f)

# Save Results
pd.DataFrame([results]).to_csv("/Users/shlokbam/Documents/Code/mldl/phase2_models/outputs/hybrid_results.csv", index=False)

print("\nHybrid Model Saved Successfully")