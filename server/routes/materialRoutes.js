const express = require("express");
const router = express.Router();
const Material = require("../models/Material");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.use(protect, adminOnly);

router.get("/", async (req, res) => {
  try {
    const materials = await Material.find();
    res.render("material/materials", {
      materials,
      currentPage: "materials",
      username: req.user.username,
    });
  } catch (err) {
    res.status(500).send("Error fetching materials");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { name, paperSize, costPrice, sellingPrice } = req.body;
    await Material.create({ name, paperSize, costPrice, sellingPrice });
    res.redirect("/dashboard/materials");
  } catch (err) {
    res.status(500).send("Error adding material");
  }
});

module.exports = router;
