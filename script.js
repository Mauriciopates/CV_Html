document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       1. BASE DE DADOS DINÂMICA COM CAMINHOS LOCAIS (Relative Paths)
       ========================================================================== */
    const meusProjetos = [
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
            titulo: "Script de Automação de Backups",
            categoria: "Python",
            descricao: "Script utilitário em Python para duplicação e gestão de ficheiros.",
            tecnologias: ["Python", "OS Module"],
            link: "#"
        },
        {
            titulo: "Simulador de Circuitos Arduino",
            categoria: "Java",
            descricao: "Aplicação desktop focada em mapear os pinos lógicos de uma placa Arduino.",
            tecnologias: ["Java", "Swing"],
            link: "#"
        }
    ];

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
                col.classList.add("col-md-6", "col-lg-4");

                let tagsHTML = "";
                projeto.tecnologias.forEach(tech => {
                    tagsHTML += `<span class="badge bg-info text-dark me-1">${tech}</span>`;
                });

                col.innerHTML = `
                    <div class="card h-100 border shadow-sm">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title text-primary fw-bold mb-2">${projeto.titulo}</h5>
                                <p class="card-text text-secondary small mb-3">${projeto.descricao}</p>
                                <div class="mb-3">
                                    ${tagsHTML}
                                </div>
                            </div>
                            <div>
                                <a href="${projeto.link}" target="_blank" class="btn btn-sm btn-outline-primary w-100 fw-bold">
                                    Ver Projeto &rarr;
                                </a>
                            </div>
                        </div>
                    </div>
                `;

                container.appendChild(col);
            });
        }

        // Renderiza tudo ao carregar
        renderizarProjetos(meusProjetos);

        /* ==========================================================================
           3. FILTROS DE CATEGORIA E FEEDBACK (TOAST)
           ========================================================================== */
        const botoesFiltro = document.querySelectorAll(".btn-filter");

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
    const themeToggleBtn = document.getElementById("themeToggle") || document.getElementById("theme-toggle");
    
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
   5. TERMINAL INTERATIVO (SEM SALTO DE ECRÃ)
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
    
    // Removido o atributo autofocus no HTML string
    inputLine.innerHTML = `
      <span class="prompt">guest@portfolio:~$</span>
      <input type="text" id="terminalInput" spellcheck="false" autocomplete="off" />
    `;
    terminalBody.appendChild(inputLine);

    const input = document.getElementById("terminalInput");
    
    // Aplica o foco impedindo o scroll da página principal
    if (input) {
      input.focus({ preventScroll: true });

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

  // Foca no input apenas quando o utilizador clica na área do terminal
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