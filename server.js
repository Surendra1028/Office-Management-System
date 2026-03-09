require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/leaves", require("./routes/leaves"));
app.use("/api/salaries", require("./routes/salaries"));
app.use("/api/schedules", require("./routes/schedules"));

app.get(
  ["/", "/login", "/signup", "/employee-dashboard", "/admin-dashboard"],
  (req, res) => {
    const page = req.path === "/" ? "index.html" : req.path.slice(1) + ".html";
    res.sendFile(path.join(__dirname, "public", page));
  },
);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Handle port already in use error
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${PORT} is already in use. Attempting to use port ${PORT + 1}...`,
    );
    server.listen(PORT + 1, () => {
      console.log(`✅ Server running at http://localhost:${PORT + 1}`);
    });
  } else {
    throw error;
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
