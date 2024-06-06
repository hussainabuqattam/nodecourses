const express = require("express");

const exam = express.Router();

const { Exam } = require("../modules/Exam");
const Joi = require("joi");

exam.use(express.json());
// Array for new test exam

const examarray = [
  {
    id: 1,
    bookname: "newbook",
    pagenum: 250,
    bookeditor: "hussain",
  },
];

/**
 * @desc show all book in array
 * @method get
 * @route /books/details/
 * @access public
 */

exam.get("/", async (req, res) => {
  const dataexam = await Exam.find();
  res.status(200).json(dataexam)
});

/**
 * @desc Add book in array
 * @method post
 * @route /books/details/
 * @access public
 */

exam.post("/", async (req, res) => {
  const { error } = addbookvalidate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const newbook = new Exam({
      bookname: req.body.bookname,
      pagenum: req.body.pagenum,
      bookeditor: req.body.bookeditor,
    });

    const addbookresult = await newbook.save();
    res.status(201).json(addbookresult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ meesage: "something went wrong" });
  }
});

/**
 * @desc update book in array
 * @method put
 * @route /books/details/
 * @access public
 */
exam.put("/:id", (req, res) => {
  const { error } = updatebookvalidate(req.body);

  if (error) {
    return res.status(400).json({ meesage: error.details[0].message });
  }

  const updated = examarray.find((e) => e.id === parseInt(req.params.id));
  if (updated) {
    return res.status(200).json(`the book was id ${req.params.id} is updated`);
  } else {
    return res.status(400).json("this book not found in database");
  }
});

/**
 * @desc delete book in array
 * @method delete
 * @route /books/details/
 * @access public
 */

exam.delete("/:id", (req, res) => {
  const deletbook = examarray.find((e) => e.id === parseInt(req.params.id));

  if (deletbook) {
    return res.status(200).json(`the book in id ${req.params.id} was deleted`);
  } else {
    return res.status(400).json(`the book in id ${req.params.id} not found`);
  }
});
const addbookvalidate = (obj) => {
  const schema = Joi.object({
    bookname: Joi.string().trim().min(2).max(20).required(),
    pagenum: Joi.number().min(0).max(500).required(),
    bookeditor: Joi.string().trim().min(2).max(20).required(),
  });

  return schema.validate(obj);
};

const updatebookvalidate = (obj) => {
  const schema = Joi.object({
    bookname: Joi.string().trim().min(2).max(20).required(),
    pagenum: Joi.number().min(0).max(500).required(),
    bookeditor: Joi.string().trim().min(2).max(20).required(),
  });

  return schema.validate(obj);
};

module.exports = exam;
