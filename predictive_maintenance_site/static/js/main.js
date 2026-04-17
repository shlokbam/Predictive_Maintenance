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
const resultsGrid = document.getElementById("prediction-results");
const submitBtn = document.getElementById("submit-btn");
const btnLoader = submitBtn.querySelector(".btn-loader");
const btnText = submitBtn.querySelector(".btn-text");

if (predictionForm) {
  predictionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(predictionForm);
    const data = Object.fromEntries(formData.entries());
    
    // UI Loading State
    submitBtn.disabled = true;
    btnLoader.classList.remove("hidden");
    btnText.textContent = "Analyzing...";
    resultsGrid.classList.add("hidden");
    
    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
        displayResults(result.predictions);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while connecting to the server.");
    } finally {
      submitBtn.disabled = false;
      btnLoader.classList.add("hidden");
      btnText.textContent = "Run Diagnostic";
    }
  });
}

function displayResults(predictions) {
  resultsGrid.classList.remove("hidden");
  
  for (const [model, status] of Object.entries(predictions)) {
    const card = document.querySelector(`.res-card[data-model="${model}"]`);
    if (card) {
      const statusEl = card.querySelector(".res-status");
      statusEl.textContent = status;
      
      // Remove old status classes
      statusEl.parentElement.classList.remove("status-safe", "status-fail");
      
      // Add new status class
      if (status === "No Failure") {
        statusEl.parentElement.classList.add("status-safe");
      } else {
        statusEl.parentElement.classList.add("status-fail");
      }

      // Small bounce animation
      card.style.transform = "scale(1.05)";
      setTimeout(() => card.style.transform = "scale(1)", 200);
    }
  }
  
  // Scroll to results if on mobile
  if (window.innerWidth < 768) {
    resultsGrid.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}
