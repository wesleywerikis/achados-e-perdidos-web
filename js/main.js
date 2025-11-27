document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-anuncios");
  const nav = document.getElementById("menuNavegacao");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Menu
  if (nav) {
    if (usuarioLogado) {
      nav.innerHTML = `
        <img src="https://www.gravatar.com/avatar?d=mp" width="30" style="border-radius: 50%; vertical-align: middle; margin-right: 8px;">
        <span style="color: white; margin-right: 1rem;">${usuarioLogado.email}</span>
        <a href="pages/novo-anuncio.html" style="color: white; margin-right: 1rem;">Novo Anúncio</a>
        <button onclick="logout()" style="padding: 5px 10px;">Sair</button>
      `;
    } else {
      nav.innerHTML = `
        <a href="pages/login.html">Login</a>
        <a href="pages/cadastro.html">Cadastrar-se</a>
        <a href="pages/novo-anuncio.html">Novo Anúncio</a>
      `;
    }
  }

  window.logout = function () {
    localStorage.removeItem("usuarioLogado");
    location.reload();
  };

  if (!lista) return;

  try {
    const resp = await fetch("/api/anuncios");
    const dados = await resp.json();

    if (!resp.ok) {
      lista.innerHTML = `<p>Erro ao carregar anúncios.</p>`;
      console.error(dados);
      return;
    }

    const anuncios = dados.anuncios || [];

    if (anuncios.length === 0) {
      lista.innerHTML = `<p>Nenhum anúncio cadastrado ainda.</p>`;
      return;
    }

    lista.innerHTML = "";

    anuncios.forEach((anuncio) => {
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
  } catch (err) {
    console.error(err);
    lista.innerHTML = `<p>Erro de conexão com o servidor.</p>`;
  }

  window.editarAnuncio = function (id) {
    window.location.href = `pages/editar-anuncio.html?id=${id}`;
  };

  window.excluirAnuncio = async function (id) {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) {
      return;
    }

    try {
      const resp = await fetch(`/api/anuncio?id=${id}`, {
        method: "DELETE",
      });
      const dados = await resp.json();

      if (!resp.ok) {
        alert(dados.erro || "Erro ao excluir anúncio.");
        return;
      }

      location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  };
});