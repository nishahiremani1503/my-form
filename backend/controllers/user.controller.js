const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = db.users;
const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const SALT_ROUNDS = process.env.SALT_ROUNDS;
const TOKEN_KEY = process.env.TOKEN_KEY;
// Uncomment and set the TOKEN_EXPIRE_TIME if needed
// const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME;

// Method to register the user.
exports.register = async (req, res) => {
  const { first_name, last_name, email, password, role, mobile } = req.body;
  
  // All fields should be filled (email, name, password)
  if (!(first_name && email && password)) {
    return res.status(400).send({
      message: "Name, Email, or Password is missing. All fields are required.",
    });
  }

  // Check for email format
  if (!email.match(emailFormat)) {
    return res.status(400).send({
      message: "Email is not in correct format.",
    });
  }

  // Check if user is already present
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(400).send({ message: "User already exists. Please login." });
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
  const encryptedPassword = await bcrypt.hash(password, salt);

  // Create user doc and save into DB
  const user = new User({
    first_name: first_name,
    last_name: last_name,
    email: email.toLowerCase(),
    password: encryptedPassword,
    mobile: mobile,
    role: role,
  });

  user
    .save()
    .then((data) => {
      const token = jwt.sign(
        {
          user_id: data._id,
          first_name: first_name,
          last_name: last_name,
          email: email.toLowerCase(),
          mobile: mobile,
          role: role,
        },
        TOKEN_KEY,
        {
          // expiresIn: TOKEN_EXPIRE_TIME, // Uncomment and set the expiration time if needed
        }
      );

      res.send({
        message: "User registered successfully.",
        user: data,
        token: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Unable to register user" });
    });
};

// Method to login the user. Only registered users are allowed
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // All fields should be filled (email, password)
  if (!(email && password)) {
    return res.status(400).send({
      message: "Email or Password is missing. All fields are required.",
    });
  }

  // Check for email format
  if (!email.match(emailFormat)) {
    return res.status(400).send({
      message: "Email is not in correct format.",
    });
  }

  // Check if user is already present
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({ message: "User not found. Please register." });
  }

  // Compare encrypted password and return JWT signed token on success
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        user_id: user.id,
        email,
        role: user.role,
        first_name: user.first_name, // Corrected typo here
        last_name: user.last_name,
        mobile: user.mobile,
      },
      TOKEN_KEY,
      {
        // expiresIn: TOKEN_EXPIRE_TIME, // Uncomment and set the expiration time if needed
      }
    );

    return res.status(200).json({ message: "User logged in.", token: token, user: user });
  }

  res.status(400).send({ message: "Invalid Credentials." });
};

// Method to get all users
exports.getusers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users." });
  }
};
