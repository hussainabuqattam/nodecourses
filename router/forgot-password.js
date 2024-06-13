const express = require("express");
const {
  getforgotpassword,
  checkemail,
  changepassword,
  updatepassword,
} = require("../Controllers/forgot-passwordcontrollers");
const route = express.Router();
// password/forgot
route.route("/forgot").get(getforgotpassword).post(checkemail);
// password/forgot/:id/:token
route.route("/forgot/:id/:token").get(changepassword).post(updatepassword);

module.exports = route;
