const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Schema (the structure of the article)
const movieSchema = new Schema({
    title: String,
    description: String,
    genre: String,
    rating: Number,
    year: String
});

// Create a model based on that schema
const Moviedata = mongoose.model("movie", movieSchema)

// export the model
module.exports = Moviedata