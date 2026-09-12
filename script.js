/* ═══════════════════════════════════════════════════════════════
   MAURÍCIO PATES · PORTFÓLIO TÉCNICO
   script.js — v5 (fallback de dados completo + imagens robustas)
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ─────────────────────────────────────────────
   IMAGE FALLBACK
───────────────────────────────────────────── */
const ImageFallback = (() => {
  const CANDIDATES = ['.png', '.PNG', '.jpg', '.JPG', '.jpeg', '.JPEG', '.webp', '.WEBP'];

  function attach(img) {
    if (!img || img.dataset.fbBound) return;
    img.dataset.fbBound = '1';

    // Se já tem onerror inline, não duplica
    if (img.hasAttribute('onerror')) return;

    const tried = new Set();
    const baseSrc = img.getAttribute('src') || '';
    const dotIdx = baseSrc.lastIndexOf('.');
    if (dotIdx < 0) return;
    const base = baseSrc.slice(0, dotIdx);
    const originalExt = baseSrc.slice(dotIdx);
    tried.add(originalExt);

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
   FALLBACK agora tem TODOS os dados reais, para funcionar em file://
───────────────────────────────────────────── */
const Data = (() => {
  let cache = null;
  const FALLBACK = {
    "skills": [
      { "name": "Python",      "level": 78 },
      { "name": "JavaScript",  "level": 62 },
      { "name": "HTML5",       "level": 80 },
      { "name": "CSS3",        "level": 78 },
      { "name": "MySQL",       "level": 82 },
      { "name": "PostgreSQL",  "level": 55 },
      { "name": "SQL Server",  "level": 62 },
      { "name": "SQLite",      "level": 70 },
      { "name": "MongoDB",     "level": 48 },
      { "name": "Git",         "level": 76 },
      { "name": "Linux",       "level": 65 },
      { "name": "Proxmox",     "level": 58 },
      { "name": "Java",        "level": 45 },
      { "name": "VS Code",     "level": 82 }
    ],
    "chart": [
      { "label": "Python / Dados",  "count": 3, "color": "var(--viz-blue-1)" },
      { "label": "Web (Frontend)",  "count": 2, "color": "var(--viz-blue-2)" },
      { "label": "ETL / Automação", "count": 2, "color": "var(--viz-blue-3)" }
    ],
    "projects": [
      {
        "id": "hostel",
        "name": "Sistema Unificado de Gestão de Hostel",
        "tags": "Python · MySQL · SQLite · CustomTkinter",
        "year": "2026",
        "category": "Python / Dados",
        "image": "img/proj-hostel.png",
        "desc": "Sistema híbrido para gestão de 22 unidades de alojamento em regime misto — arrendamento mensal partilhado e estadias curtas (Airbnb). Inclui controlo e análise de stock, verificação rápida de disponibilidade, geração automática de contratos e uma dashboard analítica com métricas operacionais em tempo real.",
        "stack": ["Python", "MySQL", "SQLite", "CustomTkinter", "Matplotlib", "Git"],
        "stats": [
          { "num": "22",     "label": "unidades" },
          { "num": "17",     "label": "tabelas" },
          { "num": "394",    "label": "testes" },
          { "num": "82%",    "label": "ocupação" }
        ],
        "terminal": [
          { "type": "cmd", "text": "python main.py --status" },
          { "type": "out", "text": "<span class=\"term-dim\"># Sistema de Gestão de Alojamento — Porto</span>" },
          { "type": "out", "text": "" },
          { "type": "ok",  "text": "✓ A inicializar módulos..." },
          { "type": "ok",  "text": "✓ Base de dados MySQL conectada (22 unidades)" },
          { "type": "ok",  "text": "✓ Camada SQLite local sincronizada" },
          { "type": "ok",  "text": "✓ Interface CustomTkinter carregada" },
          { "type": "out", "text": "" },
          { "type": "out", "text": "<span class=\"term-key\">Estado atual:</span>" },
          { "type": "out", "text": "  Unidades totais ............ <span class=\"term-val\">22</span>" },
          { "type": "out", "text": "  Ocupação atual ............ <span class=\"term-val\">18 / 22 (82%)</span>" },
          { "type": "out", "text": "  Contratos ativos .......... <span class=\"term-val\">24</span>" },
          { "type": "out", "text": "  Reservas Airbnb ........... <span class=\"term-val\">6</span>" },
          { "type": "out", "text": "  Receita do mês ............ <span class=\"term-val\">€ 6 240</span>" },
          { "type": "out", "text": "  Alertas de stock .......... <span class=\"term-warn\">2</span>" },
          { "type": "out", "text": "" },
          { "type": "ok",  "text": "✓ Testes: 394 passaram / 0 falharam" }
        ],
        "link": "https://github.com/Mauriciopates/hostel_gestao"
      },
      {
        "id": "siape",
        "name": "Pipeline de Dados SIAPE",
        "tags": "Python · MySQL · ETL · Tkinter",
        "year": "2025",
        "category": "ETL / Automação",
        "image": "img/proj-siape.png",
        "desc": "Pipeline de ETL que extrai dados públicos do Portal da Transparência (governo brasileiro), normaliza e carrega para MySQL remoto. Interface gráfica em Tkinter com passos sequenciais (conexão, download, descompactação, envio, verificação e limpeza) e painel de logs em tempo real.",
        "stack": ["Python", "MySQL", "ETL", "Tkinter"],
        "stats": [
          { "num": "7",       "label": "etapas" },
          { "num": "2 805",   "label": "registos" },
          { "num": "1m 42s",  "label": "duração" },
          { "num": "7",       "label": "tabelas" }
        ],
        "terminal": [
          { "type": "cmd", "text": "python siape_pipeline.py --mode=full" },
          { "type": "out", "text": "<span class=\"term-dim\"># Pipeline SIAPE — Portal da Transparência</span>" },
          { "type": "out", "text": "" },
          { "type": "ok",  "text": "✓ [1/4] Extração — 2 847 registos obtidos" },
          { "type": "ok",  "text": "✓ [2/4] Normalização — encoding UTF-8, datas ISO" },
          { "type": "ok",  "text": "✓ [3/4] Validação — 42 registos inconsistentes removidos" },
          { "type": "ok",  "text": "✓ [4/4] Carga em MySQL remoto" },
          { "type": "out", "text": "" },
          { "type": "out", "text": "  <span class=\"term-key\">Destino:</span> <span class=\"term-val\">mysql://remote-host:3306/siape</span>" },
          { "type": "out", "text": "  <span class=\"term-key\">Registos inseridos:</span> <span class=\"term-val\">2 805</span>" },
          { "type": "out", "text": "  <span class=\"term-key\">Tempo total:</span> <span class=\"term-val\">1m 42s</span>" },
          { "type": "out", "text": "" },
          { "type": "ok",  "text": "✓ Pipeline concluído sem erros." }
        ],
        "link": "https://github.com/Mauriciopates/Database_automation_SIAPE"
      },
      {
        "id": "cpgf",
        "name": "Automação CPGF / GPGF",
        "tags": "Python · MySQL · CLI",
        "year": "2025",
        "category": "ETL / Automação",
        "image": "img/proj-cpgf.png",
        "desc": "Ferramenta CLI em Python para manutenção anual de tabelas CPGF e GPGF — extração, correção, normalização e importação em lote para MySQL. Menu interativo com verificação de integridade entre registos e diagnóstico de ficheiros CSV.",
        "stack": ["Python", "MySQL", "CLI", "ETL"],
        "stats": [
          { "num": "8",      "label": "opções" },
          { "num": "8 431",  "label": "registos" },
          { "num": "28s",    "label": "duração" },
          { "num": "0",      "label": "erros" }
        ],
        "terminal": [
          { "type": "cmd", "text": "./cpgf_automation_cli --year=2024 --import" },
          { "type": "out", "text": "<span class=\"term-dim\"># Automação CPGF/GPGF — manutenção anual</span>" },
          { "type": "out", "text": "" },
          { "type": "ok",  "text": "✓ Ano selecionado: 2024" },
          { "type": "ok",  "text": "✓ Ficheiros CSV encontrados: 12" },
          { "type": "ok",  "text": "✓ Validação de cabeçalhos: OK" },
          { "type": "ok",  "text": "✓ Importação em lote para MySQL" },
          { "type": "out", "text": "" },
          { "type": "out", "text": "  <span class=\"term-key\">Tabela:</span> <span class=\"term-val\">cpgf_2024</span>" },
          { "type": "out", "text": "  <span class=\"term-key\">Registos importados:</span> <span class=\"term-val\">8 431</span>" },
          { "type": "out", "text": "  <span class=\"term-key\">Duplicados ignorados:</span> <span class=\"term-val\">17</span>" },
          { "type": "out", "text": "" },
          { "type": "ok",  "text": "✓ Integridade verificada. Nenhuma inconsistência." }
        ],
        "link": "https://github.com/Mauriciopates/Database_automation_GPGF"
      },
      {
        "id": "relatorios",
        "name": "Relatórios de Segurança",
        "tags": "Python · Tkinter · Matplotlib",
        "year": "2025",
        "category": "Python / Dados",
        "image": "img/proj-relatorios.png",
        "desc": "Aplicação desktop para análise de logs de segurança com interface Tkinter. Apresenta dashboards com totais de eventos, críticos, avisos e utilizadores, permitindo consulta geral, detalhe por módulo, análise temporal e listagem por utilizador. Distribuída como executável único via PyInstaller.",
        "stack": ["Python", "Tkinter", "Matplotlib", "PyInstaller"],
        "stats": [
          { "num": "10 502", "label": "eventos" },
          { "num": "5 362",  "label": "críticos" },
          { "num": "4",      "label": "módulos" },
          { "num": "28 MB",  "label": "executável" }
        ],
        "terminal": [
          { "type": "cmd", "text": "pyinstaller --onefile --windowed relatorios.py" },
          { "type": "out", "text": "<span class=\"term-dim\"># Build do executável — Relatórios de Segurança</span>" },
          { "type": "out", "text": "" },
          { "type": "out", "text": "  <span class=\"term-key\">INFO:</span> PyInstaller: 6.x" },
          { "type": "out", "text": "  <span class=\"term-key\">INFO:</span> Python: 3.11" },
          { "type": "out", "text": "  <span class=\"term-key\">INFO:</span> Platform: Windows-10" },
          { "type": "out", "text": "" },
          { "type": "ok",  "text": "✓ Análise de dependências concluída" },
          { "type": "ok",  "text": "✓ Módulos Matplotlib e Tkinter empacotados" },
          { "type": "ok",  "text": "✓ Ficheiros binários gerados" },
          { "type": "out", "text": "" },
          { "type": "out", "text": "  <span class=\"term-key\">Output:</span> <span class=\"term-val\">dist/security_reports.exe</span>" },
          { "type": "out", "text": "  <span class=\"term-key\">Tamanho:</span> <span class=\"term-val\">28.4 MB</span>" },
          { "type": "out", "text": "" },
          { "type": "ok",  "text": "✓ Build concluído com sucesso." }
        ],
        "link": "https://github.com/Mauriciopates/Projeto_seguranca"
      }
    ],
    "formacao": [
      {
        "date": "abr 2026 – mai 2027",
        "title": "Técnico/a Especialista em Tecnologias e Programação de Sistemas de Informação (Nível 5)",
        "org": "IEFP — Centro de Formação Profissional do Porto",
        "desc": "Curso de Especialização Tecnológica (CET). Formação avançada em engenharia de software, bases de dados relacionais e NoSQL, desenvolvimento web fullstack, algoritmia, integração de sistemas e redes.",
        "current": true
      },
      {
        "date": "jan 2020 – dez 2022",
        "title": "Bacharelato em Gestão Comercial",
        "org": "UNIP — Universidade Paulista",
        "desc": "Formação em gestão comercial, análise de dados de vendas, marketing estratégico e operações de retalho.",
        "current": false
      },
      {
        "date": "2013 – 2022",
        "title": "Percurso profissional em análise de dados e liderança operacional",
        "org": "Drogarias Campeã · AHM Ace Hospitality",
        "desc": "10+ anos em análise de dados comerciais, prevenção de perdas, gestão de inventário e liderança de equipas em ambientes de retalho e hotelaria.",
        "current": false
      }
    ],
    "certificados": [
      { "name": "Banco de Dados SQL do Zero ao Avançado + Projetos Reais", "issuer": "Udemy", "date": "jul 2026", "color": "#3b6cf0", "inicial": "U" },
      { "name": "CLC — Curso de Liderança Contemporânea", "issuer": "Drogarias Campeã", "date": "out 2021", "color": "#5a85ff", "inicial": "DC" },
      { "name": "Comunicação e Oratória", "issuer": "Escola Conquer", "date": "ago 2021", "color": "#7aa0ff", "inicial": "C" },
      { "name": "Gestão e Liderança: Conceitos Básicos da Função Gerencial", "issuer": "Fundação Getulio Vargas", "date": "mai 2020", "color": "#3b6cf0", "inicial": "FGV" },
      { "name": "Gestão de Vendas: Noções Básicas de Criação de Estratégia", "issuer": "Fundação Getulio Vargas", "date": "abr 2020", "color": "#5a85ff", "inicial": "FGV" },
      { "name": "Microsoft Excel 2013 — Avançado", "issuer": "Fundação Bradesco", "date": "jul 2019", "color": "#7aa0ff", "inicial": "FB" },
      { "name": "Leader Coach Training", "issuer": "Instituto Brasileiro de Coaching — IBC", "date": "ago 2018", "color": "#3b6cf0", "inicial": "IBC" }
    ]
  };

  async function load() {
    if (cache) return cache;
    try {
      const res = await fetch('data.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      cache = await res.json();
      console.info('[Data] data.json carregado via fetch.');
    } catch (e) {
      console.warn('[Data] Não foi possível carregar data.json — a usar fallback interno.', e.message);
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
        if (l && l !== current()) apply(l);
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
      </div>
    `;
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
        <span class="legend-label">${item.label}</span>
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

  function renderFeaturedBlock(proj, index) {
    const num = String(index + 1).padStart(2, '0');
    const stats = (proj.stats || []).map(s => `
      <div class="project-stat">
        <span class="project-stat-num">${s.num}</span>
        <span class="project-stat-lbl">${s.label}</span>
      </div>`).join('');
    const tags = (proj.stack || []).map(t => `<span class="tag">${t}</span>`).join('');
    const hasImage = proj.image
      ? `<img src="${proj.image}" alt="${proj.name}" loading="lazy" onerror="this.style.display='none'">`
      : '<div style="width:100%;height:100%;display:grid;place-items:center;color:var(--text-faint);font-family:var(--font-mono);font-size:0.85rem">sem imagem</div>';
    const link = (proj.link && proj.link !== '#')
      ? `<a href="${proj.link}" target="_blank" rel="noopener" class="btn btn-primary"><span data-i18n="projects.code">Ver código ↗</span></a>` : '';
    const hasTerminal = Array.isArray(proj.terminal) && proj.terminal.length > 0;
    const processBtn = hasTerminal
      ? `<button class="btn-process" type="button" data-process="${proj.id}">
           <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
           <span class="btn-process-label" data-i18n="projects.process">Ver processo</span>
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
          <span class="project-block-num">${num} / ${proj.category || 'projeto'}</span>
          <h3 class="project-block-title">${proj.name}</h3>
          <span class="project-block-meta">${proj.year || ''} · ${proj.category || ''}</span>
          <p class="project-block-desc">${proj.desc || ''}</p>
          ${stats ? `<div class="project-block-stats">${stats}</div>` : ''}
          <div class="project-block-tags">${tags}</div>
          <div class="project-block-actions">${link}${processBtn}</div>
        </div>
        <div class="project-block-media">${hasImage}</div>
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
      id: proj.id, name: proj.name, category: proj.category || '',
      year: proj.year || '', image: proj.image, tableName: proj.id,
      badge: proj.category === 'ETL / Automação' ? 'ETL' : 'PK',
      desc: proj.desc || '', stack: proj.stack || [], link: proj.link || '',
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
          <span class="timeline-date">${item.date}</span>
          <h3 class="timeline-title">${item.title}</h3>
          <div class="timeline-org">${item.org}</div>
          <p class="timeline-desc">${item.desc}</p>
        </div>`).join('');
    }
    if (certs) {
      certs.innerHTML = (data.certificados || []).map(c => `
        <article class="cert-item reveal" style="--cert-color:${c.color}">
          <span class="cert-logo">${c.inicial}</span>
          <div class="cert-body">
            <h4 class="cert-name">${c.name}</h4>
            <div class="cert-issuer">${c.issuer}</div>
            <div class="cert-date">${c.date}</div>
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