const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Workshop Job Tracker API is running");
});

app.get("/api/jobs", (req, res) => {
  res.json([
    {
      id: 1,
      jobName: "Test Job",
      material: "Mild Steel",
      quantity: 2,
      status: "In Progress"
    }
  ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
