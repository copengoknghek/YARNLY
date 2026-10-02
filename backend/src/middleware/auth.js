const { AppError } = require('../utils/helpers');

// Only checks that a Bearer token is present; JWT signature verification comes with the auth feature.
const auth = (req, res, next) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Vui lòng đăng nhập'));
  }
  req.token = token;
  next();
};

module.exports = auth;
