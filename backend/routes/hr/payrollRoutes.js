const express = require("express");
const {
  createOrUpdatePayroll,
  getAllPayrolls,
  markAsPaid,
} = require("../../controllers/hr/payrollController");

const router = express.Router();

// HR
router.post("/save", createOrUpdatePayroll);
router.get("/all", getAllPayrolls);
router.put("/pay/:id", markAsPaid);

module.exports = router;
