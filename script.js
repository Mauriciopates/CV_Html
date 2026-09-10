document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       1. BASE DE DADOS DINÂMICA COM CAMINHOS LOCAIS 
       ========================================================================== */
    const meusProjetos = [
        {
            titulo: "Sistema de Gestão de Hostel",
            categoria: "Python",
            destaque: true,
            imagem: "img/hostel-diagrama-er.png",
            imagemAlt: "Diagrama entidade-relação com 17 tabelas do sistema de gestão de hostel",
            descricao: "Sistema de gestão administrativa para 22 unidades de alojamento no Porto (regime mensal e Airbnb), em Python com persistência em MySQL. Lógica de negócio desacoplada da interface (CLI hoje, GUI prevista), com quase 400 testes automatizados.",
            tecnologias: ["Python", "MySQL", "unittest"],
            link: "https://github.com/Mauriciopates/hostel_gestao"
        },
        {
            titulo: "Pipeline de Dados SIAPE",
            categoria: "Python",
            imagem: "img/Database_automation_SIAPEpng.png",
            imagemAlt: "Painel de Controlo SIAPE — interface gráfica com ligação MySQL, download e importação de dados do Portal da Transparência",
            descricao: "Pipeline em Python para descarregar, tratar e importar dados públicos de remuneração de funcionários federais (Portal da Transparência) para MySQL remoto, com inserções em lote e prevenção de duplicados. Inclui painel gráfico (Tkinter) para gerir a ligação MySQL e correr cada etapa do processo.",
            tecnologias: ["Python", "MySQL", "ETL"],
            link: "https://github.com/Mauriciopates/Database_automation_SIAPE"
        },
        {
            titulo: "Automação CPGF/GPGF — Portal da Transparência",
            categoria: "Python",
            imagem: "img/Database_automation_GPGF.png",
            imagemAlt: "Menu de manutenção CPGF no terminal e registo da importação de um CSV para MySQL",
            descricao: "Script Python de linha de comandos para automatizar a manutenção da tabela CPGF por ano: exportação de CSV do Portal da Transparência, correção e renomeação de ficheiros, diagnóstico e importação em lote para MySQL, com barra de progresso e contagem total de registos importados.",
            tecnologias: ["Python", "MySQL", "CLI"],
            link: "https://github.com/Mauriciopates/Database_automation_GPGF"
        },
        {
            titulo: "Relatorios.py — Sistema de Relatórios",
            categoria: "Python",
            imagem: "img/Projeto_segurança_relatorios.png",
            imagemAlt: "Aplicação desktop de relatórios de segurança",
            descricao: "Aplicação desktop (Tkinter) de relatórios de segurança, desenvolvida em equipa: interface com Treeview, gráficos incorporados com matplotlib e build em executável com PyInstaller.",
            tecnologias: ["Python", "Tkinter", "Matplotlib"],
            link: "https://github.com/Mauriciopates/Projeto_seguranca"
        },
        {
            titulo: "Curiosidades Ocultas",
            categoria: "Web",
            descricao: "Aplicação interativa desenvolvida com HTML, CSS e JavaScript.",
            tecnologias: ["HTML5", "CSS3", "JavaScript"],
            link: "./Projetos_html/Curiosidades_ocultas/curiosidade.html"
        },
        {
            titulo: "Jogo da Adivinha",
            categoria: "Web",
            descricao: "Jogo dinâmico de adivinhação com lógica em JavaScript.",
            tecnologias: ["HTML5", "CSS3", "JavaScript"],
            link: "./Projetos_html/Jogo_adivinha/adivinha.html"
        },
        {
            titulo: "Simulador de Circuitos Arduino",
            categoria: "Java",
            descricao: "Aplicação desktop focada em mapear os pinos lógicos de uma placa Arduino.",
            tecnologias: ["Java", "Swing"],
            link: "#" // TODO: colar aqui o link do repositório GitHub deste projeto
        }
    ];

    // Array de objetos: competências técnicas (deixaram de estar escritas diretamente no HTML)
    const competencias = [
        { nome: "Python", grupo: "linguagens" },
        { nome: "Java", grupo: "linguagens" },
        { nome: "C", grupo: "linguagens" },
        { nome: "JavaScript", grupo: "linguagens" },
        { nome: "HTML5", grupo: "linguagens" },
        { nome: "CSS3", grupo: "linguagens" }
    ];

    /* ==========================================================================
       1b. RENDERIZAÇÃO DINÂMICA DAS COMPETÊNCIAS TÉCNICAS
       ========================================================================== */
    const skillsContainer = document.getElementById("skills-linguagens");

    if (skillsContainer) {
        competencias
            .filter(c => c.grupo === "linguagens")
            .forEach(c => {
                const badge = document.createElement("span");
                badge.className = "badge bg-primary";
                badge.textContent = c.nome;
                skillsContainer.appendChild(badge);
            });
    }

    const container = document.getElementById("portfolio-container");

    /* ==========================================================================
       2. RENDERIZAÇÃO DOS CARDS COM BOTÃO DE ACESSO
       ========================================================================== */
    if (container) {

        function renderizarProjetos(listaProjetos) {
            container.innerHTML = "";

            if (listaProjetos.length === 0) {
                container.innerHTML = "<div class='col-12'><p class='text-muted'>Nenhum projeto encontrado para esta categoria.</p></div>";
                return;
            }

            listaProjetos.forEach(projeto => {
                const col = document.createElement("div");
                // O cartão em destaque ocupa a largura toda para a imagem ficar legível
                if (projeto.destaque) {
                    col.classList.add("col-12");
                } else {
                    col.classList.add("col-md-6", "col-lg-4");
                }

                let tagsHTML = "";
                projeto.tecnologias.forEach(tech => {
                    tagsHTML += `<span class="badge bg-info text-dark me-1">${tech}</span>`;
                });

                // Sem link público ainda: mostra um selo neutro em vez de um botão que leva a lado nenhum
                const temLink = projeto.link && projeto.link !== "#";
                const botaoHTML = temLink
                    ? `<a href="${projeto.link}" target="_blank" class="btn btn-sm btn-outline-primary w-100 fw-bold">Ver Projeto &rarr;</a>`
                    : `<span class="btn btn-sm btn-outline-secondary disabled w-100 fw-bold">Repositório privado</span>`;

                const destaqueHTML = projeto.destaque
                    ? `<span class="badge bg-warning text-dark mb-2">⭐ Projeto em Destaque</span><br>`
                    : "";

                if (projeto.destaque && projeto.imagem) {
                    // Layout lado-a-lado: imagem à esquerda, texto à direita (empilha em telas pequenas)
                    col.innerHTML = `
                        <article class="card h-100 border border-warning shadow-sm">
                            <div class="row g-0 align-items-stretch">
                                <div class="col-md-6 project-thumb-wrap">
                                    <img src="${projeto.imagem}" alt="${projeto.imagemAlt || projeto.titulo}" class="project-thumb js-zoomable" data-titulo="${projeto.titulo}" loading="lazy">
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body d-flex flex-column justify-content-between h-100">
                                        <div>
                                            ${destaqueHTML}
                                            <h5 class="card-title text-primary fw-bold mb-2">${projeto.titulo}</h5>
                                            <p class="card-text text-secondary small mb-3">${projeto.descricao}</p>
                                            <div class="mb-3">${tagsHTML}</div>
                                        </div>
                                        <div>${botaoHTML}</div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    `;
                    container.appendChild(col);
                    return;
                }

                // Suporta um único "imagem" ou uma galeria "imagens" (várias capturas por projeto)
                let mediaHTML = "";
                if (Array.isArray(projeto.imagens) && projeto.imagens.length > 0) {
                    const totalImgs = projeto.imagens.length;
                    const miniaturas = projeto.imagens.map((src, i) => `
                        <div class="col-6">
                            <img src="${src}" alt="${(projeto.imagemAlt || projeto.titulo)} (${i + 1}/${totalImgs})" class="project-thumb-mini js-zoomable" data-titulo="${projeto.titulo} (${i + 1}/${totalImgs})" loading="lazy">
                        </div>`).join("");
                    mediaHTML = `<div class="row g-1 p-1">${miniaturas}</div>`;
                } else if (projeto.imagem) {
                    mediaHTML = `<img src="${projeto.imagem}" alt="${projeto.imagemAlt || projeto.titulo}" class="card-img-top project-thumb js-zoomable" data-titulo="${projeto.titulo}" loading="lazy">`;
                }

                col.innerHTML = `
                    <article class="card h-100 border shadow-sm">
                        ${mediaHTML}
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                ${destaqueHTML}
                                <h5 class="card-title text-primary fw-bold mb-2">${projeto.titulo}</h5>
                                <p class="card-text text-secondary small mb-3">${projeto.descricao}</p>
                                <div class="mb-3">
                                    ${tagsHTML}
                                </div>
                            </div>
                            <div>
                                ${botaoHTML}
                            </div>
                        </div>
                    </article>
                `;

                container.appendChild(col);
            });
        }

        // Renderiza tudo ao carregar
        renderizarProjetos(meusProjetos);

        // Clique numa imagem "ampliável" abre-a em grande dentro do modal Bootstrap
        container.addEventListener("click", (evento) => {
            const img = evento.target.closest(".js-zoomable");
            if (!img) return;
            const modalImg = document.getElementById("imageModalImg");
            const modalLabel = document.getElementById("imageModalLabel");
            if (!modalImg || typeof bootstrap === "undefined") return;
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            if (modalLabel) modalLabel.textContent = img.dataset.titulo || img.alt;
            new bootstrap.Modal(document.getElementById("imageModal")).show();
        });

        /* ==========================================================================
           3. FILTROS DE CATEGORIA E FEEDBACK (TOAST)
           ========================================================================== */
        const botoesFiltro = document.querySelectorAll(".btn-filter");

        // Deep-link: se a página abrir com ?filter=Python, aplica esse filtro automaticamente
        const filtroNaURL = new URLSearchParams(window.location.search).get("filter");
        if (filtroNaURL) {
            const botaoCorrespondente = Array.from(botoesFiltro)
                .find(b => b.dataset.filter && b.dataset.filter.toLowerCase() === filtroNaURL.toLowerCase());
            if (botaoCorrespondente) botaoCorrespondente.click();
        }

        botoesFiltro.forEach(botao => {
            botao.addEventListener("click", (evento) => {
                botoesFiltro.forEach(btn => btn.classList.remove("active"));
                evento.target.classList.add("active");

                const categoria = evento.target.getAttribute("data-filter") || evento.target.textContent.trim();
                
                // Aplica a filtragem real dos projetos
                if (categoria === "Todos" || categoria === "todos") {
                    renderizarProjetos(meusProjetos);
                } else {
                    const projetosFiltrados = meusProjetos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
                    renderizarProjetos(projetosFiltrados);
                }

                // Dispara o Toast do Bootstrap como feedback
                const toastEl = document.getElementById('filterToast');
                const toastMsg = document.getElementById('toastMessage');

                if (toastEl && toastMsg && typeof bootstrap !== "undefined") {
                    toastMsg.textContent = `Projetos filtrados por: ${evento.target.textContent.trim()}`;
                    const toast = new bootstrap.Toast(toastEl);
                    toast.show();
                }
            });
        });
    }
    
});

/* ==========================================================================
   4. MODO ESCURO NATIVO DO BOOTSTRAP 5.3+
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("themeToggle");
    
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    document.documentElement.setAttribute("data-bs-theme", currentTheme);
    
    if (themeToggleBtn) {
        themeToggleBtn.innerText = currentTheme === "dark" ? "☀️ Modo Claro" : "🌙 Modo Escuro";

        themeToggleBtn.addEventListener("click", () => {
            const activeTheme = document.documentElement.getAttribute("data-bs-theme");
            const newTheme = activeTheme === "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-bs-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            themeToggleBtn.innerText = newTheme === "dark" ? "☀️ Modo Claro" : "🌙 Modo Escuro";
        });
    }
});

/* ==========================================================================
   5. FORMULÁRIO DE CONTACTO — VALIDAÇÃO E SUBMISSÃO EM JAVASCRIPT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const campos = {
        name: { input: document.getElementById("name"), erro: document.getElementById("name-error") },
        email: { input: document.getElementById("email"), erro: document.getElementById("email-error") },
        message: { input: document.getElementById("message"), erro: document.getElementById("message-error") }
    };

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Estrutura de decisão: cada campo tem a sua própria regra de validação
    function validarCampo(chave) {
        const valor = campos[chave].input.value.trim();
        let mensagem = "";

        if (chave === "name") {
            if (valor.length < 3) mensagem = "Indica o teu nome completo (mín. 3 caracteres).";
        } else if (chave === "email") {
            if (!regexEmail.test(valor)) mensagem = "Escreve um e-mail válido (ex: nome@empresa.com).";
        } else if (chave === "message") {
            if (valor.length < 10) mensagem = "A mensagem deve ter pelo menos 10 caracteres.";
        }

        const valido = mensagem === "";
        campos[chave].input.classList.toggle("is-invalid", !valido);
        campos[chave].input.classList.toggle("is-valid", valido && valor !== "");
        campos[chave].erro.textContent = mensagem;

        return valido;
    }

    // Valida em tempo real enquanto a pessoa escreve
    Object.keys(campos).forEach(chave => {
        campos[chave].input.addEventListener("input", () => validarCampo(chave));
    });

    function mostrarToast(elId, msgId, texto, corClasse) {
        const toastEl = document.getElementById(elId);
        const toastMsg = document.getElementById(msgId);
        if (!toastEl || !toastMsg || typeof bootstrap === "undefined") return;

        toastEl.classList.remove("text-bg-success", "text-bg-danger");
        toastEl.classList.add(corClasse);
        toastMsg.textContent = texto;
        new bootstrap.Toast(toastEl).show();
    }

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        // Só avança se TODOS os campos passarem na validação (estrutura de decisão)
        const todosValidos = Object.keys(campos).every(chave => validarCampo(chave));
        if (!todosValidos) {
            mostrarToast("contactToast", "contactToastMessage", "Corrige os campos assinalados antes de enviar.", "text-bg-danger");
            return;
        }

        const submitBtn = document.getElementById("contact-submit");
        const textoOriginal = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "A enviar...";

        try {
            const resposta = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { "Accept": "application/json" }
            });

            if (resposta.ok) {
                mostrarToast("contactToast", "contactToastMessage", "✓ Mensagem enviada com sucesso. Obrigado pelo contacto!", "text-bg-success");
                form.reset();
                Object.keys(campos).forEach(chave => {
                    campos[chave].input.classList.remove("is-valid", "is-invalid");
                });
            } else {
                throw new Error("Falha no envio");
            }
        } catch (erro) {
            mostrarToast("contactToast", "contactToastMessage", "✕ Não foi possível enviar agora. Tenta novamente.", "text-bg-danger");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = textoOriginal;
        }
    });
});

/* ==========================================================================
   6. TERMINAL INTERATIVO (SEM SALTO DE ECRÃ)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const terminalBody = document.getElementById("terminalBody");
  if (!terminalBody) return;

  const commands = {
    help: "Comandos disponíveis: <span class='hl'>sobre</span>, <span class='hl'>skills</span>, <span class='hl'>status</span>, <span class='hl'>contacto</span>, <span class='hl'>clear</span>",
    sobre: "Transição para Tech | +10 anos em análise de dados, liderança e gestão de processos. Atual estudante de Engenharia de Software / TPSI. Foco em lógica, automação e desenvolvimento de software.",
    skills: "Linguagens & Web: Python, Java, C/C++, JavaScript, HTML5, CSS3<br>Bases de Dados: SQL<br>Infraestrutura: Linux (Ubuntu), Git, GitHub, Proxmox",
    status: "Atualmente a cursar TPSI (Nível 5) no IEFP Porto.<br>Disponível para oportunidades de Estágio Curricular e Projetos de Desenvolvimento.",
    contacto: "Para mensagens rápidas, utilize o formulário ao final da página. Links do LinkedIn e GitHub estão disponíveis no topo.",
  };

  const initialLines = [
    { text: "carreira.status --init", isCommand: true },
    { text: "[OK] Sistema carregado com sucesso.", isCommand: false },
    { text: "[INFO] Candidato: Maurício Souza Pates", isCommand: false },
    { text: "[INFO] Curso: Técnico Esp. em TPSI (IEFP Porto)", isCommand: false },
    { text: "Escreva <span class='hl'>help</span> para ver os comandos disponíveis.", isCommand: false }
  ];

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  async function typeLine(text, isCommand = false) {
    const line = document.createElement("div");
    line.className = "terminal-line";
    
    if (isCommand) {
      line.innerHTML = `<span class="prompt">guest@portfolio:~$</span> <span class="cmd-text"></span>`;
      terminalBody.appendChild(line);
      const cmdSpan = line.querySelector(".cmd-text");
      
      for (let i = 0; i < text.length; i++) {
        cmdSpan.textContent += text[i];
        scrollToBottom();
        await new Promise((res) => setTimeout(res, 40));
      }
    } else {
      line.innerHTML = text;
      terminalBody.appendChild(line);
      scrollToBottom();
    }
  }

  function createInputLine() {
    const inputLine = document.createElement("div");
    inputLine.className = "terminal-line input-line";
    
    inputLine.innerHTML = `
      <span class="prompt">guest@portfolio:~$</span>
      <span class="fake-cursor" id="fakeCursor"></span>
      <input type="text" id="terminalInput" spellcheck="false" autocomplete="off" />
    `;
    terminalBody.appendChild(inputLine);

    const input = document.getElementById("terminalInput");
    const fakeCursor = document.getElementById("fakeCursor");
    
    if (input) {
      input.focus({ preventScroll: true });

      // Esconde o cursor falso quando o campo real está focado (evita dois cursores em simultâneo)
      // e volta a mostrá-lo quando perde o foco, para continuar a indicar "escreve aqui".
      input.addEventListener("focus", () => {
        if (fakeCursor) fakeCursor.style.visibility = "hidden";
      });
      input.addEventListener("blur", () => {
        if (fakeCursor) fakeCursor.style.visibility = "visible";
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const value = input.value.trim().toLowerCase();
          
          inputLine.remove();
          
          const userCmdLine = document.createElement("div");
          userCmdLine.className = "terminal-line";
          userCmdLine.innerHTML = `<span class="prompt">guest@portfolio:~$</span> ${value}`;
          terminalBody.appendChild(userCmdLine);

          if (value === "clear") {
            terminalBody.innerHTML = "";
          } else if (value !== "") {
            const response = document.createElement("div");
            response.className = "terminal-response";
            response.innerHTML = commands[value] || `Comando não reconhecido: "${value}". Digite <span class='hl'>help</span>.`;
            terminalBody.appendChild(response);
          }

          createInputLine();
          scrollToBottom();
        }
      });
    }
  }

  terminalBody.addEventListener("click", () => {
    const input = document.getElementById("terminalInput");
    if (input) {
      input.focus({ preventScroll: true });
    }
  });

  async function startTerminal() {
    terminalBody.innerHTML = "";
    for (const item of initialLines) {
      await typeLine(item.text, item.isCommand);
      await new Promise((res) => setTimeout(res, 200));
    }
    createInputLine();
  }

  startTerminal();
});