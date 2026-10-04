const { AppError } = require('../utils/helpers');

const getAccessRole = (user) => {
  if (user.role === 'admin') return 'admin';
  return user.userType ?? 'buyer';
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, 'Vui lòng đăng nhập'));
  }
  const accessRole = getAccessRole(req.user);
  if (!roles.includes(accessRole)) {
    return next(new AppError(403, 'Bạn không có quyền truy cập'));
  }
  return next();
};

const requireSeller = requireRole('seller');
const requireAdmin = requireRole('admin');
const requireBuyer = requireRole('buyer');

module.exports = { requireRole, requireSeller, requireAdmin, requireBuyer, getAccessRole };
