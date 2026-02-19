/* =====================================================
   EduCenter – Centro de Explicações | scripts.js
   ===================================================== */

/* ---------- ANO ATUAL NO FOOTER ---------- */
document.getElementById('currentYear').textContent = new Date().getFullYear();


/* ---------- MENU HAMBÚRGUER / SIDEBAR MOBILE ---------- */
const menuToggle = document.getElementById('menuToggle');
const mainNav    = document.getElementById('mainNav');
const navOverlay = document.getElementById('navOverlay');

function openNav() {
    mainNav.classList.add('open');
    navOverlay.classList.add('open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', true);
    document.body.style.overflow = 'hidden'; // impede scroll do fundo
}

function closeNav() {
    mainNav.classList.remove('open');
    navOverlay.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    mainNav.classList.contains('open') ? closeNav() : openNav();
});

// Fechar ao clicar num link
mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
});

// Fechar ao clicar no overlay
navOverlay.addEventListener('click', closeNav);

// Fechar com tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
});


/* ---------- SCROLL: HEADER SCROLLED + NAV ATIVO ---------- */
const header   = document.getElementById('header');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll() {
    /* Header sombra */
    header.classList.toggle('scrolled', window.scrollY > 20);

    /* Link ativo */
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + current
        );
    });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // estado inicial


/* ---------- SCROLL SUAVE (fallback para browsers sem scroll-behavior) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        // Se o browser suporta scroll-behavior CSS já fica tratado,
        // mas adicionamos um fallback manual para garantia.
        if (!CSS.supports('scroll-behavior', 'smooth')) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY
                        - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || 70);
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});


/* ---------- ANIMAÇÕES DE SCROLL (REVEAL) ---------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Delay escalonado para elementos numa mesma secção
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
            const delay = siblings.indexOf(entry.target) * 100;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Math.min(delay, 400));
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


/* ---------- FORMULÁRIO DE CONTACTO (visual) ---------- */
const form     = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação simples
    const nome     = form.nome.value.trim();
    const email    = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();
    const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome) {
        showFeedback('Por favor, indica o teu nome.', 'error');
        form.nome.focus();
        return;
    }
    if (!emailRx.test(email)) {
        showFeedback('Introduz um email válido.', 'error');
        form.email.focus();
        return;
    }
    if (!mensagem) {
        showFeedback('Escreve a tua mensagem antes de enviar.', 'error');
        form.mensagem.focus();
        return;
    }

    // Simula envio bem-sucedido
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'A enviar…';

    setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Enviar Mensagem';
        showFeedback('✓ Mensagem enviada com sucesso! Entraremos em contacto brevemente.', 'success');
    }, 1200);
});

function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
    // Limpa após 5 segundos
    clearTimeout(feedback._timer);
    feedback._timer = setTimeout(() => {
        feedback.textContent = '';
        feedback.className   = 'form-feedback';
    }, 5000);
}
