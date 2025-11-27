const { Client } = require("pg");

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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  try {
    if (req.method === "GET") {
      const client = await getClient();
      const result = await client.query(
        `SELECT 
           id,
           titulo,
           descricao,
           categoria,
           local,
           dono_email AS dono,
           criado_em
         FROM anuncios
         ORDER BY criado_em DESC`
      );
      await client.end();

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ anuncios: result.rows }));
    }

    if (req.method === "POST") {
      let body = "";
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => (body += chunk));
        req.on("end", resolve);
        req.on("error", reject);
      });

      let parsed = {};
      try {
        parsed = JSON.parse(body || "{}");
      } catch (e) {
        console.error("Erro ao parsear JSON:", e);
      }

      const { titulo, descricao, categoria, local, donoEmail } = parsed;

      if (!titulo || !descricao || !categoria || !local || !donoEmail) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({ erro: "Todos os campos são obrigatórios." })
        );
      }

      const client = await getClient();

      const donoExiste = await client.query(
        "SELECT 1 FROM usuarios WHERE email = $1",
        [donoEmail]
      );

      if (donoExiste.rowCount === 0) {
        await client.end();
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({ erro: "Usuário dono do anúncio não existe." })
        );
      }

      const result = await client.query(
        `INSERT INTO anuncios (titulo, descricao, categoria, local, dono_email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, titulo, descricao, categoria, local, dono_email AS dono, criado_em`,
        [titulo, descricao, categoria, local, donoEmail]
      );

      await client.end();

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          mensagem: "Anúncio criado com sucesso!",
          anuncio: result.rows[0],
        })
      );
    }

    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ erro: "Método não permitido" }));
  } catch (err) {
    console.error("ERRO EM /api/anuncios:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        erro: "Erro interno ao processar anúncios.",
        detalhe: err.message,
      })
    );
  }
};