from flask import Flask, render_template, send_file
import os
import pandas as pd

app = Flask(__name__, static_folder="static", static_url_path="/static")

# Base paths for graph directories
GRAPHS_BASE = "/Users/shlokbam/Documents/Code/mldl"
GRAPHS_DIRS = {
    "eda": f"{GRAPHS_BASE}/eda_graphs",
    "balanced": f"{GRAPHS_BASE}/balanced_eda_graphs",
    "normalized": f"{GRAPHS_BASE}/normalized_eda_graphs",
    "smote": f"{GRAPHS_BASE}/smote_comparison_graphs",
    "models": f"{GRAPHS_BASE}/phase2_models/outputs"
}

@app.route("/")
def index():
    graphs = {}
    model_results = None
    
    # Load all graphs
    for section, path in GRAPHS_DIRS.items():
        if os.path.exists(path):
            graphs[section] = sorted([f for f in os.listdir(path) if f.endswith('.png')])
    
    # Load model results
    model_csv = f"{GRAPHS_DIRS['models']}/model_results.csv"
    if os.path.exists(model_csv):
        df = pd.read_csv(model_csv)
        model_results = df.to_dict('records')
    
    return render_template("index.html", graphs=graphs, model_results=model_results)

@app.route("/graph/<section>/<filename>")
def get_graph(section, filename):
    """Serve graph images from various directories"""
    if section not in GRAPHS_DIRS:
        return "Section not found", 404
    
    path = os.path.join(GRAPHS_DIRS[section], filename)
    if not os.path.exists(path):
        return "Image not found", 404
    
    return send_file(path, mimetype='image/png')

if __name__ == "__main__":
    app.run(debug=True)
