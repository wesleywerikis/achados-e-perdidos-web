document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("menuNavegacao");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
    return;
  }

  if (nav) {
    nav.innerHTML = `
      <a href="../index.html" style="color: white; margin-right: 1rem;">Início</a>
      <img src="https://www.gravatar.com/avatar?d=mp" width="30" style="border-radius: 50%; vertical-align: middle; margin-right: 8px;">
      <span style="color: white; margin-right: 1rem;">${usuarioLogado.email}</span>
      <button onclick="logout()" style="padding: 5px 10px;">Sair</button>
    `;
  }

  window.logout = function () {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
  };

  const form = document.getElementById("form-anuncio");

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

    try {
      const resp = await fetch("/api/anuncios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(anuncio),
      });

      const dados = await resp.json();

      if (!resp.ok) {
        alert(dados.erro || "Erro ao cadastrar anúncio.");
        return;
      }

      window.location.href = "../index.html";
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  });
});