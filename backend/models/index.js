const mongoose = require("mongoose");
const URL = process.env.URL;
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = URL;
db.users = require("./user.models")(mongoose);

module.exports = db;
