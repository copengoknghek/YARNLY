const shippingService = require('../services/shippingService');

const getQuotes = async (req, res) => {
  const { province } = req.query;
  res.json({ data: await shippingService.getQuotes(province) });
};

module.exports = { getQuotes };
