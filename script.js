// ---------- Hero: паралакс blob-ів на mousemove (тільки миша) ----------
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

// ---------- Projects: дані ----------
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

// ---------- Анімація появи карток (CSS + IntersectionObserver) ----------
const REVEAL_STAGGER_MS = 90;   // пауза між картками, що з'являються одночасно
const REVEAL_MAX_STEPS = 5;     // обмеження каскаду, щоб не чекати довго
const REVEAL_DURATION_MS = 600; // має збігатися з transition у style.css

let cardObserver = null;

function revealCards() {
  if (!projectsGrid) return;

  const cards = projectsGrid.querySelectorAll(".card");

  // Скидаємо попереднього спостерігача (при зміні фільтра)
  if (cardObserver) {
    cardObserver.disconnect();
    cardObserver = null;
  }

  if (cards.length === 0) return;

  // Якщо IntersectionObserver недоступний — просто показуємо все без анімації
  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible", "is-settled"));
    return;
  }

  cardObserver = new IntersectionObserver(
    (entries, observer) => {
      let order = 0;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target;

        // Анімація спрацьовує СТРОГО ОДИН РАЗ для кожної картки
        observer.unobserve(card);

        // Каскад рахується в межах поточної "пачки" карток, а не по всьому списку
        const delay = Math.min(order, REVEAL_MAX_STEPS) * REVEAL_STAGGER_MS;
        order += 1;

        card.style.setProperty("--reveal-delay", `${delay}ms`);
        card.classList.add("is-visible");

        // Після завершення появи вмикаємо швидкий ховер (без затримки)
        window.setTimeout(() => {
          card.classList.add("is-settled");
        }, delay + REVEAL_DURATION_MS + 50);
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => cardObserver.observe(card));
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

  // Анімацію запускаємо ПІСЛЯ того, як картки вже додані в DOM
  revealCards();
}

// ---------- Обробники подій фільтрів ----------
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderCards(btn.getAttribute("data-filter"));
  });
});

// ---------- Ініціалізація ----------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => renderCards("all"));
} else {
  renderCards("all");
}
