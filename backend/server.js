const express = require("express");
const bodyParser = require("body-parser");
const corsMiddleware = require("./middlewares/cors");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const connectToDatabase = require("./db/mongoose");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const doctorController = require("./controllers/doctorController");
const nurseController = require("./controllers/nurseController");
const appointmentController = require("./controllers/appointmentController");
const adminController = require("./controllers/adminController");
const limiter = require("./middlewares/rateLimiter");

require("dotenv").config(); // Corrected order and usage

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);

// Routes
app.use("/auth", authController);
app.use("/user", userController);
app.use("/doctor", doctorController);
app.use("/nurse", nurseController);
app.use("/appointment", appointmentController);
app.use("/admin", adminController);

// Error Handling Middleware
app.use(errorHandlerMiddleware);

// Start Server
(async () => {
  try {
    await connectToDatabase();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
  }
})();
