const express = require("express");
const { createBill, getBills, getBillById } = require("../controllers/billController");
const router = express.Router();

router.post("/", createBill);
router.get("/", getBills);
router.get("/:id", getBillById);

module.exports = router;
