const authService = require('../services/authService');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({ data: await authService.register({ name, email, password }) });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  res.json({ data: await authService.login({ email, password }) });
};

// Tokens are stateless, so logging out only requires the client to discard its token.
const logout = (req, res) => {
  res.status(204).end();
};

module.exports = { register, login, logout };
