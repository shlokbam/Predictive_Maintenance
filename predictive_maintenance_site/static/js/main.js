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