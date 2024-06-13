const express = require("express");
const edit = express.Router();
const {
  verifytokenandauthorize,
  verifytokeadmin,
} = require("../middlewars/verifytoken");
const {
  deleteuser,
  getuserbyid,
  getalluser,
  getuserbyemail,
  updateuser,
} = require("../Controllers/usercontroller");
// We can use this writing method to group similar routes together
// Note that controllers have been used and all operations have been placed in it, and we are calling them only here

// route =>  /user
edit
  .route("/")
  .get(verifytokeadmin, getuserbyemail)
  .get(verifytokeadmin, getuserbyemail)
  .get(verifytokeadmin, getalluser);
// route => /user/:id
edit
  .route("/:id")
  .get(verifytokenandauthorize, getuserbyid)
  .delete(verifytokeadmin, deleteuser);

// route /user/update/:id
edit.put("/update/:id", verifytokenandauthorize, updateuser);
module.exports = edit;
