require("dotenv").config({ quiet: true });

const express = require("express");
const { connectDB } = require("./config/db");
const {
  createFeedback,
  getFeedback,
} = require("./controllers/feedbackController");

const app = express();
const port = process.env.PORT || 4334;

app.use(express.json());

app.get("/feedback", getFeedback);
app.post("/feedback", createFeedback);

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
