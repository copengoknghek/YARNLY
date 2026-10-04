const toPublicUser = ({ passwordHash: _passwordHash, ...user }) => user;

module.exports = { toPublicUser };
