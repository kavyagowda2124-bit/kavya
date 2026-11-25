document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");
  const toTop = document.querySelector(".to-top");
  const sections = document.querySelectorAll("main section[id]");

  // Mobile menu
  const closeMenu = () => {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  // Header background + back-to-top button
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Active nav link while scrolling
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));

  // Reveal on scroll + animate skill bars
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        entry.target.querySelectorAll(".bar-fill").forEach((bar) => {
          bar.style.width = `${bar.dataset.level}%`;
        });
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // Typing effect
  const typedEl = document.querySelector(".typed");
  const words = ["Aspiring Full Stack Developer", "Full Stack Web Developer", "BCA Graduate", "Problem Solver", "Lifelong Learner"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const type = () => {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, charIndex);

    let delay = deleting ? 45 : 90;
    if (!deleting && charIndex === word.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }
    setTimeout(type, delay);
  };
  if (reduceMotion) typedEl.textContent = words[0];
  else type();

  // Contact form validation
  const form = document.querySelector(".form");
  const status = document.querySelector(".form-status");
  const setError = (field, message) => {
    const input = form.elements[field];
    input.setAttribute("aria-invalid", message ? "true" : "false");
    document.getElementById(`${field}-error`).textContent = message;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    let valid = true;

    setError("name", name ? "" : "Please enter your name.");
    if (!name) valid = false;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError("email", emailOk ? "" : "Please enter a valid email address.");
    if (!emailOk) valid = false;

    setError("message", message.length >= 10 ? "" : "Message should be at least 10 characters.");
    if (message.length < 10) valid = false;

    if (!valid) {
      status.textContent = "";
      return;
    }

    status.textContent = `Thanks, ${name}! Your message has been received. I'll get back to you soon.`;
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
