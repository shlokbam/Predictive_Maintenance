// PROGRESS BAR
const bar = document.getElementById("progress-bar");
window.addEventListener("scroll", () => {
  const s = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (h > 0 ? (s / h) * 100 : 0) + "%";
  document.getElementById("navbar").classList.toggle("scrolled", s > 40);
  checkReveal();
}, { passive: true });

// HAMBURGER
const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
hamburger.addEventListener("click", () => drawer.classList.toggle("open"));
document.querySelectorAll(".drawer-link").forEach(l => l.addEventListener("click", () => drawer.classList.remove("open")));

// REVEAL
function checkReveal() {
  document.querySelectorAll(".reveal, .reveal-right").forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add("visible");
  });
}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute("href"));
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// SENSOR ANIMATION
function animateSensors() {
  document.querySelectorAll(".anim-val").forEach(el => {
    const vals = el.dataset.vals.split(",");
    let i = 0;
    setInterval(() => {
      i = (i + 1) % vals.length;
      el.style.opacity = "0";
      setTimeout(() => { el.textContent = vals[i].trim(); el.style.opacity = "1"; }, 200);
    }, 2000 + Math.random() * 800);
  });
}

function animateSensorBars() {
  setTimeout(() => {
    document.querySelectorAll(".sensor-fill").forEach(el => {
      const w = el.style.width; el.style.width = "0%";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = "width 1.2s ease"; el.style.width = w;
      }));
    });
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  checkReveal();
  animateSensors();
  animateSensorBars();
});
// PREDICTION FORM LOGIC
const predictionForm = document.getElementById("prediction-form");
const resultsCard = document.getElementById("prediction-results");
const submitBtn = document.getElementById("submit-btn");
const btnLoader = submitBtn.querySelector(".btn-loader");
const btnText = submitBtn.querySelector(".btn-text");

const resPlaceholder = resultsCard.querySelector(".result-placeholder");
const resContent = resultsCard.querySelector(".result-content");
const hybridStatus = document.getElementById("hybrid-status");
const statusDot = resultsCard.querySelector(".status-dot");
const statusMsg = resultsCard.querySelector(".status-message");

if (predictionForm) {
  predictionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(predictionForm);
    const data = Object.fromEntries(formData.entries());
    
    // UI Loading State
    submitBtn.disabled = true;
    btnLoader.classList.remove("hidden");
    btnText.textContent = "Analyzing...";
    
    // Reset Card State
    resultsCard.classList.remove("initial", "safe", "fail");
    resPlaceholder.classList.remove("hidden");
    resContent.classList.add("hidden");
    statusMsg.textContent = "Analyzing Data...";
    statusDot.className = "status-dot pulse";

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
        setTimeout(() => {
          displayHybridResult(result.prediction);
        }, 800); // Small delay for "AI thinking" feel
      } else {
        alert("Error: " + result.message);
        resetResultCard();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while connecting to the server.");
      resetResultCard();
    } finally {
      submitBtn.disabled = false;
      btnLoader.classList.add("hidden");
      btnText.textContent = "Run Diagnostic";
    }
  });
}

function displayHybridResult(prediction) {
  resPlaceholder.classList.add("hidden");
  resContent.classList.remove("hidden");
  
  hybridStatus.textContent = prediction;
  hybridStatus.className = "res-val"; // Reset classes
  
  if (prediction === "No Failure") {
    resultsCard.classList.add("safe");
    hybridStatus.classList.add("text-safe");
    statusMsg.textContent = "Machine Healthy";
    statusDot.className = "status-dot green";
  } else {
    resultsCard.classList.add("fail");
    hybridStatus.classList.add("text-fail");
    statusMsg.textContent = "Failure Detected";
    statusDot.className = "status-dot red";
  }

  // Animation Trigger
  resultsCard.style.transform = "scale(1.02)";
  setTimeout(() => resultsCard.style.transform = "scale(1)", 300);
}

function resetResultCard() {
  resultsCard.classList.add("initial");
  resPlaceholder.classList.remove("hidden");
  resContent.classList.add("hidden");
  statusMsg.textContent = "System Idle";
  statusDot.className = "status-dot";
}

// RANDOMIZATION LOGIC
const randomBtn = document.getElementById("random-btn");
if (randomBtn) {
  randomBtn.addEventListener("click", () => {
    const typeSelect = document.getElementById("type");
    const airTempInput = document.getElementById("air_temp");
    const procTempInput = document.getElementById("process_temp");
    const speedInput = document.getElementById("rot_speed");
    const torqueInput = document.getElementById("torque");
    const wearInput = document.getElementById("tool_wear");

    // Random Machine Type
    const types = ["L", "M", "H"];
    typeSelect.value = types[Math.floor(Math.random() * types.length)];

    // Realistic Ranges
    const airTemp = (Math.random() * (305 - 295) + 295).toFixed(1);
    const procTemp = (parseFloat(airTemp) + Math.random() * (12 - 8) + 8).toFixed(1);
    const speed = Math.floor(Math.random() * (2800 - 1200) + 1200);
    const torque = (Math.random() * (75 - 10) + 10).toFixed(1);
    const wear = Math.floor(Math.random() * 250);

    // Update Inputs with animation
    const updateWithEffect = (el, val) => {
      el.classList.add("highlight-flash");
      el.value = val;
      setTimeout(() => el.classList.remove("highlight-flash"), 400);
    };

    updateWithEffect(airTempInput, airTemp);
    updateWithEffect(procTempInput, procTemp);
    updateWithEffect(speedInput, speed);
    updateWithEffect(torqueInput, torque);
    updateWithEffect(wearInput, wear);
    
    // Add simple CSS class for highlight if not exists
    if (!document.getElementById("flash-style")) {
      const style = document.createElement("style");
      style.id = "flash-style";
      style.textContent = ".highlight-flash { background: rgba(0, 240, 255, 0.2) !important; border-color: #00f0ff !important; }";
      document.head.appendChild(style);
    }
  });
}
