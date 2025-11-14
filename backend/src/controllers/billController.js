const Bill = require("../models/billModel");
const { generatePDF } = require("../services/pdfService");

exports.createBill = async (req, res) => {
  try {
    const { type, details } = req.body;
    const serviceCharge = parseFloat(process.env.SERVICE_CHARGE);
    let total = 0;

    if (type === "function") {
      total = details.packagePrice * details.people * (1 + serviceCharge);
    } else if (type === "room") {
      total = (details.roomPrice + (details.breakfast || 0) + (details.lunch || 0) + (details.dinner || 0)) * (1 + serviceCharge);
    }

    const newBill = await Bill.create({
      type,
      details,
      total,
      date: new Date()
    });

    const pdfPath = await generatePDF(newBill);
    newBill.pdfPath = pdfPath;
    await newBill.save();

    res.json({ success: true, bill: newBill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create bill" });
  }
};

exports.getBills = async (_, res) => {
  const bills = await Bill.find().sort({ createdAt: -1 });
  res.json(bills);
};

exports.getBillById = async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) return res.status(404).json({ error: "Not found" });
  res.json(bill);
};
