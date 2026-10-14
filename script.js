/* =========================================================
   RainCode AI — Landing interactions
   - Data-driven app showcase cards (single source of truth)
   - Sticky nav state, mobile menu, scroll reveal
   ========================================================= */

/* ---- App data: one object per product = reusable card component ---- */
const APPS = [
  {
    name: "Quill",
    accent: "var(--c-quill)",
    initial: "Q",
    logo: "assets/logos/quill.png",
    tagline: "Professional quotes without the paperwork.",
    desc: "Turn rough job notes into polished estimates, branded PDFs, and client-ready proposals in minutes. Generate, edit, send, and track quotes without losing hours to paperwork.",
    builtFor: "Contractors, landscapers, HVAC, roofing, electricians & plumbers",
    video: "kNlxZ_qiTcw", // YouTube video ID
    signup: "https://rainquill.app/signup",
    action: "Get started with Quill",
  },
  {
    name: "Frontdesk",
    accent: "var(--c-frontdesk)",
    initial: "F",
    logo: "assets/logos/frontdesk.png",
    tagline: "Answer website inquiries while you're on the job.",
    desc: "An embeddable AI chat widget that answers questions from your business information, captures leads, and directs visitors to your booking link — even outside business hours.",
    builtFor: "Contractors, trades & local service businesses",
    video: "_jMp_eVAXaE", // YouTube video ID
    signup: "https://frontdesk-eight.vercel.app/signup",
    action: "Start Frontdesk's 14-day trial",
    note: "No card required. Trial usage limits apply.",
  },
];

const DEMO_MAILTO =
  "mailto:RainCodeAI@proton.me?subject=RainCode%20AI%20Demo%20Request%20%E2%80%94%20{APP}&body=Hi%20RainCode%20AI%2C%0A%0AI'd%20like%20to%20learn%20more%20about%20{APP}.%0A%0ABusiness%20name%3A%0AWhat%20I'm%20trying%20to%20solve%3A%0A";

/* ---- Render app cards ---- */
function renderApps() {
  const grid = document.getElementById("appsGrid");
  if (!grid) return;

  grid.innerHTML = APPS.map((app, i) => {
    const mailto = DEMO_MAILTO.replace(/\{APP\}/g, encodeURIComponent(app.name));
    const idx = String(i + 1).padStart(2, "0");
    // Logo image with graceful fallback: if it fails to load, show the letter badge.
    const icon = app.logo
      ? `<div class="app-card__icon app-card__icon--img" aria-hidden="true"><img src="${app.logo}" alt="" loading="lazy" onerror="this.parentElement.classList.remove('app-card__icon--img');this.parentElement.textContent='${app.initial}';"></div>`
      : `<div class="app-card__icon" aria-hidden="true">${app.initial}</div>`;
    const watch = app.video
      ? `<button type="button" class="app-card__cta app-card__cta--watch" data-video="${app.video}" data-video-title="${app.name} demo"><span aria-hidden="true">&#9654;</span> Watch demo</button>`
      : "";
    return `
      <article class="app-card reveal" style="--accent:${app.accent}">
        <span class="app-card__idx" aria-hidden="true">${idx}</span>
        <div class="app-card__top">
          ${icon}
          <div>
            <h3 class="app-card__name">${app.name} <span class="app-card__status">Live</span></h3>
            <div class="app-card__tag">${app.tagline}</div>
          </div>
        </div>
        <p class="app-card__desc">${app.desc}</p>
        <p class="app-card__built">Built for: <b>${app.builtFor}</b></p>
        <div class="app-card__foot">
          <a class="app-card__cta app-card__cta--try" href="${app.signup}">${app.action} <span aria-hidden="true">&rarr;</span></a>
          ${watch}
        </div>
        ${app.note ? `<p class="app-card__note">${app.note}</p>` : ""}
        <div class="app-card__secondary">
          ${app.name === "Frontdesk" ? `<button type="button" class="app-card__cta" data-try-frontdesk>Try the live demo <span aria-hidden="true">&rarr;</span></button>` : ""}
          <a class="app-card__cta" href="${mailto}">Book a Demo <span aria-hidden="true">&rarr;</span></a>
        </div>
        ${app.name === "Frontdesk" ? `<p class="frontdesk-status" role="status" aria-live="polite"></p>` : ""}
      </article>`;
  }).join("");
}

/* ---- Open the installed Frontdesk embed from either CTA ---- */
function initFrontdeskDemo() {
  const prompt = "I run a small service business. How can Frontdesk handle customer questions and capture new leads?";
  let pending = null;

  const openWidget = () => {
    const shadow = document.getElementById("frontdesk-widget-container")?.shadowRoot;
    const trigger = shadow?.getElementById("lb-trigger");
    const input = shadow?.getElementById("lb-input");
    if (!trigger || !input) return false;

    // The current embed exposes no public open/prefill API. Its open shadow root
    // lets the site use the same trigger a visitor would click.
    if (trigger.getAttribute("aria-expanded") !== "true") trigger.click();
    if (!input.disabled && !input.value.trim()) input.value = prompt;
    if (!input.disabled) input.focus();
    return true;
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-try-frontdesk]");
    if (!button) return;
    const status = button.closest(".app-card")?.querySelector(".frontdesk-status")
      || document.getElementById("frontdeskStatus");
    if (pending) {
      pending.observer.disconnect();
      clearTimeout(pending.timeout);
      pending.status.textContent = "";
      pending = null;
    }
    status.textContent = "Opening Frontdesk…";
    if (openWidget()) {
      status.textContent = "";
      return;
    }

    // Bot configuration is fetched asynchronously after widget.js loads.
    const observer = new MutationObserver(() => {
      if (!openWidget()) return;
      observer.disconnect();
      clearTimeout(timeout);
      status.textContent = "";
      pending = null;
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observer.disconnect();
      status.textContent = "Frontdesk is unavailable right now. Please use Book a Demo to contact us.";
      pending = null;
    }, 10000);
    pending = { observer, timeout, status };
  });
}

/* ---- Demo video modal (one shared <dialog> for every card) ---- */
function initVideoModal() {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoModalFrame");
  if (!modal || !frame || typeof modal.showModal !== "function") return;

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-video]");
    if (!button) return;
    const id = encodeURIComponent(button.dataset.video);
    // The iframe is only created on open, so YouTube loads nothing until a visitor asks.
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
      title="${button.dataset.videoTitle || "Demo video"}"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    modal.showModal();
  });

  // Clicking the dimmed backdrop (the dialog itself, outside its panel) closes it.
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  // Esc, the close button, and backdrop clicks all land here: remove the iframe to stop playback.
  modal.addEventListener("close", () => {
    frame.innerHTML = "";
  });
}

/* ---- Scroll reveal ----
   Robust by design: content is never left hidden.
   1) Anything already in the viewport reveals immediately.
   2) An observer animates the rest as they scroll in.
   3) A safety timeout reveals everything if the observer never fires. */
function initReveal() {
  const items = [...document.querySelectorAll(".reveal")];
  const revealAll = () => items.forEach((el) => el.classList.add("in"));

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  const inViewport = (el) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh * 0.92 && r.bottom > 0;
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => {
    if (inViewport(el)) el.classList.add("in"); // above-the-fold: show now
    else io.observe(el);
  });

  // Ultimate fallback: never leave content invisible.
  setTimeout(revealAll, 1500);
}

/* ---- Sticky nav + mobile menu ---- */
function initNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("navToggle");
  if (!nav) return;

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close menu after tapping a link
    nav.querySelectorAll(".nav__links a, .nav__cta a").forEach((link) =>
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }
}

/* ---- Scroll-spy: highlight the nav link for the section in view ---- */
function initScrollSpy() {
  const links = [...document.querySelectorAll(".nav__links a")];
  const map = new Map();
  links.forEach((l) => {
    const id = l.getAttribute("href");
    if (id && id.startsWith("#")) {
      const sec = document.querySelector(id);
      if (sec) map.set(sec, l);
    }
  });
  if (!map.size || !("IntersectionObserver" in window)) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const link = map.get(entry.target);
          if (link) link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  map.forEach((_, sec) => spy.observe(sec));
}

/* ---- Contact form (FormSubmit AJAX) ---- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("cfStatus");
  const submit = document.getElementById("cfSubmit");

  document.querySelectorAll("[data-rainagent-interest]").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("cf-app").value = "RainAgent";
    });
  });

  const setStatus = (msg, type) => {
    status.textContent = msg;
    status.classList.remove("is-success", "is-error");
    if (type) status.classList.add("is-" + type);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot: if filled, silently pretend success (it's a bot)
    if (form.querySelector(".contact__honey")?.value) {
      setStatus("Thanks — message sent.", "success");
      form.reset();
      return;
    }

    // Native validation
    if (!form.checkValidity()) {
      setStatus("Please fill in your name, a valid email, and a message.", "error");
      form.reportValidity();
      return;
    }

    form.classList.add("is-sending");
    setStatus("Sending…", null);

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json().catch(() => ({}));
      // FormSubmit returns HTTP 200 even for non-success states (e.g. needs
      // activation), so check its actual success flag, not just res.ok.
      const ok = res.ok && (data.success === true || data.success === "true");

      if (ok) {
        setStatus("Thanks! Your message is on its way — we'll reply within one business day.", "success");
        form.reset();
      } else {
        const msg = data && data.message ? data.message : "Something went wrong.";
        setStatus(msg + " You can also email RainCodeAI@proton.me directly.", "error");
      }
    } catch (err) {
      setStatus("Couldn't send right now. Please email RainCodeAI@proton.me directly.", "error");
    } finally {
      form.classList.remove("is-sending");
    }
  });
}

/* ---- Init ---- */
document.addEventListener("DOMContentLoaded", () => {
  renderApps();
  initFrontdeskDemo();
  initVideoModal();
  initReveal();
  initNav();
  initScrollSpy();
  initContactForm();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
