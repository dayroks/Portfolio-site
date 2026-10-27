// ---------- Hero: паралакс blob-ів на mousemove ----------
(function initHeroParallax() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const blob1 = hero.querySelector(".blob-1");
  const blob2 = hero.querySelector(".blob-2");
  if (!blob1 || !blob2) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const MAX = 20;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    // Нормалізовані координати від -1 до 1 відносно центру hero
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    // Blob-1 рухається за курсором, blob-2 — в протилежний бік
    blob1.style.transform = `translate(${nx * MAX}px, ${ny * MAX}px)`;
    blob2.style.transform = `translate(${-nx * MAX}px, ${-ny * MAX}px)`;
  });

  hero.addEventListener("mouseleave", () => {
    blob1.style.transform = "translate(0, 0)";
    blob2.style.transform = "translate(0, 0)";
  });
})();