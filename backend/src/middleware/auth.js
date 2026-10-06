const User = require('../models/User');
const { AppError } = require('../utils/helpers');
const { verifyToken } = require('../utils/jwt');
const { toPublicUser } = require('../utils/user');

const auth = async (req, res, next) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Vui lòng đăng nhập'));
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return next(new AppError(401, 'Phiên đăng nhập không hợp lệ'));
    }
    req.user = toPublicUser(user);
    req.token = token;
    return next();
  } catch {
    return next(new AppError(401, 'Phiên đăng nhập không hợp lệ'));
  }
};

module.exports = auth;
