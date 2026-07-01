function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function formatarData(iso) {
  if (!iso) return "";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function garantirUiContainers() {
  if (!document.getElementById("toast-container")) {
    const toast = document.createElement("div");
    toast.id = "toast-container";
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  if (!document.getElementById("modal-confirmacao")) {
    const modal = document.createElement("div");
    modal.id = "modal-confirmacao";
    modal.className = "modal-overlay";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true">
        <p id="modal-mensagem"></p>
        <div class="modal-acoes">
          <button type="button" id="modal-cancelar" class="btn-secundario">Cancelar</button>
          <button type="button" id="modal-confirmar" class="btn-perigo">Confirmar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

function mostrarToast(mensagem, tipo = "info") {
  garantirUiContainers();
  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.textContent = mensagem;
  document.getElementById("toast-container").appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast-visivel"));

  setTimeout(() => {
    toast.classList.remove("toast-visivel");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function mostrarConfirmacao(mensagem) {
  garantirUiContainers();
  const modal = document.getElementById("modal-confirmacao");
  const msgEl = document.getElementById("modal-mensagem");
  const btnConfirmar = document.getElementById("modal-confirmar");
  const btnCancelar = document.getElementById("modal-cancelar");

  msgEl.textContent = mensagem;
  modal.hidden = false;

  return new Promise((resolve) => {
    function fechar(resultado) {
      modal.hidden = true;
      btnConfirmar.removeEventListener("click", aoConfirmar);
      btnCancelar.removeEventListener("click", aoCancelar);
      modal.removeEventListener("click", aoClicarFora);
      resolve(resultado);
    }

    function aoConfirmar() {
      fechar(true);
    }

    function aoCancelar() {
      fechar(false);
    }

    function aoClicarFora(e) {
      if (e.target === modal) fechar(false);
    }

    btnConfirmar.addEventListener("click", aoConfirmar);
    btnCancelar.addEventListener("click", aoCancelar);
    modal.addEventListener("click", aoClicarFora);
  });
}

function renderizarNav(nav, usuarioLogado, opcoes = {}) {
  if (!nav) return;

  const prefixo = opcoes.prefixo || "";
  const paginaAtual = opcoes.paginaAtual || "";

  if (usuarioLogado) {
    const linkNovo =
      paginaAtual === "novo"
        ? itemNavAtivo("Novo Anúncio")
        : linkNav(`${prefixo}pages/novo-anuncio.html`, "Novo Anúncio", "nav-link--cta");

    nav.innerHTML = `
      ${linkNav(`${prefixo}index.html`, "Início")}
      ${linkNovo}
      <div class="nav-usuario-chip">
        <span class="nav-usuario-avatar">${inicialDoUsuario(usuarioLogado)}</span>
        <span class="nav-usuario-email">${escaparHtml(usuarioLogado.email)}</span>
      </div>
      <button type="button" class="btn-nav btn-nav--sair" onclick="logout()">Sair</button>
    `;
  } else {
    const linkLogin =
      paginaAtual === "login"
        ? itemNavAtivo("Login")
        : linkNav(`${prefixo}pages/login.html`, "Login");

    const linkCadastro =
      paginaAtual === "cadastro"
        ? itemNavAtivo("Cadastrar-se")
        : linkNav(`${prefixo}pages/cadastro.html`, "Cadastrar-se");

    nav.innerHTML = `
      ${linkLogin}
      ${linkCadastro}
      ${linkNav(`${prefixo}pages/novo-anuncio.html`, "Novo Anúncio", "nav-link--cta")}
    `;
  }
}

function configurarToggleSenha() {
  document.querySelectorAll("[data-toggle-senha]").forEach((btn) => {
    const inputId = btn.dataset.toggleSenha;
    const input = document.getElementById(inputId);
    if (!input) return;

    btn.innerHTML = iconeOlho(false);
    btn.setAttribute("aria-label", "Mostrar senha");

    btn.addEventListener("click", () => {
      const revelar = input.type === "password";
      input.type = revelar ? "text" : "password";
      btn.innerHTML = iconeOlho(input.type === "text");
      btn.setAttribute("aria-label", input.type === "text" ? "Ocultar senha" : "Mostrar senha");
    });
  });
}

function setBotaoCarregando(botao, carregando, textoPadrao) {
  if (!botao) return;
  if (carregando) {
    botao.dataset.textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = textoPadrao || "Aguarde...";
  } else {
    botao.disabled = false;
    botao.textContent = botao.dataset.textoOriginal || textoPadrao || "Enviar";
  }
}

function configurarLogout(urlRedirect) {
  window.logout = function () {
    localStorage.removeItem("usuarioLogado");
    window.location.href = urlRedirect;
  };
}

function obterUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    return null;
  }
}

function usuarioEhDono(usuario, anuncio) {
  if (!usuario || !anuncio) return false;
  const dono = anuncio.donoEmail || anuncio.dono;
  return usuario.email === dono;
}

function iconeOlho(senhaVisivel) {
  if (senhaVisivel) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function inicialDoUsuario(usuario) {
  const base = usuario?.nome || usuario?.email || "?";
  return escaparHtml(base.charAt(0).toUpperCase());
}

function inicializarSiteHeader(opcoes = {}) {
  const prefixo = opcoes.prefixo || "";
  const logo = document.getElementById("linkLogo");
  if (logo) logo.href = `${prefixo}index.html`;
  configurarMenuMobile();
}

function configurarMenuMobile() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("menuNavegacao");
  if (!toggle || !nav || toggle.dataset.bound) return;

  toggle.dataset.bound = "true";

  toggle.addEventListener("click", () => {
    const aberto = nav.classList.toggle("site-nav--aberto");
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("site-nav--aberto");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    }
  });
}

function linkNav(href, texto, extraClass = "") {
  return `<a href="${href}" class="nav-link ${extraClass}">${texto}</a>`;
}

function itemNavAtivo(texto) {
  return `<span class="nav-link nav-link--ativo" aria-current="page">${texto}</span>`;
}
