const usermodel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("validator");
dotenv.config();

function validatePassword(password) {
  // Example: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Invalid email format. Please enter a valid email address.",
        });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        status: "error",
        message:
          "Password does not meet complexity requirements. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    if (![0, 1, 2].includes(role)) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Invalid role. Please select a valid role.",
        });
    }

    const user = await usermodel.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({
          status: "error",
          message:
            "Email is already in use. Please use a different email address.",
        });
    }

    const hash = bcrypt.hashSync(password, 12);

    await usermodel.create({
      name,
      email,
      password: hash,
      role,
    });

    const token = jwt.sign({ email }, process.env.SECRET_KEY);

    res.status(201).json({
      status: "ok",
      name,
      email,
      role,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Internal server error. Please try again later.",
      });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Invalid email format. Please enter a valid email address.",
        });
    }

    const user = await usermodel.findOne({ email });

    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email }, process.env.SECRET_KEY);

        res.status(200).json({
          status: "ok",
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        });
      } else {
        res
          .status(401)
          .json({
            status: "error",
            message: "Invalid password. Please enter the correct password.",
          });
      }
    } else {
      res
        .status(404)
        .json({
          status: "error",
          message: "User not found. Please register or check your email.",
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Internal server error. Please try again later.",
      });
  }
};

exports.verification = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(401)
        .json({
          status: "error",
          message: "No token provided. Please provide a valid token.",
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({
            status: "error",
            message: "Invalid token. Please provide a valid token.",
          });
      }

      res.status(200).json({ status: "ok", decoded });
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Internal server error. Please try again later.",
      });
  }
};
