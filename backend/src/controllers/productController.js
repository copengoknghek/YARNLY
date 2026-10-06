const { matchedData } = require('express-validator');
const productService = require('../services/productService');

const listProducts = async (req, res) => {
  // matchedData returns the sanitized values (Express 5 re-parses req.query on every access).
  const filters = matchedData(req, { locations: ['query'] });
  res.json({ data: await productService.listProducts(filters) });
};

const getProduct = async (req, res) => {
  res.json({ data: await productService.getProductById(req.params.id) });
};

module.exports = { listProducts, getProduct };
