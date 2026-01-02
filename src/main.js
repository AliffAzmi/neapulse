import "./style.css";
import { mountPartial } from "/utils/mountPartial.js";
import { initFadeOnScroll } from "/utils/fadeOnScroll.js";

function shouldAutoplayVideo() {
  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const saveData = conn?.saveData === true;
  const slowNet = ["slow-2g", "2g"].includes(conn?.effectiveType);
  return !(reduceMotion || saveData || slowNet);
}

function initHeroVideo() {
  const video = document.getElementById("heroVideo");
  const hint = document.getElementById("heroVideoHint");
  if (!video) return;

  const canAuto = shouldAutoplayVideo();

  if (!canAuto) {
    // Keep poster; show hint
    hint?.classList.remove("hidden");
    video.classList.add("opacity-100"); // show poster nicely
    return;
  }

  // Attach sources only when allowed (prevents full download on restricted scenarios)
  const sources = [{ src: "/neapulse_app_vid_rec2.mp4", type: "video/mp4" }];

  for (const s of sources) {
    const el = document.createElement("source");
    el.src = s.src;
    el.type = s.type;
    video.appendChild(el);
  }

  video.autoplay = true;

  // Attempt playback; if blocked, we gracefully fallback to poster
  video
    .play()
    .then(() => {
      video.classList.add("opacity-100");
    })
    .catch(() => {
      hint?.classList.remove("hidden");
      video.classList.add("opacity-100");
    });

  // Make sure it fades in even if play takes time
  video.addEventListener("loadeddata", () => {
    video.classList.add("opacity-100");
  });
}

function centerTrustedBrand() {
  const el = document.querySelector("[data-center]");
  if (!el) return;

  const scroller = el.closest(".overflow-x-auto");
  if (!(scroller instanceof HTMLElement)) return;

  // Delay ensures layout + fonts are ready.
  // Avoid `scrollIntoView()` here because it can also scroll vertically on reload.
  requestAnimationFrame(() => {
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    if (maxScrollLeft <= 0) return;

    const elLeft = el.offsetLeft;
    const target = elLeft - (scroller.clientWidth / 2 - el.clientWidth / 2);
    const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, target));
    scroller.scrollLeft = nextScrollLeft;
  });
}

function initMobileMenu() {
  const button = document.getElementById("mobileMenuButton");
  const menu = document.getElementById("mobileMenu");
  if (!button || !menu) return;

  const mql = window.matchMedia?.("(min-width: 768px)");
  const isOpen = () => !menu.classList.contains("hidden");

  const setOpen = (open) => {
    menu.classList.toggle("hidden", !open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const toggle = () => setOpen(!isOpen());

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener("click", (e) => {
    if (!isOpen()) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (menu.contains(target) || button.contains(target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  menu
    .querySelectorAll("a[href]")
    .forEach((a) => a.addEventListener("click", () => setOpen(false)));

  window.addEventListener("resize", () => {
    if (mql?.matches) setOpen(false);
  });
}

function activeNavMenuItem() {
  const items = document.querySelectorAll(".menu-nav a[href]");

  const update = () => {
    const hash = window.location.hash;
    items.forEach((el) =>
      el.classList.toggle("active", el.getAttribute("href") === hash)
    );
  };

  items.forEach((el) =>
    el.addEventListener("click", () => {
      items.forEach((i) => i.classList.remove("active"));
      el.classList.add("active");
    })
  );

  update();
  window.addEventListener("hashchange", update);
}

async function boot() {
  await mountPartial("#features", "/partials/features.html");
  await mountPartial("#how-it-works", "/partials/how-it-works.html");
  await mountPartial("#pricing", "/partials/pricing.html");
  await mountPartial("#final-cta", "/partials/final-cta.html");
  await mountPartial("#footer", "/partials/footer.html");
  initHeroVideo();
  initMobileMenu();
  initFadeOnScroll();
  centerTrustedBrand();
  activeNavMenuItem();

  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
