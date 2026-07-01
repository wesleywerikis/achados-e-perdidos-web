document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("menuNavegacao");
  const form = document.getElementById("formCadastro");
  const usuarioLogado = obterUsuarioLogado();

  inicializarSiteHeader({ prefixo: "../" });
  renderizarNav(nav, usuarioLogado, { prefixo: "../", paginaAtual: "cadastro" });
  configurarLogout("../index.html");
  configurarToggleSenha();

  if (usuarioLogado) {
    mostrarToast("Você já está logado. Redirecionando...", "info");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const btnSubmit = form.querySelector('button[type="submit"]');

    if (!nome || !email || !senha || !confirmarSenha) {
      mostrarToast("Preencha todos os campos.", "erro");
      return;
    }

    if (senha.length < 6) {
      mostrarToast("A senha deve ter pelo menos 6 caracteres.", "erro");
      return;
    }

    if (senha !== confirmarSenha) {
      mostrarToast("As senhas não coincidem.", "erro");
      return;
    }

    setBotaoCarregando(btnSubmit, true, "Cadastrando...");

    try {
      const resp = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      let dados = {};
      try {
        dados = await resp.json();
      } catch (err) {
        console.error("Falha ao ler JSON da resposta:", err);
      }

      if (!resp.ok) {
        mostrarToast(
          dados.erro || `Erro ao cadastrar. Status: ${resp.status}`,
          "erro"
        );
        setBotaoCarregando(btnSubmit, false, "Cadastrar");
        return;
      }

      mostrarToast("Cadastro realizado! Redirecionando para o login...", "sucesso");
      form.reset();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } catch (err) {
      console.error(err);
      mostrarToast("Erro de conexão com o servidor.", "erro");
      setBotaoCarregando(btnSubmit, false, "Cadastrar");
    }
  });
});
