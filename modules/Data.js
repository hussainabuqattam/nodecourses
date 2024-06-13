const mongoose = require("mongoose");

const Joi = require("joi");

const DataSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 10,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    minlength: 3,
    maxlength: 10,
    trim: true,
    required: true,
  },
  age: {
    type: Number,
    minlength: 3,
    maxlength: 50,
    trim: true,
    required: true,
  },
  work: {
    type: String,
    minlength: 3,
    trim: true,
    required: true,
    enum: ["front", "back", "project manager"],
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Exam",
  },
},{timestamps:true});

// validation in joi library
const validate = (obj) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(10).required(),
    lastname: Joi.string().trim().min(3).max(10).required(),
    age: Joi.number().min(3).max(50).required(),
    work: Joi.string().valid("front", "back", "project manager"),
    exam: Joi.required(),
  });

  return schema.validate(obj);
};
const Datauser = mongoose.model("Data", DataSchema);
module.exports = {
  Datauser,
  validate,
};
