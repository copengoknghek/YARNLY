const User = require('../models/User');
const { AppError } = require('../utils/helpers');
const { signToken } = require('../utils/jwt');
const { comparePassword, hashPassword } = require('../utils/password');
const { toPublicUser } = require('../utils/user');

const buildAuthResponse = (user) => ({
  user: toPublicUser(user),
  token: signToken({ sub: user.id }),
});

const register = async ({ name, phone, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findByEmail(normalizedEmail)) {
    throw new AppError(409, 'Email đã được sử dụng');
  }

  const user = await User.create({
    name: name.trim(),
    phone,
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: 'user',
    userType: 'buyer',
  });

  return buildAuthResponse(user);
};

const registerSeller = async ({ name, phone, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findByEmail(normalizedEmail)) {
    throw new AppError(409, 'Email đã được sử dụng cho tài khoản người bán');
  }

  const user = await User.create({
    name: name.trim(),
    phone,
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: 'user',
    userType: 'seller',
  });

  return buildAuthResponse(user);
};

const login = async ({ email, password }) => {
  const user = await User.findByEmail(email.trim().toLowerCase());
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new AppError(401, 'Email hoặc mật khẩu không đúng');
  }
  return buildAuthResponse(user);
};

module.exports = { register, registerSeller, login };
