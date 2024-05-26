"use strict";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Subscription from "../models/Subscription.js";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

import User from "../models/user.js";
import crypto from "crypto";

const router = Router();

function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex");
}

// Middleware to verify JWT and extract user information
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming token is stored in a cookie named 'token'

  if (!token) {
    return res.redirect("/login"); // Redirect to login if token is not present
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "my secret");
    req.user = decoded; // Attach user information to the request object
    next();
  } catch (error) {
    return res.redirect("/login"); // Redirect to login if token is invalid
  }
};

// Rate limiter middleware to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: "Too many login attempts, please try again later.",
});

// Rate limiter middleware to prevent brute force attacks
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 register requests per windowMs
  message: "Too many registration attempts, please try again later.",
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    messages: {
      error: req.flash("error"),
      success: req.flash("success"),
    },
  });
});

/* AUthentication*/
// Login
router.get("/login", function (req, res, next) {
  res.render("auth/login", { errorMessage: "" });
});

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email already exists in the database
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      req.flash("error", "This email is already subscribed.");
      return res.redirect("/#subscribe");
    }

    // Create a new subscription
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    req.flash("success", "Congrats, you have subscribed to Examwiz!");
    return res.redirect("/#subscribe");
  } catch (err) {
    req.flash("error", "An error occurred. Please try again later.");
    return res.redirect("/#subscribe");
  }
});

/**
 * Login post
 */
router.post(
  "/login",
  loginLimiter,
  [
    body("username")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Username is required")
      .escape(),
    body("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Password is required")
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("auth/login", {
        errorMessage: errors
          .array()
          .map((error) => error.msg)
          .join(", "),
      });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.render("auth/login", {
          errorMessage: "Incorrect username or password",
        });
      }

      const correctPassword = await bcrypt.compare(password, user.password);
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

      // Update user status
      user.is_online = true;
      await user.save();

      // Set the token in a cookie or send it in the response
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.redirect("/dashboard");
    } catch (error) {
      console.error("Login error:", error); // Log error details for debugging
      return res.render("auth/login", {
        errorMessage: "Server error, please try again later.",
      });
    }
  }
);

router.get("/register", function (req, res, next) {
  res.render("auth/register", { errorMessage: "" });
});
/**
 * Register post
 */
router.post(
  "/register",
  registerLimiter,
  [
    body("username")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Username is required")
      .escape(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .escape(),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail(),
    body("phone_no")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Phone number must be at least 10 digits")
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("auth/register", {
        errorMessage: errors
          .array()
          .map((error) => error.msg)
          .join(", "),
      });
    }

    const { username, password, email, phone_no, address, referral } = req.body;

    try {
      // Check for existing account with username
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.render("auth/register", {
          errorMessage: `User with this username: ${username} already exists`,
        });
      }

      // Generate a unique referral code
      const userReferralCode = generateReferralCode();

      const user = new User({
        username,
        password: await bcrypt.hash(password, 10),
        phone_no,
        referralCode: userReferralCode,
        email,
        address: address || "",
        timeStamp: Date.now(),
        follower: [],
        posts: [],
      });

      if (referral) {
        // Find the user with the referral code
        const referringUser = await User.findOne({ referralCode: referral });
        if (referringUser) {
          user.referredBy = referringUser._id;
          referringUser.referredUsers.push(user._id);

          // Award bonus points to the referring user
          referringUser.bonusPoints += 10; // Example bonus points

          await referringUser.save();
        }
      }

      const currentUser = await user.save();

      const token = jwt.sign(
        {
          _id: currentUser._id,
          email: currentUser.email,
          username: currentUser.username,
        },
        process.env.JWT_SECRET || "my secret",
        { expiresIn: "7d" }
      );

      // Set the token in a cookie or send it in the response
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.redirect("/dashboard");
    } catch (error) {
      console.error("Registration error:", error); // Log error details for debugging
      return res.render("auth/register", {
        errorMessage: "Server error, please try again later.",
      });
    }
  }
);

router.get("/forgot-password", function (req, res, next) {
  res.render("auth/forgot-password", { title: "login" });
});

// Logout route
router.get("/logout", function (req, res) {
  // Clear the authentication token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  // Optional: If using session-based authentication, destroy the session
  // req.session.destroy(err => {
  //   if (err) {
  //     return res.redirect('/dashboard'); // Handle session destruction error if needed
  //   }
  //   res.redirect('/login'); // Redirect to login page after successful logout
  // });

  // Redirect to login page after clearing the cookie
  res.redirect("/login");
});

router.get("/2FA", function (req, res, next) {
  res.render("auth/2FA", { title: "login" });
});

router.get("/lock-screen", function (req, res, next) {
  res.render("auth/lock-screen", { title: "login" });
});

/* Admin*/

// Dashboard route
router.get("/dashboard", verifyToken, async function (req, res) {
  // Access user information from req.user and pass it to the view
  const { username, email, _id } = req.user;

  const user = await User.findById({ _id });

  const {
    referralCode,
    balance,
    plan,
    follower,
    following,
    bonusPoints,
    is_online,
  } = user;

  console.log(
    username,
    email,
    referralCode,
    balance,
    plan,
    follower,
    following,
    bonusPoints,
    is_online
  );
  res.render("user/courses", {
    title: "Dashboard",
    username,
    email,
    referralCode,
    balance,
    plan,
    follower,
    following,
    bonusPoints,
    is_online,
  });
});
export default router;
