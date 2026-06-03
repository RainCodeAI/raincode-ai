/* =========================================================
   RainCode AI — Landing interactions
   - Data-driven app showcase cards (single source of truth)
   - Sticky nav state, mobile menu, scroll reveal
   ========================================================= */

/* ---- App data: one object per product = reusable card component ---- */
const APPS = [
  {
    name: "Frontdesk",
    accent: "var(--c-frontdesk)",
    initial: "F",
    logo: "assets/logos/frontdesk.png",
    tagline: "Never miss another customer inquiry.",
    desc: "An embeddable AI chat widget that answers customer questions, qualifies leads, and keeps potential clients engaged automatically — set up once, working 24/7 without you online.",
    builtFor: "Local businesses, contractors, clinics, agencies & service companies",
  },
  {
    name: "Quill",
    accent: "var(--c-quill)",
    initial: "Q",
    logo: "assets/logos/quill.png",
    tagline: "Professional quotes without the paperwork.",
    desc: "Turn rough job notes into polished estimates, branded PDFs, and client-ready proposals in minutes. Generate, edit, send, and track quotes without losing hours to paperwork.",
    builtFor: "Contractors, landscapers, HVAC, roofing, electricians & plumbers",
  },
  {
    name: "Replo",
    accent: "var(--c-replo)",
    initial: "R",
    logo: "assets/logos/replo.png",
    tagline: "Stay responsive without living in your reviews tab.",
    desc: "Syncs incoming Google reviews and drafts polished AI responses for you to approve and publish from one dashboard — stay professional and responsive without the manual grind.",
    builtFor: "Restaurants, clinics, salons, gyms, contractors & retail shops",
  },
  {
    name: "Relay",
    accent: "var(--c-relay)",
    initial: "R",
    logo: "assets/logos/relay.png",
    tagline: "No more missed handoffs or end-of-shift chaos.",
    desc: "Staff scan a QR code, enter a PIN, and submit a structured shift note. Relay organizes handoffs with AI, flags urgent issues, and sends owners a daily operational briefing.",
    builtFor: "Restaurants, retail, gyms, warehouses & clinics with rotating staff",
  },
  {
    name: "ExecFlow",
    accent: "var(--c-execflow)",
    initial: "E",
    logo: "assets/logos/execflow.png",
    tagline: "Your executive assistant, without the payroll.",
    desc: "Cuts admin overload with inbox triage, AI-assisted email drafting, scheduling support, calendar coordination, reminders, and executive-style daily summaries.",
    builtFor: "Founders, consultants, contractors & agencies",
  },
  {
    name: "SiteAssist",
    accent: "var(--c-siteassist)",
    initial: "S",
    logo: "assets/logos/siteassist.png",
    tagline: "Run the field without drowning in admin.",
    desc: "Manages job intake, estimate drafting, scheduling, reminders, follow-ups, invoice prep, lead capture, and voice/photo field notes in one streamlined workflow.",
    builtFor: "Contractors, landscaping & field-service businesses with mobile crews",
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
    return `
      <article class="app-card reveal" style="--accent:${app.accent}">
        <span class="app-card__idx" aria-hidden="true">${idx}</span>
        <div class="app-card__top">
          ${icon}
          <div>
            <div class="app-card__name">${app.name}</div>
            <div class="app-card__tag">${app.tagline}</div>
          </div>
        </div>
        <p class="app-card__desc">${app.desc}</p>
        <p class="app-card__built">Built for: <b>${app.builtFor}</b></p>
        <div class="app-card__foot">
          <a class="app-card__cta" href="${mailto}">Book a Demo <span aria-hidden="true">&rarr;</span></a>
          <span class="app-card__shot" title="Screenshot coming soon">Preview soon</span>
        </div>
      </article>`;
  }).join("");
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
  initReveal();
  initNav();
  initScrollSpy();
  initContactForm();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
