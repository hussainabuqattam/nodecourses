const jwt = require("jsonwebtoken");
const { User, passwordvalidate } = require("../modules/User");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

//The difference between the MVC and the API is that the API is used to return RES as a JSON file and is used in the mobile phone,
//the web or anywhere, but the MVC is used with the web only,
//as it returns the HTML file as it is called server side rendering and it does not need a front end.
module.exports.getforgotpassword = asynchandler((req, res) => {
  // using render becuse i want to render html file not json
  res.render("forgot-password");
});

// check email and respons change password link
module.exports.checkemail = asynchandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: "email valid" });
  }
  const secret = process.env.JWT_TOKEN + user.password;
  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "10m",
  });
  const Link = `${process.env.HOST_SIDE}/password/forgot/${user._id}/${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USE_SEND,
      pass: process.env.PASSWORD_USE_SEND,
    },
  });
  const mailOpthions = {
    from: process.env.EMAIL_USE_SEND, // sender address
    to: user.email, // list of receivers
    subject: "Reset password", // Subject line
    // text: "Hello world?", // plain text body
    html: `
    <div>
      <h3>you can change password using this link</h3>
      <p>${Link}</p>
    </div>`, // html body
  };

  transporter.sendMail(mailOpthions, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent : " + success.response);
      res.render("send-change-password");
    }
  });

});

// change password

module.exports.changepassword = asynchandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const secret = process.env.JWT_TOKEN + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render("change-password");
  } catch (error) {
    console.log(error);
    res.json({ message: "error" });
  }
});

// update password and respone is updatede

module.exports.updatepassword = asynchandler(async (req, res) => {
  const { error } = await passwordvalidate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const secret = process.env.JWT_TOKEN + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salit = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salit);
    user.password = req.body.password;
    await user.save();
    res.render("update-password");
  } catch (error) {
    console.log(error);
    res.json({ message: "error" });
  }
});
