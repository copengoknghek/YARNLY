const YarnColor = require('../models/YarnColor');
const { AppError } = require('../utils/helpers');

const listColors = async (sellerId) => YarnColor.findBySeller(sellerId);

const createColor = async (sellerId, input) =>
  YarnColor.create(sellerId, {
    name: input.name,
    hex: input.hex,
    stock: input.stock,
  });

const updateColor = async (sellerId, colorId, input) => {
  const updated = await YarnColor.update(colorId, sellerId, input);
  if (!updated) {
    throw new AppError(404, 'Không tìm thấy màu len');
  }
  return updated;
};

const deleteColor = async (sellerId, colorId) => {
  const removed = await YarnColor.remove(colorId, sellerId);
  if (!removed) {
    throw new AppError(404, 'Không tìm thấy màu len');
  }
};

module.exports = { listColors, createColor, updateColor, deleteColor };
