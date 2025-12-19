export function initFadeOnScroll(root = document) {
  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  const els = Array.from(root.querySelectorAll("[data-fade]"));
  if (!els.length) return;

  // If reduced motion, just show everything immediately
  if (reduceMotion) {
    for (const el of els) {
      el.classList.remove("opacity-0", "translate-y-6");
      el.classList.add("opacity-100", "translate-y-0");
    }
    return;
  }

  // Ensure baseline transition classes exist (in case some element forgot them)
  for (const el of els) {
    el.classList.add("transition-all", "duration-700", "ease-out");
    // keep your initial hidden state on first paint
    if (!el.classList.contains("opacity-0")) el.classList.add("opacity-0");
    if (!el.classList.contains("translate-y-6"))
      el.classList.add("translate-y-6");
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const el = entry.target;
        const delay = Number(el.getAttribute("data-delay") || "0");

        // apply delay
        el.style.transitionDelay = `${delay}ms`;

        // show
        el.classList.remove("opacity-0", "translate-y-6");
        el.classList.add("opacity-100", "translate-y-0");

        io.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  for (const el of els) io.observe(el);
}
