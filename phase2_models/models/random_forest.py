# models/random_forest.py

import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

df = pd.read_csv("/Users/shlokbam/Documents/Code/mldl/phase2_models/data/normalized_dataset.csv")

X = df.drop("Target", axis=1)
y = df["Target"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

results = {
    "Model": "Random Forest",
    "Accuracy": accuracy_score(y_test, y_pred),
    "Precision": precision_score(y_test, y_pred),
    "Recall": recall_score(y_test, y_pred),
    "F1 Score": f1_score(y_test, y_pred)
}

# Save model
with open("/Users/shlokbam/Documents/Code/mldl/phase2_models/saved_models/rf.pkl", "wb") as f:
    pickle.dump(model, f)

# Save results
pd.DataFrame([results]).to_csv("/Users/shlokbam/Documents/Code/mldl/phase2_models/outputs/rf_results.csv", index=False)

print("Random Forest Done")