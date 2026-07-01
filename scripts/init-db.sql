CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS anuncios (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  local VARCHAR(255) NOT NULL,
  dono_email VARCHAR(255) NOT NULL REFERENCES usuarios(email),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Dados de exemplo para testes locais (opcional)
INSERT INTO usuarios (nome, email, senha)
VALUES ('Usuario Teste', 'teste@email.com', '123456')
ON CONFLICT (email) DO NOTHING;

INSERT INTO anuncios (titulo, descricao, categoria, local, dono_email)
SELECT
  'Carteira encontrada',
  'Carteira marrom com documentos, encontrada no corredor principal.',
  'Documento',
  'Campus central',
  'teste@email.com'
WHERE NOT EXISTS (
  SELECT 1 FROM anuncios WHERE titulo = 'Carteira encontrada'
);
