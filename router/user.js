const express = require("express");
const edit = express.Router();
const {verifytokenandauthorize} = require("../middlewars/verifytoken");
const { User, userupdatevalidate } = require("../modules/User");
// you can use async hanler instead of try and catch
const asynchandler = require("express-async-handler");
// to hash password
const bcrypt = require("bcryptjs");
// to generate token

/*****
 * @desc update user
 * @method put
 * @route  /user/updated:id
 * @access private
 */
edit.put(
  "/update/:id",
  verifytokenandauthorize,
  asynchandler(async (req, res) => {
    // validate
    const { error } = userupdatevalidate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    //hash password
    // password hash with bcrypt
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    // route updated
    const updatedusers = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          name: req.body.name,
          lastname: req.body.lastname,
          password: req.body.password,
          admin: req.body.admin,
          data: req.body.data,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedusers);
  })
);

module.exports = edit;
