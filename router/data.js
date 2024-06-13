const express = require("express");
const route = express.Router();
const { Datauser, validate } = require("../modules/Data");
// you can use async hanler instead of try and catch
const asynchandler = require("express-async-handler");
// Middleware to parse JSON bodies
route.use(express.json());

/*****
 * @desc get all user
 * @method get
 * @route  /hussain/information
 * @access public
 */
route.get(
  "/",
  asynchandler(async (req, res) => {
    // find => to show all data in database
    // sort => to sort it
    // selected => to select what i want the res from data to send
    // populate => you can select another database with this
    const AllData = await Datauser.find().populate("exam", ["pagenum", "-_id"]);
    res.json(AllData);
  })
);

/*****
 * @desc pagination route
 * @method get
 * @route  /hussain/information/page
 * @access public
 */
route.get(
  "/page",
  asynchandler(async (req, res) => {
    const { pagenumber } = req.query;
    const { datalimit } = req.query;

    // skip => It is the number of data that he will jump from. For example, I set a process, which is if, for example, the page number is 1, then 1-1 will equal 0, so he will not jump and will start from the beginning.
    // limit => We specify the number of data that will be displayed and received from the client
    const AllData = await Datauser.find()
      .skip((pagenumber - 1) * datalimit)
      .limit(datalimit);
    res.json(AllData);
  })
);

/*****
 * @desc get user in name
 * @method get
 * @route  /hussain/information
 * @access public
 */
route.get(
  "/:name",
  asynchandler(async (req, res) => {
    const userbyname = await Datauser.find({ name: req.params.name });
    if (userbyname) {
      res.status(200).json(userbyname);
    } else {
      res.status(404).send("No data in this array");
    }
  })
);

/*****
 * @desc add new user
 * @method post
 * @route  /hussain/information
 * @access public
 */

route.post(
  "/",
  asynchandler(async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).json({ meesage: error.details[0].message });
    }
    const adduser = new Datauser({
      name: req.body.name,
      lastname: req.body.lastname,
      age: req.body.age,
      work: req.body.work,
      exam: req.body.exam,
    });

    const userdata = await adduser.save();

    res.status(201).json(userdata);
  })
);

/*****
 * @desc edit user in id
 * @method put
 * @route  /hussain/information
 * @access public
 */

route.put(
  "/:id",
  asynchandler(async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).json({ meesage: error.details[0].message });
    }
    const adduser = new Datauser({
      name: req.body.name,
      lastname: req.body.lastname,
      age: req.body.age,
      work: req.body.work,
    });

    const userdata = await adduser.save();

    res.status(201).json(userdata);
  })
);

/*****
 * @desc delete user in id
 * @method delete
 * @route  /hussain/information
 * @access public
 */

route.delete(
  "/:id",
  asynchandler(async (req, res) => {
    const deleted = await Datauser.findById(req.params.id);

    if (deleted) {
      await Datauser.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ meesage: `user in id ${req.params.id} is deleted` });
    } else {
      res
        .status(400)
        .json({ meesage: `user in id ${req.params.id} is not found` });
    }
  })
);

module.exports = route;
