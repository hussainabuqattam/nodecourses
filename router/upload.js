const express = require("express");
const route = express.Router();
const multer = require("multer");
const path = require("path");

const storgeimage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: storgeimage });

// api/uploadimage

route.post("/", upload.single("imagename"), (req, res) => {
  res.status(200).json("image uploade");
});

module.exports = route;
