// Simulação de dados (vai virar LocalStorage depois)
const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

const lista = document.getElementById("lista-anuncios");

if (lista) {
    anuncios.forEach(anuncio => {
        const div = document.createElement("div");
        div.className = "anuncio";
        div.innerHTML = `
      <h3>${anuncio.titulo}</h3>
      <p>${anuncio.descricao}</p>
      <p><strong>Categoria:</strong> ${anuncio.categoria}</p>
      <p><strong>Local:</strong> ${anuncio.local}</p>
    `;
        lista.appendChild(div);
    });

    const nav = document.getElementById("menuNavegacao");
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuarioLogado) {
        nav.innerHTML = `
          <img src="https://www.gravatar.com/avatar?d=mp" width="30" style="border-radius: 50%; vertical-align: middle; margin-right: 8px;">
          <span style="color: white; margin-right: 1rem;">${usuarioLogado.email}</span>
          <a href="novo-anuncio.html" style="color: white; margin-right: 1rem;">Novo Anúncio</a>
          <button onclick="logout()" style="padding: 5px 10px;">Sair</button>
        `;
    }
    else {
        // Mostra links padrão
        nav.innerHTML = `
    <a href="login.html">Login</a>
    <a href="cadastro.html">Cadastrar-se</a>
    <a href="novo-anuncio.html">Novo Anúncio</a>
  `;
    }

    // Função de logout
    function logout() {
        localStorage.removeItem("usuarioLogado");
        location.reload(); // recarrega a página
    }

}
