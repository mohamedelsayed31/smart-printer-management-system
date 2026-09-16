const Material = require("../models/Material");

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.render("admin/materials", {
      materials,
      currentPage: "materials",
      username: req.user.username
    });
  } catch (err) {
    res.status(500).send("Error fetching materials");
  }
};

exports.addMaterial = async (req, res) => {
  try {
    await Material.create(req.body);
    res.redirect("/dashboard/materials");
  } catch (err) {
    res.status(500).send("Error adding material");
  }
};