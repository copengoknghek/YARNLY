const authService = require('../services/authService');

const register = async (req, res) => {
  const { name, phone, email, password } = req.body;
  res.status(201).json({ data: await authService.register({ name, phone, email, password }) });
};

const registerSeller = async (req, res) => {
  const { name, phone, email, password } = req.body;
  res.status(201).json({ data: await authService.registerSeller({ name, phone, email, password }) });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  res.json({ data: await authService.login({ email, password }) });
};

const logout = (req, res) => {
  res.status(204).end();
};

module.exports = { register, registerSeller, login, logout };
