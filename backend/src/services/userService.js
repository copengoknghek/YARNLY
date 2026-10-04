const User = require('../models/User');
const { AppError } = require('../utils/helpers');
const { toPublicUser } = require('../utils/user');

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'Không tìm thấy người dùng');
  }
  return toPublicUser(user);
};

const updateProfile = async (userId, { name }) => {
  const user = await User.update(userId, { name: name?.trim() });
  if (!user) {
    throw new AppError(404, 'Không tìm thấy người dùng');
  }
  return toPublicUser(user);
};

module.exports = { getProfile, updateProfile };
