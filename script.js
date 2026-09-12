/* ═══════════════════════════════════════════════════════════════
   MAURÍCIO PATES · PORTFÓLIO TÉCNICO
   script.js — v10 (só 1 stat big + 3 small, sem chevrons)
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ─────────────────────────────────────────────
   UTIL — escolhe campo consoante idioma
───────────────────────────────────────────── */
function field(obj, key) {
  if (!obj) return '';
  const lang = (window.Lang && Lang.current) ? Lang.current() : 'pt';
  if (lang === 'en') {
    return obj[key + '_en'] !== undefined ? obj[key + '_en'] : (obj[key] || '');
  }
  return obj[key] !== undefined ? obj[key] : '';
}

/* ─────────────────────────────────────────────
   IMAGE FALLBACK
───────────────────────────────────────────── */
const ImageFallback = (() => {
  const CANDIDATES = ['.png', '.PNG', '.jpg', '.JPG', '.jpeg', '.JPEG', '.webp', '.WEBP'];

  function attach(img) {
    if (!img || img.dataset.fbBound) return;
    img.dataset.fbBound = '1';
    if (img.hasAttribute('onerror')) return;

    const tried = new Set();
    const baseSrc = img.getAttribute('src') || '';
    const dotIdx = baseSrc.lastIndexOf('.');
    if (dotIdx < 0) return;
    const base = baseSrc.slice(0, dotIdx);
    tried.add(baseSrc.slice(dotIdx));

    img.addEventListener('error', () => {
      for (const ext of CANDIDATES) {
        if (tried.has(ext)) continue;
        tried.add(ext);
        img.src = base + ext;
        return;
      }
      img.classList.add('img-error');
      console.warn('[ImageFallback] Nenhuma variante encontrada para:', base);
    });
  }

  function init() {
    $$('img[data-fallback-id], .hero-photo, .skill-tile img, .project-block-media img, .er-detail-img').forEach(attach);
  }
  function observe(container) {
    if (!container) return;
    container.querySelectorAll('img').forEach(attach);
  }

  return { init, attach, observe };
})();

/* ─────────────────────────────────────────────
   MÓDULO 1 — DATA
───────────────────────────────────────────── */
const Data = (() => {
  let cache = null;
  const FALLBACK = {
    skills: [], chart: [], projects: [], formacao: [], certificados: []
  };

  async function load() {
    if (cache) return cache;
    try {
      const res = await fetch('data.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      cache = await res.json();
      console.info('[Data] data.json carregado.');
    } catch (e) {
      console.warn('[Data] A usar fallback.', e.message);
      cache = FALLBACK;
    }
    return cache;
  }
  return { load };
})();

/* ─────────────────────────────────────────────
   MÓDULO 2 — I18N
───────────────────────────────────────────── */
const I18N = {
  pt: {
    'nav.perfil':'Perfil','nav.projetos':'Projetos','nav.formacao':'Formação','nav.sobre':'Sobre','nav.contacto':'Contacto',
    'hero.eyebrow':'Disponível para Formação em Contexto de Trabalho · nov 2026',
    'hero.title':'Desenvolvedor Fullstack & Analista de Dados',
    'hero.stack':'Python · SQL · Fullstack — Especialista em Sistemas de Informação (TPSI). Pipelines ETL, modelação de dados e desenvolvimento de aplicações.',
    'hero.projects':'Ver Projetos','hero.badge':'Técnico Esp. TPSI · IEFP Porto',
    'dashboard.tag':'// dashboard','dashboard.title':'Competências técnicas',
    'dashboard.sub':'Stack em desenvolvimento ativo no CET TPSI (IEFP Porto) e aplicada em projetos práticos.',
    'chart.tag':'// distribuição','chart.title':'Projetos por área técnica',
    'projects.tag':'// projetos','projects.highlightTitle':'Projeto em destaque',
    'projects.highlightSub':'O projeto principal do portfólio, com arquitetura completa e terminal interativo.',
    'projects.code':'Ver código ↗','projects.process':'Ver processo','projects.processClose':'Fechar processo',
    'er.tag':'// outros projetos','er.title':'Demais Trabalhos Técnicos',
    'er.sub':'Esquema relacional dos restantes projetos — clica em cada tabela para veres o detalhe.',
    'er.close':'Fechar','er.prev':'Projeto anterior','er.next':'Próximo projeto',
    'formacao.tag':'// formação','formacao.title':'Percurso académico & técnico',
    'formacao.sub':'Formação técnica especializada e certificações complementares ao longo dos últimos anos.',
    'lab.tag':'// laboratório técnico','lab.title':'Ambiente de prática',
    'lab.desc':'Infraestrutura própria para testar, versionar e automatizar — o mesmo ambiente que uso nos projetos.',
    'lab.proxmox.t':'Proxmox VE','lab.proxmox.d':'Virtualização de servidores e ambientes isolados para testes',
    'lab.linux.t':'Linux (Ubuntu)','lab.linux.d':'Administração, permissões e automação por linha de comando',
    'lab.git.t':'Git & GitHub','lab.git.d':'Branches, merges, resolução de conflitos e controlo de versões',
    'lab.ia.t':'Claude AI & Agentes','lab.ia.d':'Automação assistida por IA no desenvolvimento e análise',
    'certs.tag':'// certificações','certs.title':'Certificados complementares',
    'sobre.tag':'// sobre','sobre.title':'Um pouco mais sobre mim',
    'sobre.p1':'Mais de 10 anos em análise de dados comerciais, atualmente em transição para a área tecnológica, unindo a visão prática do setor comercial e o rigor da hotelaria ao desenvolvimento de aplicações modernas. Com foco em Python, bases de dados relacionais e desenvolvimento Web, aplico raciocínio analítico para transformar processos em código funcional e automatizado através do curso TPSI (IEFP Porto).',
    'sobre.p2':'Construí um sistema de gestão para 22 unidades de alojamento em Python e MySQL, e um pipeline de importação de dados públicos para MySQL — aplicando à programação o mesmo raciocínio analítico da experiência anterior.',
    'sobre.p3':'Disponível para Formação em Contexto de Trabalho (ECT) a partir de novembro de 2026.',
    'sobre.cv':'Descarregar CV','sobre.local':'Localização','sobre.email':'Email','sobre.formacao':'Formação','sobre.langs':'Idiomas',
    'contacto.tag':'// contacto','contacto.title':'Vamos falar',
    'contacto.sub':'Propostas de Formação em Contexto de Trabalho, colaborações ou conversa técnica — envia mensagem.',
    'form.name':'Nome','form.name.ph':'O teu nome','form.email':'Email','form.email.ph':'nome@empresa.com',
    'form.message':'Mensagem','form.message.ph':'Como podemos colaborar?','form.submit':'Enviar mensagem','form.sending':'A enviar...',
    'form.success':'✓ Mensagem enviada. Obrigado!','form.error':'✕ Falha ao enviar. Tenta novamente.',
    'form.err.name':'Mínimo 3 caracteres.','form.err.email':'Email inválido.','form.err.message':'Mínimo 10 caracteres.',
    'form.err.generic':'Corrige os campos assinalados.',
    'footer.made':'feito com HTML, CSS e JS puro'
  },
  en: {
    'nav.perfil':'Profile','nav.projetos':'Projects','nav.formacao':'Education','nav.sobre':'About','nav.contacto':'Contact',
    'hero.eyebrow':'Available for Work Context Training · Nov 2026',
    'hero.title':'Fullstack Developer & Data Analyst',
    'hero.stack':'Python · SQL · Fullstack — Information Systems Specialist (TPSI). ETL pipelines, data modeling and application development.',
    'hero.projects':'View Projects','hero.badge':'TPSI Specialist · IEFP Porto',
    'dashboard.tag':'// dashboard','dashboard.title':'Technical skills',
    'dashboard.sub':'Stack actively developed during the TPSI course (IEFP Porto) and applied in hands-on projects.',
    'chart.tag':'// distribution','chart.title':'Projects by technical area',
    'projects.tag':'// projects','projects.highlightTitle':'Featured project',
    'projects.highlightSub':'The portfolio’s flagship project, with full architecture and an interactive terminal.',
    'projects.code':'View code ↗','projects.process':'View process','projects.processClose':'Close process',
    'er.tag':'// other projects','er.title':'Other Technical Work',
    'er.sub':'Relational schema of the remaining projects — click each table to see the details.',
    'er.close':'Close','er.prev':'Previous project','er.next':'Next project',
    'formacao.tag':'// education','formacao.title':'Academic & technical path',
    'formacao.sub':'Specialized technical training and complementary certifications over recent years.',
    'lab.tag':'// technical lab','lab.title':'Practice environment',
    'lab.desc':'Own infrastructure to test, version and automate — the same environment used in projects.',
    'lab.proxmox.t':'Proxmox VE','lab.proxmox.d':'Server virtualization and isolated test environments',
    'lab.linux.t':'Linux (Ubuntu)','lab.linux.d':'Administration, permissions and command-line automation',
    'lab.git.t':'Git & GitHub','lab.git.d':'Branches, merges, conflict resolution and version control',
    'lab.ia.t':'Claude AI & Agents','lab.ia.d':'AI-assisted automation in development and analysis',
    'certs.tag':'// certifications','certs.title':'Complementary certificates',
    'sobre.tag':'// about','sobre.title':'A bit more about me',
    'sobre.p1':'Over 10 years in commercial data analysis, currently transitioning into tech — combining hands-on commercial and hospitality experience with modern application development. With a focus on Python, relational databases and web development, I apply analytical thinking to turn processes into functional, automated code through the TPSI course (IEFP Porto).',
    'sobre.p2':'I built a management system for 22 accommodation units in Python and MySQL, plus a public data import pipeline to MySQL — applying to programming the same analytical thinking from my previous experience.',
    'sobre.p3':'Available for Work Context Training (ECT) from November 2026.',
    'sobre.cv':'Download CV','sobre.local':'Location','sobre.email':'Email','sobre.formacao':'Education','sobre.langs':'Languages',
    'contacto.tag':'// contact','contacto.title':"Let's talk",
    'contacto.sub':'Work Context Training offers, collaborations or tech talk — send a message.',
    'form.name':'Name','form.name.ph':'Your name','form.email':'Email','form.email.ph':'name@company.com',
    'form.message':'Message','form.message.ph':'How can we collaborate?','form.submit':'Send message','form.sending':'Sending...',
    'form.success':'✓ Message sent. Thank you!','form.error':'✕ Failed to send. Please try again.',
    'form.err.name':'Minimum 3 characters.','form.err.email':'Invalid email.','form.err.message':'Minimum 10 characters.',
    'form.err.generic':'Please fix the highlighted fields.',
    'footer.made':'built with pure HTML, CSS and JS'
  }
};

const Lang = (() => {
  const KEY = 'lang', DEFAULT = 'pt';
  function current() { return localStorage.getItem(KEY) || DEFAULT; }
  function apply(lang) {
    const dict = I18N[lang] || I18N[DEFAULT];
    if (!dict) return;
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-PT' : 'en');
    localStorage.setItem(KEY, lang);
    $$('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (dict[k] !== undefined) el.textContent = dict[k];
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      const k = el.dataset.i18nPlaceholder;
      if (dict[k] !== undefined) el.placeholder = dict[k];
    });
    $$('.lang').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }
  function init() {
    apply(current());
    $$('.lang').forEach(b => {
      b.addEventListener('click', () => {
        const l = b.dataset.lang;
        if (l && l !== current()) {
          apply(l);
          if (window.Skills && Skills.render) Skills.render();
          if (window.Chart && Chart.render) Chart.render();
          if (window.Projects && Projects.render) Projects.render();
          if (window.Formacao && Formacao.render) Formacao.render();
        }
      });
    });
  }
  return { init, apply, current };
})();

/* ─────────────────────────────────────────────
   MÓDULO 3 — TEMA
───────────────────────────────────────────── */
const Theme = (() => {
  const KEY = 'theme', DEFAULT = 'dark';
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
  }
  function init() {
    apply(localStorage.getItem(KEY) || DEFAULT);
    $('#themeToggle')?.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || DEFAULT;
      apply(cur === 'dark' ? 'light' : 'dark');
    });
  }
  return { init, apply };
})();

/* ─────────────────────────────────────────────
   MÓDULO 4 — TOAST
───────────────────────────────────────────── */
const Toast = (() => {
  let timer;
  function show(msg, type = '') {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show ' + type;
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), 3500);
  }
  return { show };
})();

/* ─────────────────────────────────────────────
   MÓDULO 5 — NAV
───────────────────────────────────────────── */
const Nav = (() => {
  function init() {
    const sections = $$('[data-section]');
    const navLinks = $$('.nav-link');
    const sideDots = $$('.side-dot');
    const progress = $('#readProgress');
    const backTop = $('#backToTop');

    function updateActive() {
      const fromTop = window.scrollY + 120;
      let activeId = sections[0]?.dataset.section;
      sections.forEach(sec => {
        if (sec.offsetTop <= fromTop) activeId = sec.dataset.section;
      });
      navLinks.forEach(l => l.classList.toggle('active', l.dataset.nav === activeId));
      sideDots.forEach(d => d.classList.toggle('active', d.dataset.nav === activeId));
    }
    function updateProgress() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      if (progress) progress.style.width = pct + '%';
      if (backTop) backTop.classList.toggle('show', window.scrollY > 500);
    }
    let raf = null;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { updateActive(); updateProgress(); raf = null; });
    }, { passive: true });
    window.addEventListener('resize', () => { updateActive(); updateProgress(); });
    backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    updateActive(); updateProgress();
  }
  return { init };
})();

/* ─────────────────────────────────────────────
   MÓDULO 6 — SKILLS
───────────────────────────────────────────── */
const Skills = (() => {
  const ICON_URLS = {
    'Python':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'JavaScript':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'HTML5':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    'CSS3':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    'PostgreSQL':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'MongoDB':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'Git':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'Linux':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    'Java':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'VS Code':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
    'Proxmox':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/proxmox/proxmox-original.svg',
    'SQLite':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
    'MySQL':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'SQL Server':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg'
  };
  function iconTile(skill, index) {
    const url = ICON_URLS[skill.name];
    const delay = (index * 55) + 'ms';
    const inner = url
      ? `<img src="${url}" alt="${skill.name}" loading="lazy" width="42" height="42">`
      : `<div class="skill-fallback">${skill.name.charAt(0)}</div>`;
    return `
      <div class="skill-tile" style="animation-delay:${delay}" title="${skill.name} · ${skill.level}%">
        ${inner}
        <span class="skill-tile-name">${skill.name}</span>
      </div>`;
  }
  async function render() {
    const el = $('#skillsIcons');
    if (!el) return;
    const data = await Data.load();
    el.innerHTML = (data.skills || []).map(iconTile).join('');
  }
  return { render };
})();

/* ─────────────────────────────────────────────
   MÓDULO 7 — DONUT
───────────────────────────────────────────── */
const Chart = (() => {
  async function render() {
    const wrap = $('#chartWrap');
    if (!wrap) return;
    const data = await Data.load();
    const items = data.chart || [];
    const total = items.reduce((s, i) => s + i.count, 0) || 1;
    const R = 42, C = 2 * Math.PI * R;
    let cumulative = 0;
    const segs = items.map(item => {
      const pct = item.count / total;
      const dash = pct * C;
      const offset = -cumulative * C;
      cumulative += pct;
      return `<circle class="ring-seg" cx="50" cy="50" r="${R}" stroke="${item.color}" stroke-dasharray="${dash} ${C}" stroke-dashoffset="${offset}" data-target-dash="${dash} ${C}" data-target-offset="${offset}"/>`;
    }).join('');
    const legend = items.map(item => `
      <div class="legend-item">
        <span class="legend-swatch" style="background:${item.color}"></span>
        <span class="legend-label">${field(item, 'label')}</span>
        <span class="legend-count"><strong>${item.count}</strong> proj.</span>
      </div>`).join('');
    wrap.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="ring-bg" cx="50" cy="50" r="${R}"/>
        ${segs}
        <text class="ring-center-num" x="50" y="49">${total}</text>
        <text class="ring-center-lbl" x="50" y="60">projetos</text>
      </svg>
      <div class="chart-legend">${legend}</div>`;
    wrap.querySelectorAll('.ring-seg').forEach(seg => {
      const dash = seg.dataset.targetDash, offset = seg.dataset.targetOffset;
      seg.setAttribute('stroke-dasharray', `0 ${C}`);
      seg.setAttribute('stroke-dashoffset', '0');
      requestAnimationFrame(() => {
        seg.style.strokeDasharray = dash;
        seg.style.strokeDashoffset = offset;
      });
    });
  }
  return { render };
})();

/* ─────────────────────────────────────────────
   MÓDULO 8 — PROJETOS
───────────────────────────────────────────── */
const Projects = (() => {
  let featuredData = null;
  let erProjects = [];
  let activeErIndex = -1;
  const typingLocks = new Set();

  /* ── ÍCONES SVG para os stats ── */
  const STAT_ICONS = {
    check:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    pencil:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
    database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    fire:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    rocket:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    code:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    star:     '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    grid:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    shield:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    clock:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    users:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    home:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    book:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    chart:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
  };

  /* ── Card do destaque ── */
  function renderFeaturedBlock(proj, index) {
    const stats = (proj.stats || []).map((s) => {
      const iconSvg = s.icon && STAT_ICONS[s.icon] ? STAT_ICONS[s.icon] : '';
      const subHtml = s.sub ? `<span class="project-stat-sub">${field(s, 'sub')}</span>` : '';
      const sizeClass = s.size === 'big' ? ' is-big' : ' is-small';
      const hasTooltip = s.tooltip ? ` data-tooltip="${field(s, 'tooltip')}"` : '';
      return `
        <div class="project-stat${sizeClass}"${hasTooltip}>
          <div class="project-stat-row">
            ${iconSvg ? `<span class="project-stat-icon">${iconSvg}</span>` : ''}
            <span class="project-stat-num">${s.num}</span>
          </div>
          <span class="project-stat-lbl">${field(s, 'label')}</span>
          ${subHtml}
        </div>`;
    }).join('');

    const tags = (proj.stack || []).map(t => `<span class="tag">${t}</span>`).join('');

    const hasImage = proj.image
      ? `<img src="${proj.image}" alt="${field(proj, 'name')}" loading="lazy" onerror="this.style.display='none'">`
      : '<div style="width:100%;height:100%;display:grid;place-items:center;color:var(--text-faint);font-family:var(--font-mono);font-size:0.85rem">sem imagem</div>';

    const hasSecondary = !!proj.image_secondary;
    const secondaryImage = hasSecondary
      ? `<img src="${proj.image_secondary}" alt="${field(proj, 'name')} — extra" loading="lazy" onerror="this.style.display='none'">`
      : '';

    const mediaHtml = hasSecondary
      ? `<div class="project-block-media-stack">
           <div class="project-block-media">${hasImage}</div>
           <div class="project-block-media project-block-media-secondary">${secondaryImage}</div>
         </div>`
      : `<div class="project-block-media">${hasImage}</div>`;

    const link = (proj.link && proj.link !== '#')
      ? `<a href="${proj.link}" target="_blank" rel="noopener" class="btn btn-primary"><span data-i18n="projects.code">Ver código ↗</span></a>` : '';

    const hasTerminal = Array.isArray(proj.terminal) && proj.terminal.length > 0;
    const processBtn = hasTerminal
      ? `<button class="btn-process" type="button" data-process="${proj.id}">
           <span class="btn-process-label" data-i18n="projects.process">Ver processo</span>
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
         </button>` : '';

    const terminalBlock = hasTerminal
      ? `<div class="project-block-terminal" id="terminal-${proj.id}" aria-hidden="true">
           <div class="terminal">
             <div class="terminal-bar">
               <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
               <span class="terminal-title">guest@mauricio: ~/projetos/${proj.id}</span>
             </div>
             <div class="terminal-body" id="terminal-body-${proj.id}"></div>
           </div>
         </div>` : '';

    return `
      <article class="project-block visible" data-project="${proj.id}">
        <div class="project-block-body">
          <h3 class="project-block-title">${field(proj, 'name')}</h3>
          <p class="project-block-desc">${field(proj, 'desc')}</p>
          ${stats ? `<div class="project-block-stats">${stats}</div>` : ''}
          <div class="project-block-tags">${tags}</div>
          <div class="project-block-actions">${link}${processBtn}</div>
        </div>
        ${mediaHtml}
        ${terminalBlock}
      </article>`;
  }

  async function renderFeaturedSection() {
    const el = $('#projectsFeatured');
    if (!el) return;
    const json = await Data.load();
    const projects = json.projects || [];
    featuredData = projects[0];
    erProjects = projects.slice(1);
    if (!featuredData) return;
    el.innerHTML = renderFeaturedBlock(featuredData, 0);
    el.querySelectorAll('[data-process]').forEach(btn => {
      btn.addEventListener('click', () => toggleProcess(btn.dataset.process, btn));
    });
  }

  function buildTableSpec(proj) {
    return {
      id: proj.id,
      name: field(proj, 'name'),
      category: field(proj, 'category'),
      year: proj.year || '',
      image: proj.image,
      tableName: proj.id,
      badge: proj.category === 'ETL / Automação' ? 'ETL' : 'PK',
      desc: field(proj, 'desc'),
      stack: proj.stack || [],
      link: proj.link || '',
      rows: [
        { key: 'PK', name: 'id',           type: 'int' },
        { key: '',   name: 'nome',         type: 'varchar' },
        { key: '',   name: 'stack',        type: 'varchar[]' },
        { key: '',   name: 'ano',          type: 'year' },
        { key: 'FK', name: 'categoria_id', type: 'int' },
        { key: '',   name: 'link',         type: 'url' }
      ]
    };
  }

  function renderErNode(spec, index) {
    const rows = spec.rows.map(r => `
      <div class="er-row">
        <span class="er-row-key">${r.key || ''}</span>
        <span class="er-row-name">${r.name}</span>
        <span class="er-row-type">${r.type}</span>
      </div>`).join('');
    const stackTags = spec.stack.map(t => `<span class="tag">${t}</span>`).join('');
    const linkBtn = (spec.link && spec.link !== '#')
      ? `<a href="${spec.link}" target="_blank" rel="noopener" class="btn btn-primary"><span data-i18n="projects.code">Ver código ↗</span></a>` : '';
    return `
      <div class="er-node" data-node-id="${spec.id}" data-index="${index}" tabindex="0" role="button" aria-expanded="false">
        <div class="er-node-header">
          <span class="er-node-title">${spec.tableName}</span>
          <span class="er-node-badge">${spec.badge}</span>
        </div>
        <div class="er-node-body">
          <div class="er-node-rows">${rows}</div>
          <div class="er-node-detail">
            <button class="er-detail-close" type="button" aria-label="Fechar" data-er-close>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <h3 class="er-detail-title">${spec.name}</h3>
            <span class="er-detail-meta">${spec.year} · ${spec.category}</span>
            <img class="er-detail-img" src="${spec.image}" alt="${spec.name}" loading="lazy" onerror="this.style.display='none'">
            <p class="er-detail-desc">${spec.desc}</p>
            <div class="er-detail-stack">${stackTags}</div>
            <div class="er-detail-actions">${linkBtn}</div>
            <div class="er-detail-nav">
              <button class="er-nav-btn" type="button" data-er-prev aria-label="Anterior" ${index === 0 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button class="er-nav-btn" type="button" data-er-next aria-label="Próximo" ${index === erProjects.length - 1 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  async function renderEr() {
    const el = $('#erDiagram');
    if (!el) return;
    const json = await Data.load();
    const projects = json.projects || [];
    const rest = projects.slice(1);
    if (!rest.length) return;
    const specs = rest.map(buildTableSpec);
    el.innerHTML = specs.map(renderErNode).join('');
    bindErEvents();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      drawErConnections();
      drawFeaturedToEr();
    }));
  }

  function bindErEvents() {
    const wrap = $('#erDiagram');
    if (!wrap) return;
    if (wrap._hasClickBinding) return;
    wrap._hasClickBinding = true;

    wrap.addEventListener('click', (e) => {
      if (e.target.closest('[data-er-close]')) { e.stopPropagation(); collapseErNode(); return; }
      if (e.target.closest('[data-er-prev]')) { e.stopPropagation(); if (activeErIndex > 0) expandErNode(activeErIndex - 1); return; }
      if (e.target.closest('[data-er-next]')) { e.stopPropagation(); if (activeErIndex < erProjects.length - 1) expandErNode(activeErIndex + 1); return; }
      if (e.target.closest('a')) return;
      if (e.target.closest('.er-node.expanded')) return;
      const node = e.target.closest('.er-node');
      if (node && !node.classList.contains('expanded')) {
        const idx = parseInt(node.dataset.index, 10);
        if (!isNaN(idx)) expandErNode(idx);
      }
    });

    wrap.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const node = e.target.closest('.er-node');
      if (!node || node.classList.contains('expanded')) return;
      e.preventDefault();
      const idx = parseInt(node.dataset.index, 10);
      if (!isNaN(idx)) expandErNode(idx);
    });

    if (!wrap._hasEscListener) {
      wrap._hasEscListener = true;
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeErIndex >= 0) collapseErNode();
      });
    }
  }

  function expandErNode(index) {
    const wrap = $('#erDiagram');
    if (!wrap) return;
    wrap.querySelectorAll('.er-node').forEach(n => {
      n.classList.remove('expanded');
      n.setAttribute('aria-expanded', 'false');
    });
    const target = wrap.querySelector(`.er-node[data-index="${index}"]`);
    if (!target) return;
    target.classList.add('expanded');
    target.setAttribute('aria-expanded', 'true');
    wrap.classList.add('has-expanded');
    activeErIndex = index;
    setTimeout(() => { drawErConnections(); drawFeaturedToEr(); }, 420);
    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const topOK = rect.top >= 80;
      const bottomOK = rect.bottom <= window.innerHeight + 40;
      if (!topOK || !bottomOK) {
        const y = window.scrollY + rect.top - 110;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 90);
  }

  function collapseErNode() {
    const wrap = $('#erDiagram');
    if (!wrap) return;
    wrap.querySelectorAll('.er-node').forEach(n => {
      n.classList.remove('expanded');
      n.setAttribute('aria-expanded', 'false');
    });
    wrap.classList.remove('has-expanded');
    activeErIndex = -1;
    setTimeout(() => { drawErConnections(); drawFeaturedToEr(); }, 420);
  }

  function drawErConnections() {
    const svg = $('#erConnections');
    const wrap = $('#erDiagramWrap');
    const nodes = $$('.er-node');
    if (!svg || !wrap || nodes.length < 2) return;
    const wrapRect = wrap.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if ($('#erDiagram.has-expanded')) return;

    const nodeInfo = nodes.map((n, i) => ({ node: n, index: i, ports: getPorts(n, wrapRect) }));
    const pairs = [];
    for (let i = 0; i < nodeInfo.length - 1; i++) {
      pairs.push({ from: nodeInfo[i], fromSide: 'right', to: nodeInfo[i + 1], toSide: 'left', style: 'primary' });
    }
    for (let i = 0; i < nodeInfo.length; i++) {
      for (let j = i + 1; j < nodeInfo.length; j++) {
        if (j === i + 1) continue;
        const shared = sharedStack(erProjects[i]?.stack, erProjects[j]?.stack);
        if (shared.length) {
          pairs.push({ from: nodeInfo[i], fromSide: 'bottom', to: nodeInfo[j], toSide: 'top', style: 'ghost' });
        }
      }
    }
    pairs.forEach(({ from, fromSide, to, toSide, style }) => {
      const p1 = from.ports[fromSide], p2 = to.ports[toSide];
      const path = buildCurvedPath(p1, p2, fromSide, toSide);
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const halo = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      halo.setAttribute('d', path);
      halo.setAttribute('fill', 'none');
      halo.setAttribute('stroke', 'var(--accent)');
      halo.setAttribute('stroke-width', '6');
      halo.setAttribute('stroke-opacity', '0.06');
      halo.setAttribute('stroke-linecap', 'round');
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('d', path);
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke', 'var(--accent)');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-opacity', '0.55');
      line.setAttribute('stroke-linecap', 'round');
      if (style === 'ghost') line.setAttribute('stroke-dasharray', '4 4');
      const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c1.setAttribute('cx', p1.x); c1.setAttribute('cy', p1.y);
      c1.setAttribute('r', '3'); c1.setAttribute('fill', 'var(--accent)'); c1.setAttribute('fill-opacity', '0.85');
      const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c2.setAttribute('cx', p2.x); c2.setAttribute('cy', p2.y);
      c2.setAttribute('r', '3'); c2.setAttribute('fill', 'var(--accent)'); c2.setAttribute('fill-opacity', '0.85');
      g.appendChild(halo); g.appendChild(line); g.appendChild(c1); g.appendChild(c2);
      svg.appendChild(g);
    });
  }

  function getPorts(node, wrapRect) {
    const r = node.getBoundingClientRect();
    return {
      left:   { x: r.left - wrapRect.left,               y: r.top - wrapRect.top + r.height / 2 },
      right:  { x: r.right - wrapRect.left,              y: r.top - wrapRect.top + r.height / 2 },
      top:    { x: r.left - wrapRect.left + r.width / 2, y: r.top - wrapRect.top },
      bottom: { x: r.left - wrapRect.left + r.width / 2, y: r.bottom - wrapRect.top }
    };
  }

  function buildCurvedPath(p1, p2, side1, side2) {
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curve = Math.min(Math.max(dist * 0.42, 40), 160);
    let c1x = p1.x, c1y = p1.y, c2x = p2.x, c2y = p2.y;
    if (side1 === 'right')  c1x += curve;
    if (side1 === 'left')   c1x -= curve;
    if (side1 === 'top')    c1y -= curve;
    if (side1 === 'bottom') c1y += curve;
    if (side2 === 'right')  c2x += curve;
    if (side2 === 'left')   c2x -= curve;
    if (side2 === 'top')    c2y -= curve;
    if (side2 === 'bottom') c2y += curve;
    return `M ${p1.x} ${p1.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  function sharedStack(a, b) {
    if (!a || !b) return [];
    return a.filter(x => b.includes(x));
  }

  function drawFeaturedToEr() {
    const svg = $('#featuredToEr');
    const wrap = $('.featured-to-er-wrap');
    const featured = $('.project-block');
    const erHead = $('.section-head-er');
    if (!svg || !wrap || !featured || !erHead) return;
    const wrapRect = wrap.getBoundingClientRect();
    if (wrapRect.width === 0 || wrapRect.height === 0) return;
    svg.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const fRect = featured.getBoundingClientRect();
    const eRect = erHead.getBoundingClientRect();

    const x0 = Math.min(Math.max(fRect.right - wrapRect.left - 80, 30), wrapRect.width - 30);
    const y0 = 4;
    const x1 = Math.min(Math.max(eRect.left - wrapRect.left + 20, 30), wrapRect.width - 30);
    const y1 = Math.min(Math.max(eRect.top - wrapRect.top + 20, 4), wrapRect.height - 4);

    const c1x = x0;
    const c1y = y0 + wrapRect.height * 0.55;
    const c2x = x1 + 100;
    const c2y = y1;
    const d = `M ${x0} ${y0} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x1} ${y1}`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--accent)');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-opacity', '0.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-dasharray', '6 5');

    const cS = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cS.setAttribute('cx', x0); cS.setAttribute('cy', y0);
    cS.setAttribute('r', '3.5'); cS.setAttribute('fill', 'var(--accent)'); cS.setAttribute('fill-opacity', '0.9');

    const cE = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cE.setAttribute('cx', x1); cE.setAttribute('cy', y1);
    cE.setAttribute('r', '3.5'); cE.setAttribute('fill', 'var(--accent)'); cE.setAttribute('fill-opacity', '0.9');

    svg.appendChild(path); svg.appendChild(cS); svg.appendChild(cE);
  }

  function toggleProcess(id, btn) {
    const terminal = $('#terminal-' + id);
    if (!terminal) return;
    const isOpen = terminal.classList.contains('open');
    const proj = featuredData && featuredData.id === id ? featuredData : null;
    const label = btn.querySelector('.btn-process-label');
    if (isOpen) {
      terminal.classList.remove('open');
      terminal.setAttribute('aria-hidden', 'true');
      btn.classList.remove('expanded');
      if (label) label.textContent = (I18N[Lang.current()] || {})['projects.process'] || 'Ver processo';
    } else {
      terminal.classList.add('open');
      terminal.setAttribute('aria-hidden', 'false');
      btn.classList.add('expanded');
      if (label) label.textContent = (I18N[Lang.current()] || {})['projects.processClose'] || 'Fechar processo';
      if (proj && !typingLocks.has(id)) {
        typingLocks.add(id);
        playTerminal(id, proj);
      }
    }
  }

  async function playTerminal(id, proj) {
    const body = $('#terminal-body-' + id);
    if (!body || !Array.isArray(proj.terminal)) return;
    body.innerHTML = '';
    await sleep(280);
    for (const line of proj.terminal) {
      const el = document.createElement('div');
      el.className = 'term-line';
      if (line.type === 'cmd') {
        el.innerHTML = `<span class="term-prompt">guest@mauricio</span><span class="term-dim">:</span><span class="term-path">~/${proj.id}</span><span class="term-dim">$</span> <span class="term-cmd"></span>`;
        body.appendChild(el);
        await sleep(60);
        el.classList.add('visible');
        const cmdSpan = el.querySelector('.term-cmd');
        for (let i = 0; i < line.text.length; i++) {
          cmdSpan.textContent += line.text[i];
          body.scrollTop = body.scrollHeight;
          await sleep(24);
        }
        await sleep(240);
      } else {
        let content = line.text || '&nbsp;';
        if (line.type === 'warn') content = `<span class="term-warn">${content}</span>`;
        if (line.type === 'err')  content = `<span class="term-err">${content}</span>`;
        el.innerHTML = content;
        body.appendChild(el);
        await sleep(line.text ? 100 : 55);
        el.classList.add('visible');
        body.scrollTop = body.scrollHeight;
      }
    }
    const finalLine = document.createElement('div');
    finalLine.className = 'term-line';
    finalLine.innerHTML = `<span class="term-prompt">guest@mauricio</span><span class="term-dim">:</span><span class="term-path">~/${proj.id}</span><span class="term-dim">$</span> <span class="term-caret"></span>`;
    body.appendChild(finalLine);
    await sleep(40);
    finalLine.classList.add('visible');
    body.scrollTop = body.scrollHeight;
  }

  async function render() {
    await renderFeaturedSection();
    await renderEr();
    let rt = null;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { drawErConnections(); drawFeaturedToEr(); }, 120);
    });
    window.addEventListener('load', () => setTimeout(() => { drawErConnections(); drawFeaturedToEr(); }, 200));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(() => { drawErConnections(); drawFeaturedToEr(); }, 120));
    }
  }

  return { render, redraw: () => { drawErConnections(); drawFeaturedToEr(); } };
})();

/* ─────────────────────────────────────────────
   MÓDULO 9 — FORMAÇÃO
───────────────────────────────────────────── */
const Formacao = (() => {
  async function render() {
    const timeline = $('#timeline');
    const certs = $('#certsGrid');
    if (!timeline && !certs) return;
    const data = await Data.load();
    if (timeline) {
      timeline.innerHTML = (data.formacao || []).map(item => `
        <div class="timeline-item ${item.current ? 'current' : ''} reveal">
          <span class="timeline-date">${field(item, 'date')}</span>
          <h3 class="timeline-title">${field(item, 'title')}</h3>
          <div class="timeline-org">${field(item, 'org')}</div>
          <p class="timeline-desc">${field(item, 'desc')}</p>
        </div>`).join('');
    }
    if (certs) {
      certs.innerHTML = (data.certificados || []).map(c => `
        <article class="cert-item reveal" style="--cert-color:${c.color}">
          <span class="cert-logo">${c.inicial}</span>
          <div class="cert-body">
            <h4 class="cert-name">${field(c, 'name')}</h4>
            <div class="cert-issuer">${c.issuer}</div>
            <div class="cert-date">${field(c, 'date')}</div>
          </div>
        </article>`).join('');
    }
  }
  return { render };
})();

/* ─────────────────────────────────────────────
   MÓDULO 10 — CONTACTO
───────────────────────────────────────────── */
const ContactForm = (() => {
  function init() {
    const form = $('#contact-form');
    if (!form) return;
    const fields = {
      name:    { el: $('#name'),    err: $('#name-error') },
      email:   { el: $('#email'),   err: $('#email-error') },
      message: { el: $('#message'), err: $('#message-error') }
    };
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function t(key) { const d = I18N[Lang.current()]; return (d && d[key]) || key; }
    function validate(key) {
      const v = fields[key].el.value.trim();
      let msg = '';
      if (key === 'name' && v.length < 3) msg = t('form.err.name');
      if (key === 'email' && !emailRe.test(v)) msg = t('form.err.email');
      if (key === 'message' && v.length < 10) msg = t('form.err.message');
      fields[key].el.classList.toggle('invalid', !!msg);
      fields[key].err.textContent = msg;
      return !msg;
    }
    Object.keys(fields).forEach(k => fields[k].el.addEventListener('input', () => validate(k)));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Object.keys(fields).every(validate)) { Toast.show(t('form.err.generic'), 'error'); return; }
      const btn = $('#contact-submit');
      btn.disabled = true;
      const orig = btn.textContent;
      btn.textContent = t('form.sending');
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error();
        Toast.show(t('form.success'), 'success');
        form.reset();
        Object.values(fields).forEach(f => { f.el.classList.remove('invalid'); f.err.textContent = ''; });
      } catch { Toast.show(t('form.error'), 'error'); }
      finally { btn.disabled = false; btn.textContent = orig; }
    });
    document.addEventListener('langchange', () => {
      const b = $('#contact-submit');
      if (b && !b.disabled) b.textContent = t('form.submit');
    });
  }
  return { init };
})();

/* ─────────────────────────────────────────────
   MÓDULO 11 — UI EXTRAS
───────────────────────────────────────────── */
const UI = (() => {
  function initReveal() {
    const els = $$('.reveal:not(.visible)');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }
  function initCopyEmail() {
    $$('.copy-email').forEach(el => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        const txt = el.dataset.copy || el.textContent.trim();
        try {
          await navigator.clipboard.writeText(txt);
          el.classList.add('copied');
          Toast.show('✓ Email copiado', 'success');
          setTimeout(() => el.classList.remove('copied'), 1800);
        } catch { window.location.href = 'mailto:' + txt; }
      });
    });
  }
  function initCV() {
    $$('[data-cv]').forEach(link => {
      link.addEventListener('click', async (e) => {
        const href = link.getAttribute('href');
        try {
          const res = await fetch(href, { method: 'HEAD' });
          if (!res.ok) throw new Error('404');
        } catch {
          e.preventDefault();
          Toast.show('✕ CV não encontrado em ' + href, 'error');
        }
      });
    });
  }
  function init() { initReveal(); initCopyEmail(); initCV(); }
  return { init, initReveal };
})();

/* ─────────────────────────────────────────────
   EXPOR MÓDULOS
───────────────────────────────────────────── */
window.Skills = Skills;
window.Chart = Chart;
window.Projects = Projects;
window.Formacao = Formacao;
window.Lang = Lang;

/* ─────────────────────────────────────────────
   BOOTSTRAP
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  Theme.init();
  Lang.init();
  Nav.init();
  ImageFallback.init();

  await Skills.render();
  await Chart.render();
  await Projects.render();
  await Formacao.render();

  UI.init();
  ContactForm.init();
  UI.initReveal();

  setTimeout(() => Projects.redraw(), 400);
  setTimeout(() => Projects.redraw(), 1200);
});