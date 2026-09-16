const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, EXPIRES_IN } = require("../config/jwt");

// تشفير الباسورد
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// مقارنة الباسورد
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// توليد التوكن
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role }, 
    SECRET_KEY, 
    { expiresIn: EXPIRES_IN }
  );
};

module.exports = { hashPassword, comparePassword, generateToken };