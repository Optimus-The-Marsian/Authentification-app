const router = require("express").Router();

const User = require("../models/User");

const CryptoJS = require("crypto-js");

const jwt = require("jsonwebtoken");

const { verifyToken, verifyTokenAndAdmin } = require("./verify");
const { verify } = require("crypto");
router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });

    await newUser.save();
  } catch (err) {
    res.status(500).json(err);
  }
  return res.redirect("/login");
});

router.get("/success", verifyToken, async (req, res) => {
  res.render("success");
});

router.get("/admin", verifyTokenAndAdmin, async (req, res) => {
  res.render("admin");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const new_user = await User.findOne({
      username: req.body.username,
    });

    if (!new_user) {
      console.log("Wrong user name");
      return res.redirect("/auth/login");
    }

    //   decrypt
    const hashedPassword = CryptoJS.AES.decrypt(
      new_user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    const inputPassword = req.body.password;

    const maxAge = 3 * 24 * 60;

    if (originalPassword != inputPassword) {
      console.log("wrong password");
      return res.redirect("/auth/login");
    }

    const token = jwt.sign(
      { id: new_user._id, isAdmin: new_user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: maxAge }
    );

    res.cookie("UserCookie", token, { httpOnly: true, maxAge: maxAge * 1000 });

    return res.status(201).json({ user: new_user._id });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
