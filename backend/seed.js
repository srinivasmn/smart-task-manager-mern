// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Task from "./models/Task.js";
import Notification from "./models/Notification.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();
    await Notification.deleteMany();

    // Create Admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: process.env.ADMIN_EMAIL,
      password: bcrypt.hashSync("Admin@123", 10), // <-- Default Password
      role: "admin",
    });

    // Create sample tasks
    const sampleTasks = [
      { title: "Design Landing Page", status: "pending", assignedTo: adminUser._id },
      { title: "Set up Backend APIs", status: "in-progress", assignedTo: adminUser._id },
      { title: "Testing GraphQL Queries", status: "completed", assignedTo: adminUser._id },
    ];
    await Task.insertMany(sampleTasks);

    // Create sample notifications
    await Notification.create({
      message: "Welcome to Smart Task Manager!",
      user: adminUser._id,
    });

    console.log("✅ Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

seedData();
