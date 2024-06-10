const express = require("express");
const userss = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const {
  User,
  userregistervalidate,
  userloginvalidate,
} = require("../modules/User");
// you can use async hanler instead of try and catch
const asynchandler = require("express-async-handler");
// to hash password
const bcrypt = require("bcryptjs");
// to generate token
const jwt = require("jsonwebtoken");
userss.use(express.json());

/*****
 * @desc add new register user
 * @method post
 * @route  /user/auth/register
 * @access public
 */

userss.post(
  "/register",
  asynchandler(async (req, res) => {
    const { error } = userregistervalidate(req.body);
    // check validate
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // check if the email in database

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        message: `this email ${req.body.email} is already registration`,
      });
    }
    // password hash with bcrypt
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user = new User({
      email: req.body.email,
      name: req.body.name,
      lastname: req.body.lastname,
      password: req.body.password,
      admin: req.body.admin,
      data: req.body.data,
    });
    const newuser = await user.save();
    const token = user.generatetoken();
    // send other data but dont send password with
    const { password, ...other } = newuser._doc;
    res.status(201).json({ other, token });
  })
);

/*****
 * @desc login
 * @method post
 * @route  /user/auth/login
 * @access public
 */

userss.post(
  "/login",
  asynchandler(async (req, res) => {
    const { error } = userloginvalidate(req.body);
    // check validate
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // check if the email in database

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: `this email ${req.body.email} is not allowed`,
      });
    }
    // password correct compare or no with bcrypt
    const comparepass = await bcrypt.compare(req.body.password, user.password);

    if (!comparepass) {
      return res.status(400).json({
        message: `this password ${req.body.email} is not allowed`,
      });
    }
    const token = user.generatetoken();

    // send other data but dont send password with
    const { password, ...other } = user._doc;
    res.status(201).json({ other, token });
  })
);

module.exports = userss;
