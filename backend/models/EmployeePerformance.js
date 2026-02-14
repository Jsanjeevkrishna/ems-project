const mongoose = require("mongoose");

const employeePerformanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    feedback: {
      type: String,
    },

    month: {
      type: String, // "2026-02"
      required: true,
    },
  },
  { timestamps: true }
);

// One review per employee per month
employeePerformanceSchema.index(
  { employeeId: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "EmployeePerformance",
  employeePerformanceSchema
);
