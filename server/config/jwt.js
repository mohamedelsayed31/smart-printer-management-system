const secret = process.env.JWT_SECRET;
if (!secret) {
  console.warn("⚠️ JWT_SECRET is not configured. Authentication will fail until it is set.");
}

module.exports = {
  SECRET_KEY: secret,
  EXPIRES_IN: "8h",
  COOKIE_MAX_AGE: 8 * 60 * 60 * 1000,
};
