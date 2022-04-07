var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    token: String,
    createdAt: Date,
    updatedAt: Date,
    password:String,
    pwToken:String
  },
  { collection: "users" }
);

var User = mongoose.model("User", UserSchema);

module.exports = User;
