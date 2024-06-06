const mongoose = require("mongoose");
const Joi = require("joi");

// user schema

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 100,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 15,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 15,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Data",
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// new validate register
const userregistervalidate = (obj) => {
  const Schema = Joi.object({
    email: Joi.string().min(6).max(100).required().trim().email(),
    name: Joi.string().min(3).max(15).required().trim(),
    lastname: Joi.string().min(3).max(15).required().trim(),
    password: Joi.string().min(6).required().trim(),
    data: Joi.string().required(),
    admin: Joi.bool(),
  });
  return Schema.validate(obj);
};

// new validate login
const userloginvalidate = (obj) => {
  const Schema = Joi.object({
    email: Joi.string().min(6).max(100).required().trim().email(),
    password: Joi.string().min(6).required().trim(),
  });
  return Schema.validate(obj);
};

// new validate login
const userupdatevalidate = (obj) => {
  const Schema = Joi.object({
    name: Joi.string().min(3).max(15).trim(),
    lastname: Joi.string().min(3).max(15).trim(),
    email: Joi.string().min(6).max(100).trim().email(),
    password: Joi.string().min(6).trim(),
  });
  return Schema.validate(obj);
};

module.exports = {
  User,
  userregistervalidate,
  userloginvalidate,
  userupdatevalidate,
};
