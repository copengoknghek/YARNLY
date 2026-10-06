const jwt = require('jsonwebtoken');
const env = require('../config/env');

const getSecret = () => env.jwtSecret || 'yarnly-dev-secret-change-in-production';

const signToken = (payload) => jwt.sign(payload, getSecret(), { expiresIn: '7d' });

const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = { signToken, verifyToken };
