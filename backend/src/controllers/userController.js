const userService = require('../services/userService');

const getProfile = async (req, res) => {
  res.json({ data: await userService.getProfile(req.token) });
};

const updateProfile = async (req, res) => {
  const { name } = req.body;
  res.json({ data: await userService.updateProfile(req.token, { name }) });
};

module.exports = { getProfile, updateProfile };
