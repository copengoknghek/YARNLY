const Carrier = require('../models/Carrier');
const { getShippingZone } = require('../utils/shippingZones');
const { AppError } = require('../utils/helpers');

const getQuotes = async (province) => {
  if (!province?.trim()) {
    throw new AppError(400, 'Vui lòng chọn tỉnh thành');
  }
  const zone = getShippingZone(province.trim());
  const quotes = await Carrier.getQuotesByZone(zone);
  return { province: province.trim(), zone, quotes };
};

module.exports = { getQuotes };
