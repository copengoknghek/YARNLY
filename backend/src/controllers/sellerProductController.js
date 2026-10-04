const sellerProductService = require('../services/sellerProductService');

const listProducts = async (req, res) => {
  res.json({ data: await sellerProductService.listProducts(req.user.id) });
};

const createProduct = async (req, res) => {
  res.status(201).json({ data: await sellerProductService.createProduct(req.user, req.body) });
};

const updateProduct = async (req, res) => {
  res.json({ data: await sellerProductService.updateProduct(req.user.id, req.params.id, req.body) });
};

const updateStock = async (req, res) => {
  res.json({
    data: await sellerProductService.updateStock(req.user.id, req.params.id, req.body.stock),
  });
};

const getStats = async (req, res) => {
  res.json({ data: await sellerProductService.getStats(req.user.id) });
};

module.exports = { listProducts, createProduct, updateProduct, updateStock, getStats };
