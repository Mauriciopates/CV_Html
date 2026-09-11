/* ============================================================
   UTILITÁRIOS
============================================================ */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ============================================================
   MÓDULO 1 — BOOT
============================================================ */
const Boot = (() => {
  const STEPS = [
    { pct: 15, msg: 'a inicializar' },
    { pct: 40, msg: 'a carregar módulos' },
    { pct: 65, msg: 'a indexar projetos' },
    { pct: 85, msg: 'a preparar interface' },
    { pct: 100, msg: 'pronto' }
  ];

  const LOGS = [
    { at: 15,  text: 'python 3.12 ......... ok' },
    { at: 40,  text: 'mysql client ........ ok' },
    { at: 65,  text: 'projects.json ....... ok' },
    { at: 85,  text: 'interface ........... ok' }
  ];

  const KEY = 'bootSeen';

  function finish(screen, app) {
    screen.classList.add('done');
    app.classList.remove('hidden');
    sessionStorage.setItem(KEY, '1');
  }

  async function run() {
    const screen = $('#bootScreen');
    const app = $('#app');
    if (!screen || !app) return;

    if (sessionStorage.getItem(KEY) === '1') {
      screen.classList.add('done');
      app.classList.remove('hidden');
      return;
    }

    const bar = $('#bootBar');
    const pct = $('#bootPercent');
    const label = $('#bootLabel');
    const log = $('#bootLog');
    const skip = $('#bootSkip');

    let aborted = false;
    skip?.addEventListener('click', () => {
      aborted = true;
      finish(screen, app);
    });

    for (let i = 0; i < STEPS.length; i++) {
      if (aborted) return;
      const step = STEPS[i];
      bar.style.width = step.pct + '%';
      pct.textContent = step.pct + '%';
      label.textContent = step.msg;

      const logForStep = LOGS.find(l => l.at === step.pct);
      if (logForStep) {
        const line = document.createElement('div');
        line.innerHTML = '<span class="ok">✓</span> ' + logForStep.text;
        log.appendChild(line);
      }

      await sleep(280 + Math.random() * 160);
    }

    if (!aborted) {
      await sleep(300);
      finish(screen, app);
    }
  }

  return { run };
})();

/* ============================================================
   MÓDULO 2 — PROJETOS
============================================================ */
const Projects = (() => {
  let cache = null;

  const FALLBACK = [
    { id: 'hostel',       titulo: 'Sistema de Gestão de Hostel',   categoria: 'Python', destaque: true,  imagem: 'img/hostel-diagrama-er.png',            descricao: 'Sistema para 22 unidades de alojamento. Python + MySQL, 17 tabelas, ~400 testes.', tecnologias: ['Python','MySQL','unittest'], link: 'https://github.com/Mauriciopates/hostel_gestao' },
    { id: 'siape',        titulo: 'Pipeline de Dados SIAPE',       categoria: 'Python', destaque: true,  imagem: 'img/Database_automation_SIAPEpng.png',  descricao: 'ETL de dados públicos para MySQL remoto com interface Tkinter.',                   tecnologias: ['Python','MySQL','ETL'],      link: 'https://github.com/Mauriciopates/Database_automation_SIAPE' },
    { id: 'relatorios',   titulo: 'Relatórios de Segurança',       categoria: 'Python', destaque: true,  imagem: 'img/Projeto_segurança_relatorios.png',  descricao: 'App desktop Tkinter com gráficos matplotlib e build PyInstaller.',                tecnologias: ['Python','Tkinter','Matplotlib'], link: 'https://github.com/Mauriciopates/Projeto_seguranca' },
    { id: 'cpgf',         titulo: 'Automação CPGF/GPGF',           categoria: 'Python', destaque: false, imagem: 'img/Database_automation_GPGF.png',      descricao: 'CLI Python para manutenção de tabelas CPGF por ano.',                              tecnologias: ['Python','MySQL','CLI'],      link: 'https://github.com/Mauriciopates/Database_automation_GPGF' },
    { id: 'curiosidades', titulo: 'Curiosidades Ocultas',          categoria: 'Web',    destaque: false, descricao: 'Aplicação interativa em HTML, CSS e JavaScript puro.',                            tecnologias: ['HTML5','CSS3','JavaScript'], link: './Projetos_html/Curiosidades_ocultas/curiosidade.html' },
    { id: 'adivinha',     titulo: 'Jogo da Adivinha',              categoria: 'Web',    destaque: false, descricao: 'Jogo dinâmico com lógica JavaScript e feedback visual.',                       tecnologias: ['HTML5','CSS3','JavaScript'], link: './Projetos_html/Jogo_adivinha/adivinha.html' },
    { id: 'arduino',      titulo: 'Simulador de Circuitos Arduino',categoria: 'Java',   destaque: false, descricao: 'App desktop Java/Swing para mapear pinos lógicos de uma placa Arduino.',          tecnologias: ['Java','Swing'],              link: '#' }
  ];

  async function load() {
    if (cache) return cache;
    try {
      const res = await fetch('projects.json');
      if (!res.ok) throw new Error();
      cache = await res.json();
    } catch {
      cache = FALLBACK;
    }
    return cache;
  }

  function cardHTML(p) {
    const tags = p.tecnologias.map(t => '<span class="tag">' + t + '</span>').join('');
    const thumb = p.imagem
      ? '<div class="project-thumb"><img src="' + p.imagem + '" alt="' + p.titulo + '" loading="lazy" class="js-zoom" data-title="' + p.titulo + '"></div>'
      : '<div class="project-thumb"></div>';
    const link = (p.link && p.link !== '#')
      ? '<a href="' + p.link + '" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Ver código ↗</a>'
      : '<span class="btn btn-ghost btn-sm" style="opacity:.5;cursor:not-allowed">Privado</span>';
    return [
      '<article class="project-card" data-category="' + p.categoria + '">',
        thumb,
        '<div class="project-body">',
          '<h3 class="project-title">' + p.titulo + '</h3>',
          '<p class="project-desc">' + p.descricao + '</p>',
          '<div class="project-tags">' + tags + '</div>',
          '<div class="project-actions">' + link + '</div>',
        '</div>',
      '</article>'
    ].join('');
  }

  async function renderAll(filter = 'all') {
    const el = $('#all-projects');
    const empty = $('#emptyState');
    if (!el) return;
    const all = await load();
    const list = filter === 'all' ? all : all.filter(p => p.categoria === filter);
    el.innerHTML = list.map(cardHTML).join('');
    empty?.classList.toggle('hidden', list.length > 0);
  }

  return { load, renderAll, cardHTML };
})();

/* ============================================================
   MÓDULO 3 — TERMINAL
============================================================ */
const Terminal = (() => {
  const body = $('#terminalBody');
  if (!body) return { init: () => {} };

  let busy = false;
  const history = [];
  let histIdx = -1;

  const CMDS = {
    help: () => [
      '<span class="dim">Comandos disponíveis:</span>',
      '  <span class="accent">ls</span>              lista projetos',
      '  <span class="accent">open</span> &lt;id&gt;       abre projeto (ex: open hostel)',
      '  <span class="accent">cat</span> &lt;id&gt;        detalhes de um projeto',
      '  <span class="accent">skills</span>          stack técnica',
      '  <span class="accent">sobre</span>           quem sou',
      '  <span class="accent">cv</span>              descarrega o CV (PDF)',
      '  <span class="accent">github</span>          abre o GitHub',
      '  <span class="accent">linkedin</span>        abre o LinkedIn',
      '  <span class="accent">contacto</span>        como falar comigo',
      '  <span class="accent">theme</span> [dark|light]  muda o tema',
      '  <span class="accent">date</span>            data e hora atuais',
      '  <span class="accent">whoami</span>          quem está do outro lado',
      '  <span class="accent">clear</span>           limpa o terminal',
      '  <span class="accent">help</span>            esta mensagem',
      '',
      '<span class="dim">também podes tentar:</span> <span class="accent">sudo hire-me</span> · <span class="accent">coffee</span> · <span class="accent">matrix</span> · <span class="accent">hack</span>'
    ].join('\n'),

    ls: async () => {
      const ps = await Projects.load();
      return ps.map(p =>
        '  <span class="path">' + p.id + '/</span>  <span class="dim">' + p.categoria.padEnd(6) + '</span>  ' + p.titulo
      ).join('\n');
    },

    skills: () => [
      '<span class="accent">linguagens</span>   Python · Java · C · JavaScript · HTML5 · CSS3',
      '<span class="accent">dados</span>        MySQL · SQL Server · ETL',
      '<span class="accent">infra</span>        Linux (Ubuntu) · Proxmox · Git · GitHub'
    ].join('\n'),

    sobre: () => [
      'Construo aplicações em <span class="ok">Python</span> e <span class="ok">MySQL</span>.',
      'Atualmente a desenvolver um sistema de gestão para 22 unidades',
      'de alojamento — 17 tabelas relacionais, ~400 testes automatizados.',
      '',
      'Background em análise de dados e liderança. À procura de',
      '<span class="warn">estágio curricular Full Stack</span> a partir de nov/2026.'
    ].join('\n'),

    contacto: () => [
      '  <span class="accent">email</span>     mauricio.patespt@gmail.com',
      '  <span class="accent">github</span>    <a href="https://github.com/Mauriciopates" target="_blank" rel="noopener">github.com/Mauriciopates</a>',
      '  <span class="accent">linkedin</span>  <a href="https://www.linkedin.com/in/mauricio-pates" target="_blank" rel="noopener">linkedin.com/in/mauricio-pates</a>',
      '  <span class="accent">local</span>     Cedofeita, Porto'
    ].join('\n'),

    github: () => {
      window.open('https://github.com/Mauriciopates', '_blank', 'noopener');
      return '<span class="ok">→</span> A abrir github.com/Mauriciopates...';
    },

    linkedin: () => {
      window.open('https://www.linkedin.com/in/mauricio-pates', '_blank', 'noopener');
      return '<span class="ok">→</span> A abrir linkedin.com/in/mauricio-pates...';
    },

    cv: () => {
      const a = document.createElement('a');
      a.href = 'cv/Mauricio_Pates_CV.pdf';
      a.download = 'Mauricio_Pates_CV.pdf';
      a.click();
      return '<span class="ok">✓</span> Download do CV iniciado.';
    },

    theme: (args) => {
      const mode = (args[0] || '').toLowerCase();
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = (mode === 'dark' || mode === 'light') ? mode : (cur === 'dark' ? 'light' : 'dark');
      Theme.apply(next);
      return '<span class="ok">✓</span> Tema alterado para <span class="accent">' + next + '</span>.';
    },

    date: () => '<span class="ok">' + new Date().toLocaleString('pt-PT') + '</span>',

    whoami: () => [
      '<span class="dim">tu:</span> visitante curioso',
      '<span class="dim">eu:</span> Maurício Pates, dev em transição',
      '<span class="dim">objetivo:</span> estágio Full Stack nov/2026'
    ].join('\n'),

    clear: () => { body.innerHTML = ''; return ''; },

    sudo: (args) => {
      const cmd = args.join(' ');
      if (cmd === 'hire-me') {
        return [
          '<span class="ok">[sudo] password for guest:</span> ********',
          '<span class="ok">✓ Acesso concedido.</span>',
          '',
          '  <span class="accent">→</span> A contactar mauricio.patespt@gmail.com...',
          '  <span class="accent">→</span> A preparar proposta de estágio...',
          '<span class="ok">✓ Proposta enviada com sucesso.</span>',
          '',
          '<span class="dim">(brincadeira — mas fala comigo a sério: usa o formulário no perfil)</span>'
        ].join('\n');
      }
      return '<span class="err">sudo: ' + (cmd || '(comando vazio)') + ': comando não encontrado</span>\n<span class="dim">dica: tenta <code>sudo hire-me</code></span>';
    },

    coffee: () => [
      '      ( (',
      '       ) )',
      '    ........',
      '    |      |]',
      '    \\      /',
      '     `----\'',
      '',
      '<span class="warn">☕ Erro 418: I\'m a teapot.</span>',
      '<span class="dim">Mas aceito café em entrevistas.</span>'
    ].join('\n'),

    matrix: () => {
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
      let out = '';
      for (let i = 0; i < 5; i++) {
        let line = '';
        for (let j = 0; j < 60; j++) line += chars[Math.floor(Math.random() * chars.length)];
        out += '<span class="ok">' + line + '</span>\n';
      }
      return out + '\n<span class="dim">Wake up, Neo...</span>';
    },

    hack: () => [
      '<span class="warn">[!] A iniciar protocolo de hack...</span>',
      '<span class="dim">A contornar firewall............ OK</span>',
      '<span class="dim">A aceder à base de dados....... OK</span>',
      '<span class="dim">A extrair credenciais......... OK</span>',
      '<span class="ok">✓ Hack concluído em 0.42s</span>',
      '',
      '<span class="accent">Just kidding ;)</span> Não faço hacking — faço CRUD bem feito.'
    ].join('\n')
  };

  const write = (html, cls = '') => {
    const line = document.createElement('div');
    line.className = 'line' + (cls ? ' ' + cls : '');
    line.innerHTML = html;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  };

  const writePromptLine = (cmd) => {
    write('<span class="prompt">guest@mauricio</span><span class="dim">:</span><span class="path">~</span><span class="dim">$</span> <span class="cmd">' + cmd + '</span>');
  };

  async function typewriter(text, delay = 22) {
    busy = true;
    const line = document.createElement('div');
    line.className = 'line';
    line.innerHTML = '<span class="prompt">guest@mauricio</span><span class="dim">:</span><span class="path">~</span><span class="dim">$</span> <span class="cmd"></span>';
    body.appendChild(line);
    const cmdSpan = line.querySelector('.cmd');
    for (let i = 0; i < text.length; i++) {
      cmdSpan.textContent += text[i];
      body.scrollTop = body.scrollHeight;
      await sleep(delay);
    }
    busy = false;
  }

  function inputLine() {
    const line = document.createElement('div');
    line.className = 'line terminal-input-line';
    line.innerHTML = [
      '<span class="prompt">guest@mauricio</span>',
      '<span class="dim">:</span>',
      '<span class="path">~</span>',
      '<span class="dim">$</span>',
      '<input class="terminal-input" type="text" spellcheck="false" autocomplete="off" aria-label="Comando">'
    ].join('');
    body.appendChild(line);
    const input = line.querySelector('input');
    input.focus({ preventScroll: true });
    body.scrollTop = body.scrollHeight;

    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        if (busy || val === '') return;
        line.remove();
        writePromptLine(val);
        history.unshift(val);
        histIdx = -1;

        if (val === 'clear') {
          body.innerHTML = '';
        } else {
          const parts = val.split(/\s+/);
          const cmd = parts[0];
          const args = parts.slice(1);
          const fn = CMDS[cmd.toLowerCase()];

          if (!fn) {
            write('<span class="err">comando não encontrado:</span> ' + cmd + '. Escreve <span class="accent">help</span>.');
          } else if (cmd === 'open' || cmd === 'cat') {
            const ps = await Projects.load();
            const proj = ps.find(p => p.id === args[0]);
            if (!proj) {
              write('<span class="err">projeto não encontrado:</span> ' + (args[0] || '(vazio)') + '\n<span class="dim">usa <code>ls</code> para ver os ids</span>');
            } else if (cmd === 'open') {
              if (proj.link && proj.link !== '#') {
                window.open(proj.link, '_blank', 'noopener');
                write('<span class="ok">→</span> A abrir ' + proj.titulo + '...');
              } else {
                write('<span class="warn">⚠</span> ' + proj.titulo + ' ainda não tem link público.');
              }
            } else {
              write(
                '<span class="accent">' + proj.titulo + '</span>\n' +
                '  ' + proj.descricao + '\n' +
                '  <span class="dim">stack:</span> ' + proj.tecnologias.join(' · ') + '\n' +
                '  <span class="dim">link:</span> <a href="' + proj.link + '" target="_blank" rel="noopener">' + proj.link + '</a>'
              );
            }
          } else {
            const out = await fn(args);
            if (out) write(out);
          }
        }
        inputLine();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length === 0) return;
        histIdx = Math.min(histIdx + 1, history.length - 1);
        input.value = history[histIdx];
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx <= 0) { histIdx = -1; input.value = ''; return; }
        histIdx--;
        input.value = history[histIdx];
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const val = input.value.trim().toLowerCase();
        if (!val) return;
        const matches = Object.keys(CMDS).filter(c => c.startsWith(val));
        if (matches.length === 1) {
          input.value = matches[0];
        } else if (matches.length > 1) {
          writePromptLine(val);
          write('<span class="dim">' + matches.join('  ') + '</span>');
          inputLine();
        }
        return;
      }

      if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        body.innerHTML = '';
        inputLine();
      }
    });
  }

  async function init() {
    if (body.dataset.ready) return;
    body.dataset.ready = '1';
    body.innerHTML = '';

    await sleep(150);

    await typewriter('welcome', 22);
    write('<span class="ok">[OK]</span> Perfil carregado: Maurício Pates');
    write('<span class="ok">[OK]</span> 7 projetos indexados');
    write('<span class="ok">[OK]</span> Disponível para estágio Full Stack — nov/2026');
    write('');
    write('Escreve <span class="accent">help</span> para ver comandos. Usa <span class="accent">↑</span> para histórico, <span class="accent">Tab</span> para autocompletar.');
    write('');
    inputLine();
  }

  return { init };
})();

/* ============================================================
   MÓDULO 4 — TEMA
============================================================ */
const Theme = (() => {
  const KEY = 'theme';
  const DEFAULT = 'dark';

  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
    const lbl = $('#themeLabel');
    if (lbl) {
      const dict = (typeof I18N !== 'undefined') ? I18N[Lang.current()] : null;
      if (lbl.dataset.i18n && dict) {
        lbl.textContent = dict[lbl.dataset.i18n] || lbl.textContent;
      } else {
        lbl.textContent = t === 'dark' ? 'Escuro' : 'Claro';
      }
    }
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    const initial = saved || DEFAULT;
    apply(initial);

    const btn = $('#themeToggle');
    btn?.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || DEFAULT;
      apply(cur === 'dark' ? 'light' : 'dark');
    });
  }

  return { init, apply };
})();

/* ============================================================
   MÓDULO 5 — TOAST
============================================================ */
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

/* ============================================================
   MÓDULO 6 — FORMULÁRIO
============================================================ */
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

    function t(key) {
      const dict = I18N[Lang.current()];
      return (dict && dict[key]) || key;
    }

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
      if (!Object.keys(fields).every(validate)) {
        Toast.show(t('form.err.generic'), 'error');
        return;
      }
      const btn = $('#contact-submit');
      btn.disabled = true;
      const origText = btn.textContent;
      btn.textContent = t('form.sending');
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error();
        Toast.show(t('form.success'), 'success');
        form.reset();
        Object.values(fields).forEach(f => {
          f.el.classList.remove('invalid');
          f.err.textContent = '';
        });
      } catch {
        Toast.show(t('form.error'), 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = origText;
      }
    });

    document.addEventListener('langchange', () => {
      const b = $('#contact-submit');
      if (b && !b.disabled) b.textContent = t('form.submit');
    });
  }
  return { init };
})();

/* ============================================================
   MÓDULO 7 — FILTROS DO PORTFÓLIO (com contagem)
============================================================ */
const Filters = (() => {
  async function init() {
    const btns = $$('.filter-btn, .btn-filter');
    if (!btns.length) return;

    const containerCustom = $('#all-projects');
    const containerBootstrap = $('#portfolio-container');
    const all = await Projects.load();

    // Adiciona contagem aos botões
    btns.forEach(btn => {
      const f = btn.dataset.filter;
      const n = f === 'all' ? all.length : all.filter(p => p.categoria === f).length;
      if (!btn.querySelector('.count')) {
        const s = document.createElement('span');
        s.className = 'count';
        s.textContent = '(' + n + ')';
        btn.appendChild(s);
      }
    });

    const urlFilter = new URLSearchParams(location.search).get('filter');
    const initial = urlFilter
      ? (btns.find(b => b.dataset.filter.toLowerCase() === urlFilter.toLowerCase()) || btns[0])
      : btns[0];

    btns.forEach(b => b.classList.remove('active'));
    initial.classList.add('active');

    if (containerCustom) Projects.renderAll(initial.dataset.filter);
    if (containerBootstrap) renderBootstrap(initial.dataset.filter);

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (containerCustom) Projects.renderAll(btn.dataset.filter);
        if (containerBootstrap) renderBootstrap(btn.dataset.filter);

        const url = new URL(location.href);
        if (btn.dataset.filter === 'all') url.searchParams.delete('filter');
        else url.searchParams.set('filter', btn.dataset.filter);
        history.replaceState({}, '', url);
      });
    });
  }

  async function renderBootstrap(filter = 'all') {
    const el = $('#portfolio-container');
    if (!el) return;

    const all = await Projects.load();
    const list = filter === 'all' ? all : all.filter(p => p.categoria === filter);

    const dict = I18N[Lang.current()] || {};

    el.innerHTML = list.map(p => {
      const img = p.imagem
        ? `<img src="${p.imagem}" alt="${p.titulo}" class="card-img-top js-zoom" data-title="${p.titulo}" style="cursor:zoom-in" loading="lazy">`
        : '';
      const tags = p.tecnologias.map(t =>
        `<span class="badge bg-secondary me-1">${t}</span>`
      ).join('');
      const linkLabel = dict['portfolio.code'] || 'Ver código';
      const privLabel = dict['portfolio.private'] || 'Privado';
      const link = (p.link && p.link !== '#')
        ? `<a href="${p.link}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">${linkLabel} ↗</a>`
        : `<span class="btn btn-sm btn-secondary disabled">${privLabel}</span>`;

      return `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            ${img}
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.titulo}</h5>
              <p class="card-text small text-muted flex-grow-1">${p.descricao}</p>
              <div class="mb-2">${tags}</div>
              <div class="mt-auto">${link}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  return { init };
})();

/* ============================================================
   MÓDULO 8 — MODAL DE IMAGEM
============================================================ */
const Modal = (() => {
  function init() {
    const modal = $('#modal');
    if (!modal) return;
    const img = $('#modalImg');
    const title = $('#modalTitle');

    document.addEventListener('click', (e) => {
      const zoomable = e.target.closest('.js-zoom');
      if (zoomable) {
        img.src = zoomable.src;
        img.alt = zoomable.alt;
        title.textContent = zoomable.dataset.title || zoomable.alt || '';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        return;
      }
      if (e.target.closest('[data-close]')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
  return { init };
})();

/* ============================================================
   MÓDULO 9 — I18N
============================================================ */
const I18N = {
  pt: {
    'nav.profile': 'Perfil',
    'nav.portfolio': 'Portfólio',
    'nav.terminal': 'Terminal',
    'nav.contact': 'Contacto',
    'nav.theme.light': 'Claro',
    'nav.theme.dark': 'Escuro',
    'nav.theme.aria': 'Alternar tema',

    'hero.eyebrow': 'Disponível para estágio · nov 2026',
    'hero.role': 'Full Stack Developer',
    'hero.bio': 'Atualmente em transição de carreira com uma base sólida, possuo mais de <strong>10 anos de experiência em análise de dados comerciais</strong>, gestão de inventário e liderança de equipas. Aplico esse raciocínio analítico ao desenvolvimento de software — construo aplicações em <strong>Python</strong> e <strong>MySQL</strong> com foco em automação, bases de dados relacionais e boas práticas de engenharia.',
    'hero.cv': 'Descarregar CV',
    'hero.projects': 'Ver Projetos',
    'hero.stat.projects': 'Projetos',
    'hero.stat.tech': 'Tecnologias em aprendizagem',
    'hero.badge': 'Técnico Esp. TPSI · IEFP Porto',
    'hero.photo.alt': 'Maurício Souza Pates',

    'skills.tag': '// skills',
    'skills.title': 'Stack técnica',

    'featured.tag': '// projeto em destaque',
    'featured.title': 'Sistema de Gestão de Hostel',
    'featured.seeAll': 'Ver todos →',
    'featured.alt': 'Sistema de Gestão de Hostel',
    'featured.hint': 'clica para ampliar',
    'featured.h3': 'Sistema de Gestão de Alojamento Local',
    'featured.desc': 'Sistema administrativo e comercial para <strong>22 unidades</strong> em <strong>7 propriedades</strong> no Porto, em regime misto: arrendamento mensal partilhado e estadias curtas (Airbnb). Projeto individual da UFCD 26.0462 — análise, desenho, pseudocódigo e testes definidos antes da codificação.',
    'featured.code': 'Ver código ↗',
    'featured.process': '▸ Ver processo',

    'career.tag': '// percurso',
    'career.title': 'Experiência profissional',
    'career.sub': '10+ anos em retalho, liderança e análise comercial — a base que trago para o desenvolvimento de software.',
    'career.prev': 'Anterior',
    'career.next': 'Próximo',

    'certs.tag': '// certificados',
    'certs.title': 'Licenças e certificados',
    'certs.sub': 'Formação contínua em tecnologia, liderança e gestão — clica em cada bloco para expandir.',

    'about.tag': '// sobre',
    'about.title': 'Um pouco mais sobre mim',
    'about.p1': 'Mais de 10 anos em análise de dados comerciais, atualmente em transição para a área tecnológica, unindo a visão prática do setor comercial e o rigor da hotelaria ao desenvolvimento de aplicações modernas. Com foco em Python, bases de dados relacionais e desenvolvimento Web, aplico raciocínio analítico para transformar processos em código funcional e automatizado através do curso TPSI (IEFP Porto).',
    'about.p2': 'Construí um sistema de gestão para 22 unidades de alojamento em Python e MySQL, e um pipeline de importação de dados públicos para MySQL — aplicando à programação o mesmo raciocínio analítico da experiência anterior.',
    'about.p3': 'Disponível para <strong>estágio curricular</strong> (Formação em Contexto de Trabalho) a partir de novembro de 2026.',
    'about.location': 'Localização',
    'about.location.val': 'Cedofeita, Porto',
    'about.email': 'Email',
    'about.edu': 'Formação',
    'about.edu.val': 'TPSI · IEFP Porto (2026)',
    'about.langs': 'Idiomas',
    'about.langs.val': 'PT · EN (A2)',

    'cta.tag': '// contacto',
    'cta.title': 'Vamos falar',
    'cta.sub': 'Propostas de estágio, colaborações ou só conversa técnica — envia mensagem.',
    'cta.open': 'Abrir formulário',

    'contact.tag': '// contacto',
    'contact.title': 'Vamos falar',
    'contact.sub': 'Propostas de estágio, colaborações ou só conversa técnica — envia mensagem. Respondo normalmente em menos de 24h.',
    'contact.alt': 'Ou, se preferires:',

    'form.name': 'Nome',
    'form.name.ph': 'O teu nome',
    'form.email': 'Email',
    'form.email.ph': 'nome@empresa.com',
    'form.message': 'Mensagem',
    'form.message.ph': 'Como podemos colaborar?',
    'form.submit': 'Enviar mensagem',
    'form.sending': 'A enviar...',
    'form.success': '✓ Mensagem enviada. Obrigado!',
    'form.error': '✕ Falha ao enviar. Tenta novamente.',
    'form.err.name': 'Mínimo 3 caracteres.',
    'form.err.email': 'Email inválido.',
    'form.err.message': 'Mínimo 10 caracteres.',
    'form.err.generic': 'Corrige os campos assinalados.',

    'portfolio.title': 'Meu Portfólio Técnico',
    'portfolio.filter.hint': 'Filtre os projetos pelas tecnologias utilizadas abaixo:',
    'portfolio.filter.all': 'Todos',
    'portfolio.filter.web': 'Web (HTML/CSS/JS)',
    'portfolio.code': 'Ver código',
    'portfolio.private': 'Privado',

    'terminal.tag': '// terminal',
    'terminal.title': 'Terminal interativo',
    'terminal.sub': 'Escreve <code>help</code> para ver comandos. Usa <code>↑</code> para histórico, <code>Tab</code> para autocompletar.',

    'footer.rights': 'Todos os direitos reservados.',
    'footer.made': 'feito com HTML, CSS e JS puro',

    'boot.skip': 'saltar →',
    'boot.label': 'a carregar'
  },

  en: {
    'nav.profile': 'Profile',
    'nav.portfolio': 'Portfolio',
    'nav.terminal': 'Terminal',
    'nav.contact': 'Contact',
    'nav.theme.light': 'Light',
    'nav.theme.dark': 'Dark',
    'nav.theme.aria': 'Toggle theme',

    'hero.eyebrow': 'Available for internship · Nov 2026',
    'hero.role': 'Full Stack Developer',
    'hero.bio': 'Currently transitioning careers with a solid foundation, I bring over <strong>10 years of experience in commercial data analysis</strong>, inventory management and team leadership. I apply that analytical mindset to software development — building applications in <strong>Python</strong> and <strong>MySQL</strong> with a focus on automation, relational databases and engineering best practices.',
    'hero.cv': 'Download CV',
    'hero.projects': 'View Projects',
    'hero.stat.projects': 'Projects',
    'hero.stat.tech': 'Technologies in learning',
    'hero.badge': 'TPSI Specialist Technician · IEFP Porto',
    'hero.photo.alt': 'Maurício Souza Pates',

    'skills.tag': '// skills',
    'skills.title': 'Tech stack',

    'featured.tag': '// featured project',
    'featured.title': 'Hostel Management System',
    'featured.seeAll': 'See all →',
    'featured.alt': 'Hostel Management System',
    'featured.hint': 'click to enlarge',
    'featured.h3': 'Local Accommodation Management System',
    'featured.desc': 'Administrative and commercial system for <strong>22 units</strong> across <strong>7 properties</strong> in Porto, under a mixed model: shared monthly rentals and short stays (Airbnb). Individual project for UFCD 26.0462 — analysis, design, pseudocode and tests defined before coding.',
    'featured.code': 'View code ↗',
    'featured.process': '▸ View process',

    'career.tag': '// career',
    'career.title': 'Professional experience',
    'career.sub': '10+ years in retail, leadership and commercial analysis — the foundation I bring to software development.',
    'career.prev': 'Previous',
    'career.next': 'Next',

    'certs.tag': '// certificates',
    'certs.title': 'Licenses & certificates',
    'certs.sub': 'Continuous training in tech, leadership and management — click each block to expand.',

    'about.tag': '// about',
    'about.title': 'A bit more about me',
    'about.p1': 'Over 10 years in commercial data analysis, currently transitioning into tech — combining hands-on commercial and hospitality experience with modern application development. With a focus on Python, relational databases and web development, I apply analytical thinking to turn processes into functional, automated code through the TPSI course (IEFP Porto).',
    'about.p2': 'I built a management system for 22 accommodation units in Python and MySQL, plus a public data import pipeline to MySQL — applying to programming the same analytical thinking from my previous experience.',
    'about.p3': 'Available for a <strong>curricular internship</strong> (Work Context Training) from November 2026.',
    'about.location': 'Location',
    'about.location.val': 'Cedofeita, Porto',
    'about.email': 'Email',
    'about.edu': 'Education',
    'about.edu.val': 'TPSI · IEFP Porto (2026)',
    'about.langs': 'Languages',
    'about.langs.val': 'PT · EN (A2)',

    'cta.tag': '// contact',
    'cta.title': "Let's talk",
    'cta.sub': 'Internship offers, collaborations or just tech talk — send a message.',
    'cta.open': 'Open form',

    'contact.tag': '// contact',
    'contact.title': "Let's talk",
    'contact.sub': 'Internship offers, collaborations or just tech talk — send a message. I usually reply within 24h.',
    'contact.alt': 'Or, if you prefer:',

    'form.name': 'Name',
    'form.name.ph': 'Your name',
    'form.email': 'Email',
    'form.email.ph': 'name@company.com',
    'form.message': 'Message',
    'form.message.ph': 'How can we collaborate?',
    'form.submit': 'Send message',
    'form.sending': 'Sending...',
    'form.success': '✓ Message sent. Thank you!',
    'form.error': '✕ Failed to send. Please try again.',
    'form.err.name': 'Minimum 3 characters.',
    'form.err.email': 'Invalid email.',
    'form.err.message': 'Minimum 10 characters.',
    'form.err.generic': 'Please fix the highlighted fields.',

    'portfolio.title': 'My Technical Portfolio',
    'portfolio.filter.hint': 'Filter projects by technology used below:',
    'portfolio.filter.all': 'All',
    'portfolio.filter.web': 'Web (HTML/CSS/JS)',
    'portfolio.code': 'View code',
    'portfolio.private': 'Private',

    'terminal.tag': '// terminal',
    'terminal.title': 'Interactive terminal',
    'terminal.sub': 'Type <code>help</code> to see commands. Use <code>↑</code> for history, <code>Tab</code> to autocomplete.',

    'footer.rights': 'All rights reserved.',
    'footer.made': 'built with pure HTML, CSS and JS',

    'boot.skip': 'skip →',
    'boot.label': 'loading'
  }
};

const Lang = (() => {
  const KEY = 'lang';
  const DEFAULT = 'pt';

  function current() {
    return localStorage.getItem(KEY) || DEFAULT;
  }

  function apply(lang) {
    const dict = I18N[lang] || I18N[DEFAULT];
    if (!dict) return;

    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-PT' : 'en');
    localStorage.setItem(KEY, lang);

    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    $$('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    $$('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });

    $$('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      if (dict[key] !== undefined) el.title = dict[key];
    });

    $$('[data-i18n-aria]').forEach(el => {
      const key = el.dataset.i18nAria;
      if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
    });

    $$('[data-i18n-alt]').forEach(el => {
      const key = el.dataset.i18nAlt;
      if (dict[key] !== undefined) el.alt = dict[key];
    });

    $$('.lang').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    const themeLabel = $('#themeLabel');
    if (themeLabel) {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      themeLabel.textContent = theme === 'dark' ? dict['nav.theme.dark'] : dict['nav.theme.light'];
    }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function init() {
    const buttons = $$('.lang');
    const initial = current();
    apply(initial);

    buttons.forEach(b => {
      b.addEventListener('click', () => {
        const lang = b.dataset.lang;
        if (lang && lang !== current()) apply(lang);
      });
    });
  }

  return { init, apply, current };
})();

/* ============================================================
   MÓDULO 10 — STACK COM ÍCONES
============================================================ */
const StackIcons = (() => {
  const BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

  const ICONS = [
    { name: 'Python',       file: 'python/python-original.svg' },
    { name: 'Java',         file: 'java/java-original.svg' },
    { name: 'HTML5',        file: 'html5/html5-original.svg' },
    { name: 'CSS3',         file: 'css3/css3-original.svg' },
    { name: 'JavaScript',   file: 'javascript/javascript-original.svg' },
    { name: 'MySQL',        file: 'mysql/mysql-original.svg' },
    { name: 'PostgreSQL',   file: 'postgresql/postgresql-original.svg' },
    { name: 'SQL Server',   file: 'microsoftsqlserver/microsoftsqlserver-plain.svg' },
    { name: 'Git',          file: 'git/git-original.svg' },
    { name: 'Node.js',      file: 'nodejs/nodejs-original.svg' },
    { name: 'VS Code',      file: 'vscode/vscode-original.svg' },
    { name: 'Linux',        file: 'linux/linux-original.svg' },
    { name: 'Proxmox',      file: 'proxmox/proxmox-original.svg' }
  ];

  function render() {
    const el = $('#stackIcons');
    if (!el) return;
    el.innerHTML = ICONS.map(icon => [
      '<div class="stack-item" title="' + icon.name + '">',
        '<img src="' + BASE + icon.file + '" alt="' + icon.name + '" width="48" height="48" loading="lazy">',
        '<span class="stack-item-name">' + icon.name + '</span>',
      '</div>'
    ].join('')).join('');
  }

  return { render };
})();

/* ============================================================
   MÓDULO 11 — TERMINAL DO PROJETO EM DESTAQUE
============================================================ */
const FeaturedTerminal = (() => {
  const SCRIPT = [
    { text: 'cd ~/projetos/hostel_gestao', isCmd: true },
    { text: '<span class="dim"># Sistema de gestão de alojamento local — Porto</span>' },
    { text: '<span class="dim"># 22 unidades · 7 propriedades · regime misto</span>' },
    { text: '' },
    { text: 'cat README.md', isCmd: true },
    { text: '<span class="accent">## Fase 1.0 — CLI + JSON</span> <span class="ok">(em curso)</span>' },
    { text: '  Lógica de negócio completa com persistência em JSON.' },
    { text: '  Apenas biblioteca padrão do Python 3.11.' },
    { text: '  Testes com <span class="key">unittest</span> — sobreposição escrita antes do código.' },
    { text: '' },
    { text: '<span class="accent">## Regimes de ocupação</span>' },
    { text: '  <span class="key">Mensal</span>    3 unidades · contrato por pessoa · partilhada' },
    { text: '  <span class="key">Airbnb</span>   19 unidades · reserva exclusiva · 45–90 €/noite' },
    { text: '' },
    { text: '<span class="accent">## Modelo de dados</span>' },
    { text: '  Unidades → quartos → lugares' },
    { text: '  Capacidade <span class="ok">calculada</span>, nunca guardada.' },
    { text: '  14 tabelas · 15 relações · DDL para SQLite e MySQL.' },
    { text: '' },
    { text: 'cat docs/1_analise/arquitetura.md | head -6', isCmd: true },
    { text: '<span class="ok">✓</span> Camada de repositório — JSON → SQLite → MySQL sem tocar na lógica' },
    { text: '<span class="ok">✓</span> Interface separada da lógica — sem input()/print() nos módulos' },
    { text: '<span class="ok">✓</span> Calcular em vez de guardar — estado, capacidade, stock' },
    { text: '<span class="ok">✓</span> Movimentos de stock imutáveis — correção por ajuste' },
    { text: '<span class="ok">✓</span> Configuração em dois níveis — global + por unidade' },
    { text: '<span class="ok">✓</span> Validação de sobreposição de datas' },
    { text: '' },
    { text: 'git log --oneline | head -3', isCmd: true },
    { text: '<span class="dim">a1f3c9e</span> docs: 17 decisões de arquitetura' },
    { text: '<span class="dim">b8d2e1a</span> feat: contratos + sobreposição' },
    { text: '<span class="dim">c4a9f7b</span> chore: estrutura inicial' },
    { text: '' },
    { text: 'echo "Disponível para estágio · nov 2026"', isCmd: true },
    { text: '<span class="ok">Disponível para estágio · nov 2026</span>' },
    { text: '' },
    { text: '<span class="dim">→ clica em "Ver código" para o repositório completo</span>' }
  ];

  const T = { cmdChar: 80, line: 400, blank: 200, afterCmd: 350, afterHvy: 250 };

  let body, thumb, terminal, closeBtn, toggleBtn;
  let typing = false;
  let done = false;
  let closeTimer = null;

  function smoothScroll() {
    if (!body) return;
    body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
  }

  async function typeScript() {
    if (typing || done || !body) return;
    typing = true;
    body.innerHTML = '';

    for (const line of SCRIPT) {
      if (!typing) break;
      const div = document.createElement('div');
      div.className = 'line';
      body.appendChild(div);

      if (line.isCmd) {
        div.innerHTML = '<span class="prompt">guest@hostel</span><span class="dim">:</span><span class="path">~/projetos</span><span class="dim">$</span> <span class="cmd"></span>';
        const cmdSpan = div.querySelector('.cmd');
        for (let i = 0; i < line.text.length; i++) {
          cmdSpan.textContent += line.text[i];
          smoothScroll();
          await sleep(T.cmdChar);
        }
        await sleep(T.afterCmd);
      } else {
        div.innerHTML = line.text || '&nbsp;';
        smoothScroll();
        const hasCheckmark = line.text.includes('✓');
        await sleep(line.text ? (hasCheckmark ? T.line + T.afterHvy : T.line) : T.blank);
      }
    }
    typing = false;
    done = true;
  }

  function open() {
    if (!terminal) return;
    clearTimeout(closeTimer);
    terminal.classList.add('open');
    terminal.setAttribute('aria-hidden', 'false');
    if (!done) typeScript();
  }

  function close() {
    if (!terminal) return;
    terminal.classList.remove('open');
    terminal.setAttribute('aria-hidden', 'true');
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      const overTerminal = terminal.matches(':hover');
      const overThumb = thumb.matches(':hover');
      const overBody = body.matches(':hover');
      if (!overTerminal && !overThumb && !overBody) close();
    }, 500);
  }

  function init() {
    thumb = $('#featuredThumb');
    terminal = $('#featuredTerminal');
    body = $('#featuredTerminalBody');
    closeBtn = $('#featuredTerminalClose');
    toggleBtn = $('#featuredToggleTerminal');
    if (!thumb || !terminal || !body) return;

    thumb.addEventListener('mouseenter', open);
    thumb.addEventListener('mouseleave', scheduleClose);

    terminal.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    terminal.addEventListener('mouseleave', scheduleClose);

    toggleBtn?.addEventListener('click', () => {
      if (terminal.classList.contains('open')) close();
      else open();
    });

    closeBtn?.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (terminal.classList.contains('open')) close();
        thumb.classList.remove('zoomed');
      }
    });

    thumb.addEventListener('click', (e) => {
      if (e.target.closest('.featured-hint')) return;
      thumb.classList.toggle('zoomed');
    });
  }

  return { init };
})();

/* ============================================================
   MÓDULO 12 — CARROSSEL DE PERCURSO
============================================================ */
const CareerCarousel = (() => {
  let track, prevBtn, nextBtn, dotsWrap;
  let cards = [];
  let index = 0;
  let perView = 3;
  let total = 0;
  let maxIndex = 0;

  function getPerView() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function computeMaxIndex() {
    maxIndex = Math.max(0, total - perView);
  }

  function gapPx() { return 20; }

  function update() {
    if (!track || !cards.length) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const offset = index * (cardWidth + gapPx());
    track.style.transform = 'translateX(-' + offset + 'px)';

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index >= maxIndex;

    if (dotsWrap) {
      [...dotsWrap.children].forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    }
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot';
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', 'Ir para etapa ' + (i + 1));
      btn.addEventListener('click', () => {
        index = i;
        update();
      });
      dotsWrap.appendChild(btn);
    }
  }

  function recompute() {
    perView = getPerView();
    computeMaxIndex();
    if (index > maxIndex) index = maxIndex;
    buildDots();
    update();
  }

  function init() {
    track = $('#carouselTrack');
    prevBtn = $('#carouselPrev');
    nextBtn = $('#carouselNext');
    dotsWrap = $('#carouselDots');
    if (!track || !prevBtn || !nextBtn) return;

    cards = $$('.career-card', track);
    total = cards.length;
    if (!total) return;

    recompute();

    prevBtn.addEventListener('click', () => {
      if (index > 0) { index--; update(); }
    });
    nextBtn.addEventListener('click', () => {
      if (index < maxIndex) { index++; update(); }
    });

    document.addEventListener('keydown', (e) => {
      const rect = track.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') { if (index > 0) { index--; update(); } }
      if (e.key === 'ArrowRight') { if (index < maxIndex) { index++; update(); } }
    });

    let rTimer;
    window.addEventListener('resize', () => {
      clearTimeout(rTimer);
      rTimer = setTimeout(recompute, 150);
    });
  }

  return { init };
})();

/* ============================================================
   MÓDULO 13 — CERTIFICADOS
============================================================ */
const Certs = (() => {
  const CERTS = [
    {
      id: 'sql',
      titulo: 'Banco de Dados SQL do Zero ao Avançado + Projetos Reais',
      emissor: 'Udemy',
      data: 'jul 2026',
      cor: '#a435f0',
      inicial: 'U',
      skills: ['SQL', 'MySQL', 'Modelação', 'Queries avançadas'],
      resumo: 'Do modelo relacional às queries complexas — joins, subqueries, índices e otimização de performance.'
    },
    {
      id: 'clc',
      titulo: 'CLC — Curso de Liderança Contemporânea',
      emissor: 'Drogarias Campeã',
      data: 'out 2021',
      cor: '#0066b3',
      inicial: 'DC',
      skills: ['Liderança', 'Gestão de equipa', 'Feedback'],
      resumo: 'Formação interna focada em liderança prática, motivação de equipas e gestão de conflitos.'
    },
    {
      id: 'oratoria',
      titulo: 'Comunicação e Oratória',
      emissor: 'Escola Conquer',
      data: 'ago 2021',
      cor: '#ff6b00',
      inicial: 'C',
      skills: ['Comunicação', 'Apresentações', 'Storytelling'],
      resumo: 'Técnicas de comunicação clara e apresentação em público para contextos profissionais.'
    },
    {
      id: 'gestao',
      titulo: 'Gestão e Liderança: Conceitos Básicos da Função Gerencial',
      emissor: 'Fundação Getulio Vargas',
      data: 'mai 2020',
      cor: '#003da5',
      inicial: 'FGV',
      skills: ['Gestão', 'Liderança', 'Planeamento'],
      resumo: 'Fundamentos da função gerencial: planeamento, organização, direção e controlo de recursos.'
    },
    {
      id: 'vendas',
      titulo: 'Gestão de Vendas: Noções Básicas de Criação de Estratégia',
      emissor: 'Fundação Getulio Vargas',
      data: 'abr 2020',
      cor: '#003da5',
      inicial: 'FGV',
      skills: ['Vendas', 'Estratégia', 'Métricas'],
      resumo: 'Construção de estratégias comerciais, definição de metas e acompanhamento de resultados.'
    },
    {
      id: 'excel',
      titulo: 'Microsoft Excel 2013 — Avançado',
      emissor: 'Fundação Bradesco',
      data: 'jul 2019',
      cor: '#cc092f',
      inicial: 'FB',
      skills: ['Excel', 'Fórmulas', 'Tabelas dinâmicas'],
      resumo: 'Fórmulas avançadas, tabelas dinâmicas, macros básicas e análise de dados em planilhas.'
    },
    {
      id: 'coach',
      titulo: 'Leader Coach Training',
      emissor: 'Instituto Brasileiro de Coaching — IBC',
      data: 'ago 2018',
      cor: '#f5a623',
      inicial: 'IBC',
      skills: ['Coaching', 'Desenvolvimento pessoal', 'Mentoria'],
      resumo: 'Formação em técnicas de coaching aplicadas à liderança e desenvolvimento de equipas.'
    }
  ];

  function cardHTML(c) {
    const skills = c.skills.map(s => '<span class="tag">' + s + '</span>').join('');
    return [
      '<article class="cert-card" data-cert="' + c.id + '" style="--cert-color:' + c.cor + '">',
        '<div class="cert-head">',
          '<span class="cert-logo" style="background:' + c.cor + '">' + c.inicial + '</span>',
          '<div class="cert-head-text">',
            '<span class="cert-emissor">' + c.emissor + '</span>',
            '<span class="cert-date">' + c.data + '</span>',
          '</div>',
          '<span class="cert-toggle" aria-hidden="true">+</span>',
        '</div>',
        '<h3 class="cert-title">' + c.titulo + '</h3>',
        '<div class="cert-body">',
          '<p class="cert-resumo">' + c.resumo + '</p>',
          '<div class="cert-skills">' + skills + '</div>',
        '</div>',
      '</article>'
    ].join('');
  }

  function render() {
    const el = $('#certsGrid');
    if (!el) return;
    el.innerHTML = CERTS.map(cardHTML).join('');

    const first = el.querySelector('.cert-card');
    first?.classList.add('open');

    el.addEventListener('click', (e) => {
      const card = e.target.closest('.cert-card');
      if (!card) return;
      card.classList.toggle('open');
    });

    el.querySelectorAll('.cert-card').forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          card.classList.toggle('open');
        }
      });
    });
  }

  return { render };
})();
/* ============================================================
   MÓDULO 14 — UI EXTRAS (progresso, reveal, back-to-top, copy, cv)
============================================================ */
const UI = (() => {
  // 1. Barra de progresso de leitura
  function initProgress() {
    const bar = $('#readProgress');
    if (!bar) return;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // 2. Scroll reveal
  function initReveal() {
    const els = $$('.reveal');
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
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
  }

  // 3. Back to top
  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;
    const toggle = () => {
      btn.classList.toggle('show', window.scrollY > 500);
    };
    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggle();
  }

  // 4. Copiar email
  function initCopyEmail() {
    $$('.copy-email').forEach(el => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        const txt = el.dataset.copy || el.textContent.trim();
        try {
          await navigator.clipboard.writeText(txt);
          el.classList.add('copied');
          Toast.show('✓ Email copiado para a área de transferência', 'success');
          setTimeout(() => el.classList.remove('copied'), 1800);
        } catch {
          // fallback: abre mailto
          window.location.href = 'mailto:' + txt;
        }
      });
    });
  }

  // 5. Download do CV com verificação
  function initCV() {
    const links = $$('[data-cv]');
    if (!links.length) return;
    links.forEach(link => {
      link.addEventListener('click', async (e) => {
        const href = link.getAttribute('href');
        try {
          const res = await fetch(href, { method: 'HEAD' });
          if (!res.ok) throw new Error('404');
        } catch {
          e.preventDefault();
          Toast.show('✕ CV não encontrado. Verifica se o ficheiro está em cv/Mauricio_Pates_CV.pdf', 'error');
        }
      });
    });
  }

  function init() {
    initProgress();
    initReveal();
    initBackToTop();
    initCopyEmail();
    initCV();
  }

  return { init };
})();
/* ============================================================
   BOOTSTRAP DA APP
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Modal.init();
  Lang.init();

  const hasBoot = !!$('#bootScreen');
  if (hasBoot) {
    Boot.run();
  } else {
    $('#app')?.classList.remove('hidden');
  }

  if ($('#terminalBody')) {
    Terminal.init();
  }

  Filters.init();
  ContactForm.init();

  StackIcons.render();
  FeaturedTerminal.init();
  CareerCarousel.init();
  Certs.render();
});