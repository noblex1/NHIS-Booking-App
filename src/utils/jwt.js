const jwt = require("jsonwebtoken");

function signAuthToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  return jwt.sign(
    {
      sub: user._id.toString(),
      nhisNumber: user.nhisNumber,
      email: user.email,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

module.exports = {
  signAuthToken,
};
