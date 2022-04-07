var Contact = require("../models/contact");
const contactservice = require("../services/contactservice");
const fs = require("fs");
let stream = fs.createReadStream("data.csv");
const CONFIG = require("../config.json");
var csvWriter = require("csv-write-stream");
const { json } = require("body-parser");
var writer = csvWriter({ sendHeaders: true });
const timestamp = require("time-stamp");
const { findOne } = require("../models/contact");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
// ********add csv data to mongo********
const addcsvcontact = async (req, res) => {
  const csvtojson = require("csvtojson");
  const data_csv = await csvtojson().fromFile("data.csv");

  const arr = [];
  data_csv.map(async (data, i) => {
    if (data.name != "" && data.phone != "" && data.email != "") {
      // console.log(data_csv);
      arr.push(data);
    }
  });

  try {
    const data = await Contact.insertMany(arr);

    return res
      .status(200)
      .send({ status: 200, message: "Inserted successfully" });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
// ************READ FROM CSV*********
const readcsv = async (req, res) => {
  const csvtojson = require("csvtojson");

  try {
    const data_csv = await csvtojson().fromFile("data.csv");
    return res.status(200).send({ status: 200, message: data_csv });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
// **********check Email in CSV ********
const addcontact = async (req, res) => {
  try {
    // console.log(req.body,'req.body');
    const contactResult = await Contact.findOne({
      email: req.body.email.toLowerCase(),
    }).exec();
    if (contactResult && contactResult._id) {
      return res
        .status(400)
        .send({ status: 400, message: "Email already exist!" });
    } else {
      const data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email.toLowerCase(),
        createdAt: created_date,
        updatedAt: created_date,
      };
      const result = await Contact.create(data);

      if (result) {
        return res
          .status(200)
          .send({ status: 200, message: "Add successfully" });
      } else {
        return res
          .status(400)
          .send({ status: 400, message: "Contact not added" });
      }
    }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};

const addMultipleContact = async (req, res) => {
  let contacts = JSON.parse(req.body.contacts);
  const contactType = req.body.contactType;
  const contactProperty = req.body.contactProperty;
  try {
    if (contacts.length > 0) {
      const result = await Promise.all(
        contacts.map(async (val) => {
          let contactExist = await Contact.findOne({
            [contactProperty]:
              contactProperty == "phone" ? val.phone : val.email.toLowerCase(),
          });
          if (contactExist && contactType == "skip") {
          } else if (contactExist && contactType == "update") {
            await Contact.updateOne(
              {
                [contactProperty]:
                  contactProperty == "phone" ? val.phone : val.email.toLowerCase(),
              },
              {
                email: val.email.toLowerCase(),
                phone: val.phone,
                name: val.name,
              }
            );
          } else {
            Contact.create({
              email: val.email.toLowerCase(),
              phone: val.phone,
              name: val.name,
            });
          }
        })
      );
      // console.log(result, "result");
      return res.status(200).send({ status: 200, message: "Add successfully" });
    }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};

// **********DELETE FROM mongo**********
const deleteContact = async (req, res) => {
  const contacts = JSON.parse(req.body.contacts);
  try {
    const result = await Contact.deleteMany({ _id: { $in: contacts } });

    return res
      .status(200)
      .send({ status: 200, message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
// **********update from mongo*********
const updateContact = async (req, res) => {
  try {
    const result = await Contact.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
      }
    );

    return res
      .status(200)
      .send({
        status: 200,
        message: "Updated successfully",
        error: err.message,
      });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
// **********single data************
const singlecontact = async (req, res) => {
  try {
    const data = await Contact.findOne({ id: req.params.id });
    return res
      .status(200)
      .send({ status: 200, message: "Contact Data", data: data });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
// *********Read from Mongo********
const getContact = async (req, res) => {
  try {
    const data = await Contact.find();
    return res.status(200).send({ status: 200, data });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
// ************limitcontact*******
const limitcontact = async (req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const data = await Contact.find({})
      .limit(pageSize)
      .skip(pageSize * page);
    return res.status(200).send({ status: 200, message: data });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
// ************skip ********************
const skipcontact = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const skip = await Contact.find().skip(id);
    return res
      .status(200)
      .send({ status: 200, message: "succsesfully skipped" });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};

module.exports = {
  addcsvcontact,
  readcsv,
  addcontact,
  deleteContact,
  updateContact,
  singlecontact,
  getContact,
  limitcontact,
  skipcontact,
  addMultipleContact,
};
