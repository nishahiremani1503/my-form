var ObjectId = require("mongodb").ObjectId;

module.exports = (mongoose) => {
  var schema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    mobile: String,
    role: String,
  });

  return mongoose.model("user", schema);
};
