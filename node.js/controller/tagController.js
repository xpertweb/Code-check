var Tag = require("../models/tag");
var mongoose = require("mongoose");
const slugify = require("slugify");

// ********Insert Tag****
const addtag = async (req, res) => {
  const options = {
    remove: undefined,
    lower: true,
    strict: false,
    locale: "en",
    trim: true,
    separator: "-",
  };

  slug = slugify(req.body.name, options);

  try {
    const tagResult = await Tag.findOne({
      slug: slug,
    });
    if (tagResult) {
      return res
        .status(400)
        .send({ status: 400, message: "Name already exist!" });
    } else {
      const data = {
        name: req.body.name.trim(),
        slug: slug,
        createdAt: created_date,
        updatedAt: created_date,
      };

      const result = await new Tag(data);
      result.save();
      return res.status(200).send({ status: 200, message: "Add successfully" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({
        status: 500,
        message: "something went wrong",
        error: err.message,
      });
  }
};
// *********Get tag data *****
const gettag = async (req, res) => {
  try {
    const getData = await Tag.find();
    return res
      .status(200)
      .send({ status: 200, message: "Tag Data", data: getData });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "something went wrong, please try again later!",
      error: err.message,
    });
  }
};

// ******* Update tag data******
const updatetag = async (req, res) => {
  const result = await Tag.findOne({
    name: req.body.name.trim(),
    _id: { $ne: req.params.id },
  });
  if (result) {
    return res.status(400).send({ status: 400, message: "Name already exist!" });
  }

  try {
    const data = await Tag.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        slug: slugify(req.body.name),
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "updated successfully" });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "something went wrong, please try again later!",
      error: err.message,
    });
  }
};

// *******DElete tag*******
const deletetag = async (req, res) => {
  try {
    const data = await Tag.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send({ status: 200, message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "something went wrong, please try again later!",
      error: err.message,
    });
  }
};

module.exports = {
  addtag,
  gettag,
  updatetag,
  deletetag,
};
