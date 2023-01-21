const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  // console.log("hi");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let skToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: skToken });
    await this.save();
    return skToken;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
