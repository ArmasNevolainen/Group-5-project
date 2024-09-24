const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const toolsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String, required: true },
    available: { type: Boolean, required: true },
  },
  { timestamps: true },
  { collection: "tools" }
);

module.exports = mongoose.model("Tools", toolsSchema);
