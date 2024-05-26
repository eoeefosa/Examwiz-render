"use strict";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
const router = Router();

// var login = require("../views/auth/login.ejs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { errorMessage: "" });
});

/* AUthentication*/
// Login
router.get("/login", function (req, res, next) {
  res.render("auth/login", { errorMessage: "" });
});

router.post("/login", async function async(req, res, next) {
  const { username, password } = req.body;
  // Handle login logic here
  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "Username and password are required",
    });
  }

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.render("auth/login", {
        errorMessage: "Incorrect username or password",
      });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    //TODO: test this code for returning true or false
    if (!correctPassword) {
      return res.render("auth/login", {
        errorMessage: "Incorrect username or password",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET || "my secret",
      { expiresIn: "7d" }
    );

    user.is_online = true;
    await user.save();

    return res.redirect("/dashboard");
  } catch (error) {
    res.render("auth/login", {
      errorMessage: `server error: ${error.message}`,
    });
  }
});

router.get("/register", function (req, res, next) {
  res.render("auth/register", { errorMessage: "" });
});

// register
router.post("/register", async function (req, res, next) {
  try {
    console.log(req.body);
    const { username, password, email, phone_no, address, referral } = req.body;
    // chicking if the required fields are missing
    if (!username || !password || !email || !phone_no) {
      return res.render("auth/register", {
        errorMessage: `All required field must be filled`,
      });
    }

    // Check for existing account with username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.render("auth/register", {
        errorMessage: `User with this username: ${username} already exist`,
      });
    }

    const user = new User();
    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    user.phone_no = phone_no;
    user.email = email;
    user.address = address || "";
    user.timeStamp = Date.now();
    user.follower = [];
    user.posts = [];

    const currentuser = await user.save();

    const token = jwt.sign(
      {
        _id: currentuser._id,
        email: currentuser.email,
        username: currentuser.username,
      },
      process.env.JWT_SECRET || "my secret",
      { expiresIn: "30000 s" }
    );

    // return responsejson(
    //   true,
    //   `${currentuser.username} account created successfully`,
    //   res,
    //   200,
    //   token
    // );
    // return res.status(200).send({ status: "success", msg: "success", token });
    return res.redirect("/dashboard");
  } catch (error) {
    return res.render("auth/login", {
      errorMessage: `server error: ${error.message}`,
    });
  }
});

router.get("/forgot-password", function (req, res, next) {
  res.render("auth/forgot-password", { title: "login" });
});

router.get("/logout", function (req, res, next) {
  res.render("auth/logout", { title: "login" });
});

router.get("/2FA", function (req, res, next) {
  res.render("auth/2FA", { title: "login" });
});
router.get("/lock-screen", function (req, res, next) {
  res.render("auth/lock-screen", { title: "login" });
});

/* Admin*/

// const people = ["geddy", "neil", "alex"];
router.get("/dashboard", function (req, res, next) {
  res.render("admin/dashboard", { title: "login" });
});

export default router;
