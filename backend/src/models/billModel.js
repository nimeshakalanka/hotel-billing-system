const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  type: { type: String, enum: ["room", "function"], required: true },
  customerName: String,
  date: Date,
  details: Object,
  total: Number,
  pdfPath: String,
}, { timestamps: true });

module.exports = mongoose.model("Bill", BillSchema);
