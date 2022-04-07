var User = require("../models/user");
const jwt = require("jsonwebtoken");
var auth = require("../auth/token");
const timestamp = require("time-stamp");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
const bcrypt = require("bcrypt");
const ejs = require('ejs');
var Mail = require('../utilities/mail');
var fs = require('fs');
var path = require('path');
const uniqid = require('uniqid');

// **********single data************
const loginToken = async (req, res) => {
  try {
    const data = await User.findOne({ token: req.body.token });
    if (data) {
      let response = {
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        jwt: jwt.sign({ userId: data._id }, auth.jwtSecret),
      };
      return res.status(200).send({ status: 200, data: response });
    } else {
      return res.status(200).send({ status: 400, message: "Please provide valid token!" });
    }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const data = await User.findOne({ id: req.params.id });
    let response = {
      id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };
    return res.status(200).send({ status: 200, message: "User Data", data: response });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await User.updateOne({ _id: req.params.id }, req.body);

    return res
      .status(200)
      .send({ status: 200, message: "Profile Updated successfully!", data: result });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
const signup = async (req, res) => {
  try {
    const pass = await bcrypt.hash(req.body.password, 10);

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: pass,
    };
    const result = await User.findOne({ email: data.email });
    if (result) {
      return res.status(400).send({ status: 400, message: "Email already exist!" });
    }
    const addData = await new User(data);
    addData.save();
    return res.status(200).send({ status: 200, message: "sign up has suceesfully " });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const password = req.body.password;
    const data = await User.findOne({ email: req.body.email });
    if (data) {
      let response = {
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        jwt: jwt.sign({ userId: data._id }, auth.jwtSecret),
      };
      const passRes= await bcrypt.compare(password, data.password);
      if (passRes) {
        return res.status(200).send({ status: 200, message: "Login Successful", data:response });
      } else {
        return res.status(400).send({ status: 400, message: "Incorrect Password" });
      }
    } else {
      return res.status(400).send({ status: 400, message: "User Not Exist" });
    }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};


const forgotPassword = async (req,res)=>{
  try {
    console.log(req.body.email,'hellooo', process.env.FRONT_BASE_URL);
        let hash = uniqid();
        var update_data = {
          pwToken: hash,
          updated_at: created_date,
        };
        await User.updateOne({email: req.body.email.toLowerCase()}, update_data);
           
        let userData= await User.findOne({email: req.body.email.toLowerCase()});
        if(userData){
          let templatePath  = path.join('./mail_template/');
          var compiled = ejs.compile(fs.readFileSync(path.resolve(templatePath + 'resetPassword.html'),"utf8"));
          var html = compiled({
              email: req.body.email.toLowerCase(),
              name: userData.firstName+' '+userData.lastName,
              site_url: process.env.FRONT_BASE_URL+'/reset-password/'+userData._id+'/'+hash,
          })
          Mail.sendMailer({email:req.body.email.toLowerCase(),body:html,subject:'Forget Password'}); 
          return res.status(200).send({ status: 200, message: "Forget password" });
        }
        else{
          return res.status(400).send({ status: 400, message: "User not exit!" });
        }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
}


const resetPassword = async (req,res)=>{
  try {
      if (!req.body) {
          return res.send({
            status: 500,
            message: "Note content can not be empty",
          });
        }
        const pass = await bcrypt.hash(req.body.new_password, 10);
        var update_data = {
          password:  pass,
          pwToken: "",
          updated_at: created_date,
        };
        let user_data= await User.findOne({_id: req.body.userId});

          await User.updateOne({_id: req.body.userId,pwToken:req.body.pwToken}, update_data)
            .then(async (data) => {
                if(user_data && user_data.pwToken)
                {
                  return res.send({ data:data,status: 200, message: "Password reset successfully" });
                }
                else
                {
                  return res.send({ data:data,status: 400, message: "Link has been expired!" });
                }
            })
            .catch((err) => {
           
              return res.send({ status: 500, message: err.message });
            });
          
  } catch (error) {
      return res.send({ status: 500, message: error.message });
  }
}

module.exports = {
  loginToken,
  getSingleUser,
  updateUser,
  signup,
  login,
  forgotPassword,
  resetPassword
};
