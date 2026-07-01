document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("menuNavegacao");
  const formLogin = document.getElementById("formLogin");
  const usuarioLogado = obterUsuarioLogado();

  inicializarSiteHeader({ prefixo: "../" });
  renderizarNav(nav, usuarioLogado, { prefixo: "../", paginaAtual: "login" });
  configurarLogout("../index.html");
  configurarToggleSenha();

  if (usuarioLogado) {
    mostrarToast("Você já está logado. Redirecionando...", "info");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
    return;
  }

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const btnSubmit = formLogin.querySelector('button[type="submit"]');

    if (!email || !senha) {
      mostrarToast("Preencha e-mail e senha.", "erro");
      return;
    }

    setBotaoCarregando(btnSubmit, true, "Entrando...");

    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      let dados = {};
      try {
        dados = await resp.json();
      } catch (err) {
        console.error("Falha ao ler JSON da resposta:", err);
      }

      if (!resp.ok) {
        mostrarToast(
          dados.erro || `Falha no login. Status: ${resp.status}`,
          "erro"
        );
        setBotaoCarregando(btnSubmit, false, "Entrar");
        return;
      }

      if (dados.usuario) {
        localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));
      }

      mostrarToast("Login realizado com sucesso!", "sucesso");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 800);
    } catch (err) {
      console.error(err);
      mostrarToast("Erro de conexão com o servidor.", "erro");
      setBotaoCarregando(btnSubmit, false, "Entrar");
    }
  });
});
