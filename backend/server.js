const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/config.env") });
const express = require("express");
const cors = require("cors");

var bodyParser = require("body-parser");
const app = express();
var corOptions = {
  origin: "*",
};

app.use(cors(corOptions));
app.use(express.json());

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = process.env.PORT || 5000;

const db = require("./models");
// establish connection to Mongo Atlas
db.mongoose.set("strictQuery", false);
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db ");
  })
  .catch((err) => {
    console.log("cannot connect to db ", err);
    process.exit();
  });

// register all the routes of app
require("./routes/user.routes.js")(app);

// start the server
app.listen(PORT, () => {
  console.log(`server running on PORT:${PORT}`);
});
