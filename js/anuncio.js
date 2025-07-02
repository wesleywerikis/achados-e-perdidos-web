document.addEventListener("DOMContentLoaded", () => {
  // ⚠️ Renderizar o menu
  const nav = document.getElementById("menuNavegacao");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (usuarioLogado && nav) {
    nav.innerHTML = `
      <a href="index.html" style="color: white; margin-right: 1rem;">Início</a>
      <img src="https://www.gravatar.com/avatar?d=mp" width="30" style="border-radius: 50%; vertical-align: middle; margin-right: 8px;">
      <span style="color: white; margin-right: 1rem;">${usuarioLogado.email}</span>
      <button onclick="logout()" style="padding: 5px 10px;">Sair</button>
    `;
  }

  function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
  }

  // 🎯 Formulário de cadastro de anúncio
  const form = document.getElementById("form-anuncio");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const anuncio = {
      titulo: formData.get("titulo"),
      descricao: formData.get("descricao"),
      categoria: formData.get("categoria"),
      local: formData.get("local"),
      dono: usuarioLogado.email, 
      id: Date.now(), 
    };
    

    const anunciosStr = localStorage.getItem("anuncios");
    const anuncios = anunciosStr ? JSON.parse(anunciosStr) : [];

    anuncios.push(anuncio);
    localStorage.setItem("anuncios", JSON.stringify(anuncios));

    window.location.href = "index.html";
  });
});
