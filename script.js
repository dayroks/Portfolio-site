// ---------- GSAP Init ----------
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    blob1.style.transform = `translate(${nx * MAX}px, ${ny * MAX}px)`;
    blob2.style.transform = `translate(${-nx * MAX}px, ${-ny * MAX}px)`;
  });

  hero.addEventListener("mouseleave", () => {
    blob1.style.transform = "translate(0, 0)";
    blob2.style.transform = "translate(0, 0)";
  });
})();

// ---------- Projects: Дані та рендеринг ----------
const projects = [
  {
    title: "Telegram Mini App",
    tagline: "Зручний магазин всередині Telegram з оплатою.",
    category: "mini-app",
    stack: ["React", "Telegram SDK", "Tailwind"],
    cover: "covers/placeholder.webp",
    demo: "#",
    github: "#"
  },
  {
    title: "AI Бот-асистент",
    tagline: "Розумний помічник для підтримки клієнтів 24/7.",
    category: "bot",
    stack: ["Node.js", "Grammy", "OpenAI API"],
    cover: "covers/placeholder.webp",
    demo: "#",
    github: "#"
  },
  {
    title: "Генератор зображень",
    tagline: "Сервіс для створення унікальних ілюстрацій.",
    category: "ai",
    stack: ["Python", "FastAPI", "Stable Diffusion"],
    cover: "covers/placeholder.webp",
    demo: "#",
    github: "#"
  },
  {
    title: "Landing Page",
    tagline: "Промо-сайт з анімаціями для IT-стартапу.",
    category: "web",
    stack: ["HTML", "CSS", "GSAP"],
    cover: "covers/placeholder.webp",
    demo: "#",
    github: "#"
  }
];

const projectsGrid = document.getElementById("projects-grid");
const filterButtons = document.querySelectorAll(".filters button");

// ---------- Анімації появи карток ----------
function initAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.from('.card', {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#projects-grid',
      start: 'top 85%',
    }
  });
}

// ---------- Рендеринг карток ----------
function renderCards(filter) {
  if (!projectsGrid) return;

  const filtered = projects.filter(
    (project) => filter === "all" || project.category === filter
  );

  projectsGrid.innerHTML = filtered
    .map((project) => {
      const tagsHtml = project.stack
        .map((tech) => `<span class="tag">${tech}</span>`)
        .join("");

      return `
        <article class="card">
          <img class="card-img" src="${project.cover}" alt="${project.title}" loading="lazy">
          <div class="card-content">
            <h3>${project.title}</h3>
            <p class="tagline">${project.tagline}</p>
            <div class="tags">${tagsHtml}</div>
            <div class="card-links">
              <a href="${project.demo}" target="_blank" rel="noopener">Demo</a>
              <a href="${project.github}" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  // Викликаємо анімацію після оновлення DOM
  initAnimations();

  // Оновлюємо позиції тригерів, якщо GSAP доступний
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// ---------- Обробники подій фільтрів ----------
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    
    const filterValue = btn.getAttribute("data-filter");
    renderCards(filterValue);
  });
});

// ---------- Ініціалізація ----------
document.addEventListener("DOMContentLoaded", () => {
  renderCards("all");
});