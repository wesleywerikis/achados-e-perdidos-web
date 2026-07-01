const { Client, types } = require("pg");

// TIMESTAMP sem fuso: o banco (Docker/Vercel) grava em UTC.
// Sem isso, o Node no Brasil interpreta como horário local (+3h na exibição).
types.setTypeParser(1114, (valor) => {
  if (!valor) return null;
  return new Date(valor.replace(" ", "T") + "Z");
});

function getConnectionString() {
  const url =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!url) {
    console.error("ERRO: Nenhuma variável POSTGRES_ encontrada.");
    throw new Error("Variável de ambiente POSTGRES_URL não configurada.");
  }

  return url;
}

async function getClient() {
  const client = new Client({
    connectionString: getConnectionString(),
  });
  await client.connect();
  return client;
}

module.exports = { Client, getConnectionString, getClient };
