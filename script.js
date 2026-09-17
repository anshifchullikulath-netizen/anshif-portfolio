document.addEventListener("DOMContentLoaded", () => {
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => [...document.querySelectorAll(s)];

  // ---------- Smooth scrolling ----------
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ---------- Cursor glow ----------
  const glow = qs(".cursor-glow");
  window.addEventListener("pointermove", (e) => {
    if (!glow) return;
    glow.animate(
      { left: `${e.clientX}px`, top: `${e.clientY}px` },
      { duration: 450, fill: "forwards" }
    );
  });

  // ---------- AI / code particle canvas ----------
  const canvas = qs("#aiCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    particles = Array.from({ length: Math.min(75, Math.floor(innerWidth / 18)) }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.8 + .4
    }));
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function drawAI() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70,210,255,.65)";
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(70,190,255,${(1 - d / 120) * .12})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawAI);
  }
  drawAI();

  // ---------- Typewriter ----------
  const typing = qs("#typingText");
  const roles = [
    "Python Full Stack Developer",
    "Django & React Developer",
    "API & Database Builder",
    "Creative Problem Solver"
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    if (!typing) return;
    const current = roles[roleIndex];
    typing.textContent = current.slice(0, charIndex);
    if (!deleting && charIndex < current.length) charIndex++;
    else if (deleting && charIndex > 0) charIndex--;
    else if (!deleting) { deleting = true; setTimeout(typeLoop, 1300); return; }
    else { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  // ---------- Mobile menu ----------
  const menuBtn = qs(".menu-btn");
  const nav = qs(".nav");
  menuBtn?.addEventListener("click", () => nav.classList.toggle("open"));

  // ---------- GSAP page/scroll animation ----------
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".reveal-home", {
      opacity: 0,
      y: 35,
      duration: 1,
      stagger: .1,
      ease: "power3.out",
      delay: .2
    });

    gsap.to(".hero-visual", {
      yPercent: -7,
      ease: "none",
      scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true }
    });

    qsa(".about-copy > *, .facts, .about-visual").forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 35, duration: .8, delay: i * .05,
        scrollTrigger: { trigger: "#about", start: "top 72%", once: true }
      });
    });

    gsap.from(".project-card", {
      opacity: 0, y: 60, rotateX: 12, duration: .8, stagger: .16,
      ease: "power3.out",
      scrollTrigger: { trigger: ".projects-grid", start: "top 78%", once: true }
    });

    gsap.from(".contact-copy, .contact-form-wrap, .contact-art", {
      opacity: 0, x: (i) => i === 0 ? -35 : 35, duration: .9, stagger: .12,
      scrollTrigger: { trigger: "#contact", start: "top 75%", once: true }
    });

    gsap.to(".quote", {
      y: -15, rotate: -4, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut"
    });

    // Magnetic buttons
    qsa(".magnetic").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * .18, y: y * .18, duration: .35, ease: "power3.out" });
      });
      btn.addEventListener("pointerleave", () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: "elastic.out(1,.4)" }));
    });

    // 3D project cards
    qsa(".tilt").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, duration: .35, transformPerspective: 900 });
      });
      card.addEventListener("pointerleave", () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: .55 }));
    });
  }

  // ---------- Unique navigation transition for each page ----------
  const overlay = qs(".page-transition");
  const grid = qs(".transition-grid");
  const label = qs(".transition-label");

  const transitionStyles = {
    home: { label: "BOOTING / HOME", color: "#10d9ff", rotation: 8 },
    about: { label: "SCANNING / ABOUT", color: "#60a5fa", rotation: -5 },
    work: { label: "LOADING / PROJECTS", color: "#a78bfa", rotation: 12 },
    contact: { label: "OPENING / CONTACT", color: "#22d3ee", rotation: -12 }
  };

  let navigating = false;

  function goTo(target, page) {
    if (navigating) return;
    const el = document.querySelector(target);
    if (!el) return;
    navigating = true;
    nav?.classList.remove("open");

    const s = transitionStyles[page] || transitionStyles.home;
    label.textContent = s.label;
    grid.style.backgroundColor = "#030713";
    grid.style.backgroundImage =
      `linear-gradient(90deg,${s.color} 1px,transparent 1px),linear-gradient(${s.color} 1px,transparent 1px)`;

    if (window.gsap) {
      gsap.set(overlay, { opacity: 1 });
      gsap.fromTo(grid,
        { scale: 2.4, rotate: s.rotation, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: .42, ease: "power4.in" }
      );
      gsap.fromTo(label,
        { y: 18, opacity: 0, letterSpacing: "12px" },
        { y: 0, opacity: 1, letterSpacing: "5px", duration: .38, delay: .08 }
      );
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        qsa(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.page === page));
        gsap.to(grid, { scale: 2.5, rotate: -s.rotation, opacity: 0, duration: .65, ease: "power4.out", delay: .1 });
        gsap.to(label, { opacity: 0, y: -18, duration: .25, delay: .1 });
        gsap.to(overlay, {
          opacity: 0, duration: .1, delay: .7,
          onComplete: () => navigating = false
        });
      }, 420);
    } else {
      el.scrollIntoView({ behavior: "smooth" });
      navigating = false;
    }
  }

  qsa("[data-page]").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      goTo(href, link.dataset.page);
    });
  });

  // Highlight current page while scrolling
  const sections = qsa("section[data-section]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > .45) {
        qsa(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.page === entry.target.dataset.section));
      }
    });
  }, { threshold: [.45] });
  sections.forEach(s => observer.observe(s));

  // ---------- Contact form ----------
  qs("#contactForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const message = form.get("message");
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    qs("#formStatus").textContent = "Opening your email app…";
    window.location.href = `mailto:anshifck249@gmail.com?subject=${subject}&body=${body}`;
  });
});
