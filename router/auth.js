const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

require("../db/connection");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Home from router.js");
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name || !email || !password || !confirmpassword) {
    return res.status(422).json({ error: "Please fill the field properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exist." });
    } else if (password != confirmpassword) {
      return res.status(422).json({ error: "Password are not matching" });
    } else {
      const user = new User({
        name,
        email,
        password,
        confirmpassword,
      });

      await user.save();

      res.status(201).json({ message: "User registered successfully", user });
    }
  } catch (error) {
    console.log(error);
  }
});

// login route

router.post("/login", async (req, res) => {
  //   console.log(req.body);
  //   res.json("signin success");

  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please filled the data" });
    }
    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin)
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 9632500000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials" });
      } else {
        res.json({ message: "User signin successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/calculate", (req, res) => {
  const { P, I, T } = req.body;
  let amount = Number(P);
  let rate = Number(I);
  let years = Number(T);

  let F = Math.floor(amount * (((1 + rate) ** years - 1) / rate));
  var TIA = amount * years;
  var TIG = Math.floor(F - TIA);

  res.send({
    TIA: TIA,
    F: F,
    TIG: TIG,
  });
});

// About us Page
router.get("/getProfile", authenticate, (req, res) => {
  console.log("This is about");
  res.send(req.rootUser);
});

module.exports = router;
