const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Home route
app.get("/", (req, res) => {
  res.send("Workshop Job Tracker API is running");
});

// Get all jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        job_name AS "jobName",
        material,
        quantity,
        due_date AS "dueDate",
        status
      FROM jobs
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not load jobs"
    });
  }
});

// Add a new job
app.post("/api/jobs", async (req, res) => {
  try {
    const {
      jobName,
      material,
      quantity,
      dueDate,
      status
    } = req.body;

    if (
      !jobName ||
      !material ||
      !quantity ||
      !dueDate ||
      !status
    ) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO jobs
        (job_name, material, quantity, due_date, status)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        job_name AS "jobName",
        material,
        quantity,
        due_date AS "dueDate",
        status
      `,
      [
        jobName,
        material,
        quantity,
        dueDate,
        status
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not create job"
    });
  }
});

// Edit a job
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      jobName,
      material,
      quantity,
      dueDate,
      status
    } = req.body;

    const result = await pool.query(
      `
      UPDATE jobs
      SET
        job_name = $1,
        material = $2,
        quantity = $3,
        due_date = $4,
        status = $5
      WHERE id = $6
      RETURNING
        id,
        job_name AS "jobName",
        material,
        quantity,
        due_date AS "dueDate",
        status
      `,
      [
        jobName,
        material,
        quantity,
        dueDate,
        status,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Job not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not update job"
    });
  }
});

// Delete a job
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM jobs WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Job not found"
      });
    }

    res.json({
      message: "Job deleted"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not delete job"
    });
  }
});

// Create database table automatically
async function startServer() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        job_name TEXT NOT NULL,
        material TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        due_date DATE NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    console.log("Database ready");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(
        "Server running on port " + PORT
      );
    });

  } catch (error) {
    console.error(
      "Database connection failed:",
      error
    );

    process.exit(1);
  }
}

startServer();
