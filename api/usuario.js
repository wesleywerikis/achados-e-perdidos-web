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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ erro: "Método não permitido" }));
  }

  try {
    let body = "";
    await new Promise((resolve, reject) => {
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", resolve);
      req.on("error", reject);
    });

    let parsed = {};
    try {
      parsed = JSON.parse(body || "{}");
    } catch (e) {
      console.error("Erro ao fazer parse do JSON:", e);
    }

    const { nome, email, senha } = parsed;

    if (!nome || !email || !senha) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ erro: "Nome, e-mail e senha são obrigatórios." })
      );
    }

    const client = new Client({
      connectionString: getConnectionString(),
    });

    await client.connect();

    const jaExiste = await client.query(
      "SELECT 1 FROM usuarios WHERE email = $1",
      [email]
    );

    if (jaExiste.rowCount > 0) {
      await client.end();
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ erro: "Este e-mail já está cadastrado." })
      );
    }

    const resultado = await client.query(
      `INSERT INTO usuarios (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [nome, email, senha]
    );

    await client.end();

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        mensagem: "Cadastro realizado com sucesso!",
        usuario: resultado.rows[0],
      })
    );
  } catch (err) {
    console.error("ERRO AO CADASTRAR USUÁRIO:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        erro: "Erro interno ao cadastrar usuário.",
        detalhe: err.message,
      })
    );
  }
};