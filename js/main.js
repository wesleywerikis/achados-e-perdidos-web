// Simulação de dados (vai virar LocalStorage depois)
const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const lista = document.getElementById("lista-anuncios");

if (lista) {
  anuncios.forEach(anuncio => {
    const div = document.createElement("div");
    div.className = "anuncio";

    let botoes = "";
    if (usuarioLogado && usuarioLogado.email === anuncio.dono) {
      botoes = `
        <button onclick="editarAnuncio(${anuncio.id})">Editar</button>
        <button onclick="excluirAnuncio(${anuncio.id})">Excluir</button>
      `;
    }

    div.innerHTML = `
      <h3>${anuncio.titulo}</h3>
      <p>${anuncio.descricao}</p>
      <p><strong>Categoria:</strong> ${anuncio.categoria}</p>
      <p><strong>Local:</strong> ${anuncio.local}</p>
      ${botoes}
    `;

    lista.appendChild(div);
  });

  const nav = document.getElementById("menuNavegacao");


  if (usuarioLogado) {
    nav.innerHTML = `
          <img src="https://www.gravatar.com/avatar?d=mp" width="30" style="border-radius: 50%; vertical-align: middle; margin-right: 8px;">
          <span style="color: white; margin-right: 1rem;">${usuarioLogado.email}</span>
          <a href="pages/novo-anuncio.html" style="color: white; margin-right: 1rem;">Novo Anúncio</a>
          <button onclick="logout()" style="padding: 5px 10px;">Sair</button>
        `;
  }
  else {
    // Mostra links padrão
    nav.innerHTML = `
    <a href="pages/login.html">Login</a>
    <a href="pages/cadastro.html">Cadastrar-se</a>
    <a href="pages/novo-anuncio.html">Novo Anúncio</a>
  `;
  }
}

function excluirAnuncio(id) {
  const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
  const novos = anuncios.filter(a => a.id !== id);
  localStorage.setItem("anuncios", JSON.stringify(novos));
  location.reload();
}

// Função de logout
function logout() {
  localStorage.removeItem("usuarioLogado");
  location.reload(); // recarrega a página
}

function editarAnuncio(id) {
  window.location.href = `pages/editar-anuncio.html?id=${id}`;
}

