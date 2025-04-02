import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
const router = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '5445',
  database: 'emporio'
}).promise();

// Rota de registro
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

    // Buscar os dados do usuário recém-criado
    const [newUser] = await pool.query('SELECT * FROM senhas WHERE USUARIO = ?', [usuario]);
    const { SENHA, ...userData } = newUser[0];

    res.status(201).json(userData);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    if (error.code === 'ER_DATA_TOO_LONG') {
      res.status(400).json({ error: 'Dados fornecidos excedem o tamanho máximo permitido' });
    } else {
      res.status(500).json({ error: 'Erro ao registrar usuário. Por favor, tente novamente.' });
    }
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    // Validações
    if (!usuario || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Buscar usuário
    const [users] = await pool.query('SELECT * FROM senhas WHERE USUARIO = ?', [usuario]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const user = users[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(senha, user.SENHA);

    if (!validPassword) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Retornar dados do usuário (exceto a senha)
    const { SENHA, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login. Por favor, tente novamente.' });
  }
});

// Rota para buscar pedidos
router.get('/pedidos', async (req, res) => {
  try {
    const [pedidos] = await pool.query(`
      SELECT 
        numero,
        cliente,
        emissao,
        status,
        valor
      FROM cabpdv
      ORDER BY emissao DESC
      LIMIT 50
    `);

    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos. Por favor, tente novamente.' });
  }
});

// Rota para buscar usuários
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        USUARIO,
        NOME,
        COMISSAO
      FROM senhas
      ORDER BY NOME
    `);
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Rota para atualizar permissões de um usuário
router.put('/users/:usuario/permissions', async (req, res) => {
  const { usuario } = req.params;
  const { permissoes } = req.body;

  try {
    // Atualiza o grau do usuário baseado na permissão de sistema completo
    const grau = permissoes.sistema_completo ? 'S' : 'V';

    // Atualiza as permissões do usuário
    await pool.query(`
      UPDATE senhas 
      SET 
        GRAU = ?,
        LOJAS = ?,
        MODULO = ?,
        BANCOS = ?,
        LIMICP = ?,
        CCUSTO = ?,
        ARMAZEN = ?
      WHERE USUARIO = ?
    `, [
      grau,
      permissoes.lojas ? 'S' : 'N',
      permissoes.modulo ? 'S' : 'N',
      permissoes.bancos ? 'S' : 'N',
      permissoes.limicp ? 'S' : 'N',
      permissoes.ccusto ? 'S' : 'N',
      permissoes.armazen ? 'S' : 'N',
      usuario
    ]);

    res.json({ message: 'Permissões atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar permissões:', error);
    res.status(500).json({ error: 'Erro ao atualizar permissões' });
  }
});

// Rota para atualizar comissão de um usuário
router.put('/users/:usuario/comissao', async (req, res) => {
  const { usuario } = req.params;
  const { comissao } = req.body;

  try {
    // Validação da comissão
    if (comissao < 0 || comissao > 100) {
      return res.status(400).json({ error: 'A comissão deve estar entre 0 e 100' });
    }

    // Atualiza a comissão do usuário
    await pool.query(`
      UPDATE senhas 
      SET COMISSAO = ?
      WHERE USUARIO = ?
    `, [comissao, usuario]);

    res.json({ message: 'Comissão atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar comissão:', error);
    res.status(500).json({ error: 'Erro ao atualizar comissão' });
  }
});

export default router;