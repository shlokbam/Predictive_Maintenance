// ── PROGRESS BAR ──
const bar = document.getElementById("progress-bar");
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = pct + "%";
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById("navbar");
function updateNav() {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}

// ── HAMBURGER ──
const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
hamburger.addEventListener("click", () => {
  drawer.classList.toggle("open");
});
document.querySelectorAll(".drawer-link").forEach(l => {
  l.addEventListener("click", () => drawer.classList.remove("open"));
});

// ── REVEAL ON SCROLL ──
function checkReveal() {
  const elements = document.querySelectorAll(".reveal, .reveal-right");
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88) {
      el.classList.add("visible");
    }
  });
}

// ── BIAS BARS ──
function animateBiasBars() {
  document.querySelectorAll(".bias-bar-fill").forEach(el => {
    const rect = el.closest("section")?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight * 0.9) {
      const target = el.dataset.width;
      if (el.style.width === "0px" || el.style.width === "" || el.style.width === "0%") {
        el.style.width = target + "%";
      }
    }
  });
}

// ── SENSOR VALUE ANIMATION ──
function animateSensors() {
  document.querySelectorAll(".anim-val").forEach(el => {
    const vals = el.dataset.vals.split(",");
    let i = 0;
    setInterval(() => {
      i = (i + 1) % vals.length;
      el.style.opacity = "0";
      setTimeout(() => {
        el.textContent = vals[i].trim();
        el.style.opacity = "1";
      }, 200);
    }, 2000 + Math.random() * 1000);
  });
}

// ── MINI DIST CHART ──
function buildDistChart() {
  const el = document.getElementById("chart-dist");
  if (!el) return;
  // Normal distribution approximation
  const data = [3, 8, 18, 34, 50, 70, 90, 108, 118, 120, 115, 104, 90, 72, 52, 34, 20, 10, 5, 2];
  const max = Math.max(...data);
  const colors = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#a78bfa"];
  let offset = 0;
  for (let i = 0; i < data.length; i++) {
    const d = document.createElement("div");
    d.className = "eda-bar";
    d.style.height = (data[i] / max * 100) + "%";
    d.style.background = colors[Math.floor(i / 4) % colors.length];
    d.style.opacity = "0.75";
    d.title = `Value: ${data[i]}`;
    el.appendChild(d);
    offset++;
  }
}

// ── CORRELATION HEATMAP ──
function buildHeatmap() {
  const el = document.getElementById("heatmap");
  if (!el) return;
  const labels = ["AirT", "ProcT", "RPM", "Torq", "Wear", "Tgt"];
  const matrix = [
    [1.00, 0.88, -0.10, 0.08, 0.05, 0.12],
    [0.88, 1.00, -0.09, 0.10, 0.04, 0.10],
    [-0.10,-0.09, 1.00, -0.87, 0.04, -0.06],
    [0.08, 0.10, -0.87, 1.00, 0.02, 0.08],
    [0.05, 0.04, 0.04, 0.02, 1.00, 0.09],
    [0.12, 0.10, -0.06, 0.08, 0.09, 1.00]
  ];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const val = matrix[r][c];
      const cell = document.createElement("div");
      cell.className = "hm-cell";
      cell.textContent = val.toFixed(2);
      const abs = Math.abs(val);
      let bg;
      if (val > 0.5) bg = `rgba(59,130,246,${0.3 + abs * 0.5})`;
      else if (val < -0.5) bg = `rgba(239,68,68,${0.3 + abs * 0.5})`;
      else if (val > 0.1) bg = `rgba(59,130,246,${abs * 0.5})`;
      else if (val < -0.1) bg = `rgba(239,68,68,${abs * 0.5})`;
      else bg = "rgba(255,255,255,0.04)";
      cell.style.background = bg;
      cell.title = `${labels[r]} vs ${labels[c]}: ${val.toFixed(2)}`;
      el.appendChild(cell);
    }
  }
}

// ── SMOOTH SCROLL FOR NAV ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ── SCROLL HANDLER ──
window.addEventListener("scroll", () => {
  updateProgress();
  updateNav();
  checkReveal();
  animateBiasBars();
}, { passive: true });

// ── INIT ──
document.addEventListener("DOMContentLoaded", () => {
  buildDistChart();
  buildHeatmap();
  animateSensors();
  checkReveal();
  updateProgress();
  updateNav();

  // Sensor bar fill widths animate in
  setTimeout(() => {
    document.querySelectorAll(".sensor-fill").forEach(el => {
      const w = el.style.width;
      el.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = "width 1.2s ease";
          el.style.width = w;
        });
      });
    });
  }, 300);
});
