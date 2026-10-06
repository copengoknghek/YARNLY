const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  const { items, shipping, note, paymentMethod, carrierId } = req.body;
  res.status(201).json({
    data: await orderService.createOrder({
      items,
      shipping,
      note,
      paymentMethod,
      carrierId,
      buyerId: req.user?.id,
    }),
  });
};

const getOrder = async (req, res) => {
  res.json({ data: await orderService.getOrderById(req.params.id) });
};

const lookupOrders = async (req, res) => {
  const { phone, email } = req.query;
  res.json({ data: await orderService.lookupOrders({ phone, email }) });
};

const listMyOrders = async (req, res) => {
  res.json({ data: await orderService.listUserOrders(req.user.id) });
};

module.exports = { createOrder, getOrder, lookupOrders, listMyOrders };
