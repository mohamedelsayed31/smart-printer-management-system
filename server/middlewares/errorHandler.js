const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  let status = err.status || err.statusCode || 500;
  if (err instanceof multer.MulterError || err.message === "Only image uploads are allowed") {
    status = 400;
  }

  res.status(status).json({
    success: false,
    message: err.message || "حدث خطأ داخلي في الخادم",
  });
};

module.exports = errorHandler;
