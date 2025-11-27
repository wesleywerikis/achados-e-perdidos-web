// api/usuarios.js
import { Client } from "pg";

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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { nome, email, senha } = req.body || {};

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ erro: "Nome, e-mail e senha são obrigatórios." });
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
      return res
        .status(400)
        .json({ erro: "Este e-mail já está cadastrado." });
    }

    const resultado = await client.query(
      `INSERT INTO usuarios (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [nome, email, senha]
    );

    await client.end();

    return res.status(201).json({
      mensagem: "Cadastro realizado com sucesso!",
      usuario: resultado.rows[0],
    });
  } catch (err) {
    console.error("ERRO AO CADASTRAR USUÁRIO:", err);
    return res.status(500).json({
      erro: "Erro interno ao cadastrar usuário.",
      detalhe: err.message,
    });
  }
}