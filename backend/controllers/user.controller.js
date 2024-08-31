const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = db.users;
const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const SALT_ROUNDS = process.env.SALT_ROUNDS;
const TOKEN_KEY = process.env.TOKEN_KEY;
// const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME;

// Method to register the user.
exports.register = async (req, res) => {
  const { first_name, last_name, email, password, role, mobile } = req.body;
  // all fields should be filled (email, name, password)
  
  if (!(first_name && email && password)) {
    return res.status(400).send({
      message:
        "Name or Email or Password or Role is missing. all fields are required.",
    });
  }

  // check for email format
  if (!email.match(emailFormat)) {
    return res.status(400).send({
      message: "email is not in correct format.",
    });
  }

  // check user is already present or not
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res
      .status(400)
      .send({ message: "User already exists. please login." });
  }

  //  encrypt the password
  const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
  const encryptedPassword = await bcrypt.hash(password, salt);

  // create user doc and save into DB
  const user = new User({
    fisrt_name: first_name,
    last_name: last_name,
    email: email.toLowerCase(),
    password: encryptedPassword,
    mobile: mobile,
    role: role,
  });

  user
    .save(user)
    .then((data) => {
      let user_data = data;
      const token = jwt.sign(
        {
          user_id: data._id,
          fisrt_name: first_name,
          last_name: last_name,
          email: email.toLowerCase(),
          mobile: mobile,
          role: role,
        },
        TOKEN_KEY,
        {
          // expiresIn: TOKEN_EXPIRE_TIME,
        }
      );

      res.send({
        message: "User registered successfully.",
        user: user_data,
        token: token,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "unable to register user" });
    });
};

// Method to login the user. Only registered users are allowed
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // all fields should be filled (email, password)
  if (!(email && password)) {
    return res.status(400).send({
      message: "email or password is missing. all fields are required.",
    });
  }

  //  check for email format
  if (!email.match(emailFormat)) {
    return res.status(400).send({
      message: "email is not in correct format.",
    });
  }

  // check user is already present or not
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({ message: "User not found. please register" });
  }

  //  compare encrypted the password and return JWT signed token on success
  if (await bcrypt.compare(password, user.password)) {

    const token = jwt.sign(
      {
        user_id: user.id,
        email,
        role: user.role,
        first_name: user.fisrt_name,
        last_name: user.last_name,
        mobile: user.mobile,
      },
      TOKEN_KEY,
      {
        // expiresIn: TOKEN_EXPIRE_TIME,
      }
    );

    return res
      .status(200)
      .json({ message: "user logged in.", token: token, user: user });
  }
  res.status(400).send({ message: "Invalid Credentials." });
};

exports.getusers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
};
