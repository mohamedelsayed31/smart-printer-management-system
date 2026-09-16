const Joi = require("joi");

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is Require",
      "string.email": "Invalid Email"
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is Require"
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // لو فيه خطأ، بنرجع مسج بدل ما السيرفر يضرب
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next(); // لو سليم، عدي للـ Controller
};

module.exports = { validateLogin };