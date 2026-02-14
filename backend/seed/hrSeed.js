const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config({ path: "../.env" });

const seedHR = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    const existingHR = await User.findOne({ role: "admin" });

    if (existingHR) {
      console.log("HR already exists. Seeding skipped.");
      process.exit();
    }

    await User.create({
      name: "sanjeev",
      email: "emp@email.com",
      password: "hello",
      role: "admin",
    });

    console.log("HR account created successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedHR();
