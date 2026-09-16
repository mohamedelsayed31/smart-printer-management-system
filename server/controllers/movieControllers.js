// const Moviedata = require("../models/Movie");
// const moment = require("moment");

// // ReadAllMovie
// const movie_dashboard_get = async (req, res) => {
//   try {
//     const movies = await Moviedata.find();

//     res.render("index", {
//       arr: movies,
//       username: "User",
//       token: "",
//       moment,
//     });
//   } catch (err) {
//     console.log(err);
//     res.send("Error loading dashboard");
//   }
// };

// // add page
// const movie_add_get = (req, res) => {
//   res.render("movie/add", {
//     username: "User",
//   });
// };

// // create movie
// const movie_create_post = async (req, res) => {
//   try {
//     const { title, description, genre, year, rating } = req.body;

//     await Moviedata.create({
//       title,
//       description,
//       genre,
//       year,
//       rating,
//     });

//     res.redirect("/dashboard");
//   } catch (err) {
//     console.log(err);
//     res.send("Error creating movie");
//   }
// };

// // view movie
// const movie_view_get = async (req, res) => {
//   try {
//     const movie = await Moviedata.findById(req.params.id);

//     res.render("movie/view", {
//       obj: movie,
//       username: "User",
//       moment,
//     });
//   } catch (err) {
//     console.log(err);
//     res.send("Movie not found");
//   }
// };

// // edit page
// const movie_edit_get = async (req, res) => {
//   try {
//     const movie = await Moviedata.findById(req.params.id);

//     res.render("movie/edit", {
//       obj: movie,
//       username: "User",
//     });
//   } catch (err) {
//     console.log(err);
//     res.send("Movie not found");
//   }
// };

// // update movie
// const movie_update_post = async (req, res) => {
//   try {
//     await Moviedata.findByIdAndUpdate(req.params.id, req.body);
//     res.redirect("/dashboard");
//   } catch (err) {
//     console.log(err);
//     res.send("Error updating movie");
//   }
// };

// // delete movie
// const movie_delete_post = async (req, res) => {
//   try {
//     await Moviedata.findByIdAndDelete(req.params.id);
//     res.redirect("/dashboard");
//   } catch (err) {
//     console.log(err);
//     res.send("Error deleting movie");
//   }
// };

// // Read All Movies (API)
// const movie_readallapi_get = async (req, res) => {
//   try {
//     const movies = await Moviedata.find();

//     res.status(200).json({
//       message: "All movies fetched successfully",
//       data: movies,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Read Movie By ID (API)
// const movie_readidapi_get = async (req, res) => {
//   try {
//     const movie = await Moviedata.findById(req.params.id);

//     if (!movie) {
//       return res.status(404).json({
//         message: "Movie not found",
//       });
//     }

//     res.status(200).json({
//       message: "Movie fetched successfully",
//       data: movie,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Invalid ID or server error",
//     });
//   }
// };

// module.exports = {
//   movie_dashboard_get,
//   movie_add_get,
//   movie_create_post,
//   movie_view_get,
//   movie_edit_get,
//   movie_update_post,
//   movie_delete_post,
//   movie_readallapi_get,
//   movie_readidapi_get,
// };
