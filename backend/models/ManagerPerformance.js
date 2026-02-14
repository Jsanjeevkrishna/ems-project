const mongoose = require("mongoose");

const managerPerformanceSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hrRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    feedback: {
      type: String,
    },

    teamAverageRating: {
      type: Number,
      required: true,
    },

    month: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// One rating per manager per month
managerPerformanceSchema.index(
  { managerId: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ManagerPerformance",
  managerPerformanceSchema
);
