const adminService = require('../services/adminService');

const listPendingProducts = async (req, res) => {
  res.json({ data: await adminService.listPendingProducts() });
};

const approveProduct = async (req, res) => {
  res.json({ data: await adminService.approveProduct(req.params.id) });
};

const rejectProduct = async (req, res) => {
  res.json({ data: await adminService.rejectProduct(req.params.id, req.body.note) });
};

const listOrders = async (req, res) => {
  res.json({ data: await adminService.listOrders() });
};

const getStats = async (req, res) => {
  res.json({ data: await adminService.getStats() });
};

module.exports = { listPendingProducts, approveProduct, rejectProduct, listOrders, getStats };
