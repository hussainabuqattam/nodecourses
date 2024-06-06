const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    bookname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    pagenum: {
      type: Number,
      required: true,
      minlength: 0,
      maxlength: 500,
    },
    bookeditor: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = {
  Exam,
};
