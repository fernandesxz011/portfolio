"use strict";

document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const mobileViewport = window.matchMedia("(max-width: 760px)");

function closeMenu(restoreFocus = false) {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  navigation.classList.remove("is-open");
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  navigation.classList.toggle("is-open", open);
});

navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || !mobileViewport.matches) return;
  closeMenu();
  const destination = document.querySelector(link.getAttribute("href"));
  if (destination) {
    destination.setAttribute("tabindex", "-1");
    destination.focus({ preventScroll: true });
    destination.addEventListener(
      "blur",
      () => destination.removeAttribute("tabindex"),
      { once: true },
    );
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  )
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
navigation.addEventListener("focusout", (event) => {
  if (
    !navigation.contains(event.relatedTarget) &&
    event.relatedTarget !== menuButton
  )
    closeMenu();
});
mobileViewport.addEventListener("change", () => closeMenu());

document.querySelector("#current-year").textContent = String(
  new Date().getFullYear(),
);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealObserver;
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("reveal-visible");
        revealObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.06 },
  );
  document
    .querySelectorAll(".about-layout, .project, .ai-note, .timeline-item")
    .forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add("reveal-ready", "reveal-pending");
      revealObserver.observe(element);
    });
}

reducedMotion.addEventListener("change", () => {
  if (!reducedMotion.matches) return;
  revealObserver?.disconnect();
  document
    .querySelectorAll(".reveal-pending")
    .forEach((element) => element.classList.add("reveal-visible"));
});

const visual = document.querySelector(".engineering-visual");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const coordinates = document.querySelector(".visual-coordinate");
let visualFrame = 0;
visual.addEventListener(
  "pointermove",
  (event) => {
    if (!finePointer.matches || reducedMotion.matches || mobileViewport.matches)
      return;
    cancelAnimationFrame(visualFrame);
    visualFrame = requestAnimationFrame(() => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      visual.style.setProperty("--tilt-x", `${(x * 9).toFixed(2)}deg`);
      visual.style.setProperty("--tilt-y", `${(-y * 9).toFixed(2)}deg`);
      coordinates.textContent = `X: ${Math.round(x * 200)} / Y: ${Math.round(y * 200)}`;
    });
  },
  { passive: true },
);
visual.addEventListener("pointerleave", () => {
  cancelAnimationFrame(visualFrame);
  visual.style.setProperty("--tilt-x", "0deg");
  visual.style.setProperty("--tilt-y", "0deg");
  coordinates.textContent = "X: 000 / Y: 000";
});

// Apenas repositórios selecionados: a resposta da API nunca vira HTML.
const repoNames = [
  "trs-serralheria",
  "luia-veiculos",
  "ANALISE-DE-VENDAS-EXCEL",
];
async function refreshRepositories() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(
      "https://api.github.com/users/fernandesxz011/repos?per_page=100",
      {
        signal: controller.signal,
        headers: { Accept: "application/vnd.github+json" },
        credentials: "omit",
        referrerPolicy: "no-referrer",
      },
    );
    if (!response.ok) throw new Error("GitHub indisponível");
    const repositories = await response.json();
    if (!Array.isArray(repositories)) throw new Error("Resposta inválida");
    let updates = 0;
    for (const [index, name] of repoNames.entries()) {
      const repository = repositories.find(
        (item) =>
          item && item.name === name && item.owner?.login === "fernandesxz011",
      );
      if (!repository) continue;
      const row = document.querySelectorAll("#repo-list .repo-row")[index];
      if (
        typeof repository.description === "string" &&
        repository.description.trim()
      ) {
        row.querySelector("small").textContent = repository.description.slice(
          0,
          180,
        );
      }
      if (typeof repository.language === "string")
        row.querySelector(".repo-language").textContent =
          repository.language.slice(0, 30);
      updates += 1;
    }
    if (updates)
      document.querySelector("#repo-status").textContent =
        "DESCRIÇÕES ATUALIZADAS PELA API PÚBLICA DO GITHUB";
  } catch {
    // Conteúdo estático permanece disponível sem rede ou com limite de API.
    document.querySelector("#repo-status").textContent =
      "SELEÇÃO DE REPOSITÓRIOS · CONSULTE AS ATUALIZAÇÕES NO GITHUB";
  } finally {
    window.clearTimeout(timeout);
  }
}

if ("IntersectionObserver" in window) {
  const repositoryObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      refreshRepositories();
    },
    { rootMargin: "200px" },
  );
  repositoryObserver.observe(document.querySelector("#github"));
}
