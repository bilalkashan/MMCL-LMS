const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./Models/db");

const AuthRouter = require("./Routes/AuthRouter");

const app = express();
const PORT = process.env.PORT || 8080;

// Built-in middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/auth", AuthRouter);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", success: false });
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
