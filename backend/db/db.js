const mongoose = require("mongoose");
const dotenv = require("dotenv");
const result = dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hsujc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, //adresse fournie par mongodb
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

module.exports = mongoose;
