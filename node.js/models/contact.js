var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ContactSchema = new Schema(
  {
    name: String,
    phone: String,
    email: String,
    note: String,
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: "contacts" }
);

var Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
