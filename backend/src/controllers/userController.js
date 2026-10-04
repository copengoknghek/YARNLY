const userService = require('../services/userService');

const getProfile = async (req, res) => {
  res.json({ data: await userService.getProfile(req.user.id) });
};

const updateProfile = async (req, res) => {
  const { name } = req.body;
  res.json({ data: await userService.updateProfile(req.user.id, { name }) });
};

module.exports = { getProfile, updateProfile };
