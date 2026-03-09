require("dotenv").config();
const connectDB = require("../config/database");
const User = require("../models/User");

const initializeDB = async () => {
  try {
    await connectDB();

    // Check if admin exists
    let adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      // reset credentials if they differ
      adminExists.name = "Admin User";
      adminExists.email = "admin@worksphere.com";
      adminExists.password = "Admin@123"; // will be hashed by pre-save
      await adminExists.save();
      console.log(
        "Admin user already existed; credentials have been reset to defaults",
      );
      process.exit(0);
    }

    // Create default admin
    const admin = new User({
      name: "Admin User",
      email: "admin@worksphere.com",
      password: "Admin@123",
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@worksphere.com");
    console.log("Password: Admin@123");
    console.log("Please change the password after first login");

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initializeDB();
