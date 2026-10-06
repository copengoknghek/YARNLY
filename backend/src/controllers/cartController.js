const cartService = require('../services/cartService');

const getCart = async (req, res) => {
  res.json({ data: await cartService.getCart(req.token) });
};

const addItem = async (req, res) => {
  const { productId, quantity } = req.body;
  res.json({ data: await cartService.addItem(req.token, productId, quantity) });
};

const updateItem = async (req, res) => {
  res.json({
    data: await cartService.updateItem(req.token, req.params.productId, req.body.quantity),
  });
};

const removeItem = async (req, res) => {
  res.json({ data: await cartService.removeItem(req.token, req.params.productId) });
};

module.exports = { getCart, addItem, updateItem, removeItem };
