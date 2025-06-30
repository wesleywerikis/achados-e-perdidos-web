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
}
