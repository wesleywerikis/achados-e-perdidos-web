document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("menuNavegacao");
  const form = document.getElementById("form-anuncio");
  const usuarioLogado = obterUsuarioLogado();

  inicializarSiteHeader({ prefixo: "../" });
  renderizarNav(nav, usuarioLogado, { prefixo: "../", paginaAtual: "novo" });
  configurarLogout("login.html");

  if (!usuarioLogado) {
    mostrarToast("Você precisa estar logado para publicar anúncios.", "erro");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const anuncio = {
      titulo: formData.get("titulo"),
      descricao: formData.get("descricao"),
      categoria: formData.get("categoria"),
      local: formData.get("local"),
      donoEmail: usuarioLogado.email,
    };

    if (!anuncio.titulo?.toString().trim() || !anuncio.descricao?.toString().trim() || !anuncio.categoria || !anuncio.local?.toString().trim()) {
      mostrarToast("Preencha todos os campos do anúncio.", "erro");
      return;
    }

    const btnSubmit = form.querySelector('button[type="submit"]');
    setBotaoCarregando(btnSubmit, true, "Cadastrando...");

    try {
      const resp = await fetch("/api/anuncios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anuncio),
      });

      const dados = await resp.json();

      if (!resp.ok) {
        mostrarToast(dados.erro || "Erro ao cadastrar anúncio.", "erro");
        setBotaoCarregando(btnSubmit, false, "Cadastrar Anúncio");
        return;
      }

      mostrarToast("Anúncio cadastrado com sucesso!", "sucesso");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 800);
    } catch (err) {
      console.error(err);
      mostrarToast("Erro de conexão com o servidor.", "erro");
      setBotaoCarregando(btnSubmit, false, "Cadastrar Anúncio");
    }
  });
});
