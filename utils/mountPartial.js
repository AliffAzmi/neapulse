export async function mountPartial(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return;

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${url}`);

  host.innerHTML = await res.text();
}
