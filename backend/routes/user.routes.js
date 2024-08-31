const { auth } = require("../middleware/auth");

module.exports = (app) => {
  const users = require("../controllers/user.controller");
  var router = require("express").Router();

  router.post("/register", users.register);
  router.post("/login", users.login);
  router.get("/", auth, users.getusers);

  app.use("/api/user", router);
};
