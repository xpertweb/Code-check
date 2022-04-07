var mongoose = require("mongoose");  
var Schema = mongoose.Schema;

var TagSchema = new Schema(
  {
    name: String,
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    createdAt: Date,
    updatedAt: Date,
    slug: { type: String },
  },
  { collection: "tags" }
);

var Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
