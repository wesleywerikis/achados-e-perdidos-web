document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-anuncios");
  const nav = document.getElementById("menuNavegacao");
  const usuarioLogado = obterUsuarioLogado();

  inicializarSiteHeader({ prefixo: "" });
  renderizarNav(nav, usuarioLogado, { prefixo: "" });
  configurarLogout("index.html");

  if (!lista) return;

  lista.innerHTML = `<p class="loading">Carregando anúncios...</p>`;

  try {
    const resp = await fetch("/api/anuncios");
    const dados = await resp.json();

    if (!resp.ok) {
      lista.innerHTML = `<p class="estado-vazio">Erro ao carregar anúncios.</p>`;
      mostrarToast(dados.erro || "Erro ao carregar anúncios.", "erro");
      console.error(dados);
      return;
    }

    const anuncios = dados.anuncios || [];

    if (anuncios.length === 0) {
      lista.innerHTML = `<p class="estado-vazio">Nenhum anúncio cadastrado ainda.</p>`;
      return;
    }

    lista.innerHTML = "";

    anuncios.forEach((anuncio) => {
      const div = document.createElement("article");
      div.className = "anuncio";

      const ehDono = usuarioEhDono(usuarioLogado, anuncio);
      const dataFormatada = formatarData(anuncio.criado_em);

      let acoes = "";
      if (ehDono) {
        acoes = `
          <div class="anuncio-acoes">
            <button type="button" class="btn-acao" onclick="editarAnuncio(${anuncio.id})">Editar</button>
            <button type="button" class="btn-acao btn-perigo" onclick="excluirAnuncio(${anuncio.id})">Excluir</button>
          </div>
        `;
      }

      div.innerHTML = `
        <span class="anuncio-categoria">${escaparHtml(anuncio.categoria)}</span>
        <h3>${escaparHtml(anuncio.titulo)}</h3>
        ${dataFormatada ? `<p class="anuncio-data">Publicado em ${dataFormatada}</p>` : ""}
        <p class="anuncio-descricao">${escaparHtml(anuncio.descricao)}</p>
        <p class="anuncio-local"><strong>Local:</strong> ${escaparHtml(anuncio.local)}</p>
        ${acoes}
      `;

      lista.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    lista.innerHTML = `<p class="estado-vazio">Erro de conexão com o servidor.</p>`;
    mostrarToast("Erro de conexão com o servidor.", "erro");
  }

  window.editarAnuncio = function (id) {
    window.location.href = `pages/editar-anuncio.html?id=${id}`;
  };

  window.excluirAnuncio = async function (id) {
    const confirmado = await mostrarConfirmacao(
      "Tem certeza que deseja excluir este anúncio?"
    );
    if (!confirmado) return;

    try {
      const resp = await fetch(`/api/anuncio?id=${id}`, { method: "DELETE" });
      const dados = await resp.json();

      if (!resp.ok) {
        mostrarToast(dados.erro || "Erro ao excluir anúncio.", "erro");
        return;
      }

      mostrarToast("Anúncio excluído com sucesso!", "sucesso");
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      console.error(err);
      mostrarToast("Erro de conexão com o servidor.", "erro");
    }
  };
});
