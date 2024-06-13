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

module.exports.updateuser = asynchandler(async (req, res) => {
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

  /*****
 * @desc get user by filter on email
 * @method get
 * @route  /user
 * @access private
 */

// Comparison Query Operators => It is used for filtering and comparisons, such as I need a specific price or a price between a number and a specific number, etc.
// The rest of the details are available at the link: https://www.mongodb.com/docs/manual/reference/operator/query-comparison/

// filtering by email using query

module.exports.getuserbyemail =   asynchandler(async (req, res) => {
    const { email } = req.query;
    let alluser;
    if (email) {
      alluser = await User.find({ email }).select("-password");
      res.status(200).json(alluser);
    } else {
      alluser = await User.find().select("-password");
      res.status(200).json(alluser);
    }
  })

   /*****
 * @desc get all user 
 * @method get
 * @route  /user
 * @access private
 */


module.exports.getalluser =   asynchandler(async (req, res) => {
    let alluser;
    alluser = await User.find().select("-password");
    res.status(200).json(alluser);
  })


/*****
 * @desc get user by id
 * @method get
 * @route  /user/:id
 * @access private
 */


  module.exports.getuserbyid =   asynchandler(async (req, res) => {
    const alluser = await User.findById(req.params.id).select("-password");
    if (!alluser) {
      return res
        .status(400)
        .json({ message: "this user not found in database" });
    }
    res.status(200).json(alluser);
  })


  /*****
 * @desc delet user by id
 * @method delete
 * @route  /user/:id
 * @access private
 */

  
  module.exports.deleteuser =  asynchandler(async (req, res) => {
    const alluser = await User.findById(req.params.id).select("-password");
    if (alluser) {
      await User.findOneAndDelete(req.params.id);
      res.status(200).json({ message: "this user deleted" });
    } else {
      res.status(400).json({ message: "this user not found in database" });
    }
  })
