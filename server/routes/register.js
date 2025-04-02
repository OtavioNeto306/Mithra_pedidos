const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const router = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '5445',
  database: 'emporio'
}).promise();

router.post('/register', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    // Validações
    if (!usuario || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    if (senha.length > 20) {
      return res.status(400).json({ error: 'A senha deve ter no máximo 20 caracteres' });
    }

    // Verificar se o usuário já existe
    const [existingUser] = await pool.query('SELECT USUARIO FROM senhas WHERE USUARIO = ?', [usuario]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir novo usuário
    await pool.query(
      'INSERT INTO senhas (USUARIO, SENHA, NOME, GRAU) VALUES (?, ?, ?, ?)',
      [usuario, hashedPassword, usuario, 'U']
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    if (error.code === 'ER_DATA_TOO_LONG') {
      res.status(400).json({ error: 'Dados fornecidos excedem o tamanho máximo permitido' });
    } else {
      res.status(500).json({ error: 'Erro ao registrar usuário. Por favor, tente novamente.' });
    }
  }
});

module.exports = router;