const express = require("express");
const edit = express.Router();
const {
  verifytokenandauthorize,
  verifytokeadmin,
} = require("../middlewars/verifytoken");
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

/*****
 * @desc get all user
 * @method get
 * @route  /user
 * @access private
 */
edit.get(
  "/",
  verifytokeadmin,
  asynchandler(async (req, res) => {
    const alluser = await User.find().select("-password");
    res.status(200).json(alluser);
  })
);

/*****
 * @desc get user by id
 * @method get
 * @route  /user/:id
 * @access private
 */
edit.get(
  "/:id",
  verifytokenandauthorize,
  asynchandler(async (req, res) => {
    const alluser = await User.findById(req.params.id).select("-password");
    if (!alluser) {
      return res
        .status(400)
        .json({ message: "this user not found in database" });
    }
    res.status(200).json(alluser);
  })
);

/*****
 * @desc delet user by id
 * @method delete
 * @route  /user/:id
 * @access private
 */
edit.delete(
  "/:id",
  verifytokeadmin,
  asynchandler(async (req, res) => {
    const alluser = await User.findById(req.params.id).select("-password");
    if (alluser) {
      await User.findOneAndDelete(req.params.id);
      res.status(200).json({ message: "this user deleted" });
    } else {
      res.status(400).json({ message: "this user not found in database" });
    }
  })
);

module.exports = edit;
