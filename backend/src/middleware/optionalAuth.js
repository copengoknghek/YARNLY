const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const { toPublicUser } = require('../utils/user');

const optionalAuth = async (req, res, next) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    return next();
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (user) {
      req.user = toPublicUser(user);
      req.token = token;
    }
  } catch {
    // Ignore invalid token for optional auth
  }
  return next();
};

module.exports = optionalAuth;
