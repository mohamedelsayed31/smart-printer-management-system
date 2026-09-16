const adminOnly = (req, res, next) => {
    // بيتأكد إن اليوزر اللي جاي من الـ protect المسمى الوظيفي بتاعه admin
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ success: false, message: "للمديرين فقط" });
    }
  };
  
  module.exports = { adminOnly };