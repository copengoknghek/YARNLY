const sellerYarnColorService = require('../services/sellerYarnColorService');

const listColors = async (req, res) => {
  res.json({ data: await sellerYarnColorService.listColors(req.user.id) });
};

const createColor = async (req, res) => {
  res.status(201).json({ data: await sellerYarnColorService.createColor(req.user.id, req.body) });
};

const updateColor = async (req, res) => {
  res.json({ data: await sellerYarnColorService.updateColor(req.user.id, req.params.id, req.body) });
};

const deleteColor = async (req, res) => {
  await sellerYarnColorService.deleteColor(req.user.id, req.params.id);
  res.status(204).end();
};

module.exports = { listColors, createColor, updateColor, deleteColor };
