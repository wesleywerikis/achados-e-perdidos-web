document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const nav = document.getElementById("menuNavegacao");
  const form = document.getElementById("formEditar");
  const loading = document.getElementById("loadingEditar");
  const msgEl = document.getElementById("mensagemEditar");
  const usuarioLogado = obterUsuarioLogado();

  inicializarSiteHeader({ prefixo: "../" });
  renderizarNav(nav, usuarioLogado, { prefixo: "../", paginaAtual: "editar" });
  configurarLogout("../index.html");

  if (!usuarioLogado) {
    if (loading) loading.hidden = true;
    mostrarToast("Você precisa estar logado para editar anúncios.", "erro");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    return;
  }

  if (!id) {
    if (loading) loading.hidden = true;
    mostrarToast("ID do anúncio não informado.", "erro");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
    return;
  }

  try {
    const resp = await fetch(`/api/anuncio?id=${id}`);
    const dados = await resp.json();

    if (!resp.ok) {
      if (loading) loading.hidden = true;
      mostrarToast(dados.erro || "Erro ao carregar anúncio.", "erro");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
      return;
    }

    const anuncio = dados.anuncio;

    if (!usuarioEhDono(usuarioLogado, anuncio)) {
      if (loading) loading.hidden = true;
      if (form) form.hidden = true;
      if (msgEl) {
        msgEl.hidden = false;
        msgEl.className = "mensagem-feedback erro";
        msgEl.textContent =
          "Você não tem permissão para editar este anúncio.";
      }
      mostrarToast("Você não tem permissão para editar este anúncio.", "erro");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2500);
      return;
    }

    document.getElementById("anuncioId").value = anuncio.id;
    document.getElementById("titulo").value = anuncio.titulo;
    document.getElementById("descricao").value = anuncio.descricao;
    document.getElementById("categoria").value = anuncio.categoria;
    document.getElementById("local").value = anuncio.local;

    if (loading) loading.hidden = true;
    if (form) form.hidden = false;
  } catch (err) {
    console.error(err);
    if (loading) loading.hidden = true;
    mostrarToast("Erro de conexão com o servidor.", "erro");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const categoria = document.getElementById("categoria").value;
    const local = document.getElementById("local").value.trim();
    const btnSubmit = form.querySelector('button[type="submit"]');
    setBotaoCarregando(btnSubmit, true, "Salvando...");

    try {
      const resp = await fetch(`/api/anuncio?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, categoria, local }),
      });

      const dados = await resp.json();

      if (!resp.ok) {
        mostrarToast(dados.erro || "Erro ao salvar alterações.", "erro");
        setBotaoCarregando(btnSubmit, false, "Salvar Alterações");
        return;
      }

      mostrarToast("Anúncio atualizado com sucesso!", "sucesso");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 800);
    } catch (err) {
      console.error(err);
      mostrarToast("Erro de conexão com o servidor.", "erro");
      setBotaoCarregando(btnSubmit, false, "Salvar Alterações");
    }
  });
});
