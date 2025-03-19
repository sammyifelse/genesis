import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import { Readable } from "stream";
import Task from "../models/Task.js";
import Agent from "../models/Agent.js";

const router = express.Router();

// ✅ Configure Multer Storage
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Upload & Process CSV File Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const csvData = req.file.buffer.toString("utf-8");
    console.log("CSV Data Received:", csvData);

    // Convert CSV string to a readable stream
    const readableStream = Readable.from(csvData);

    const tasks = [];

    // ✅ Parse CSV data dynamically (ignores extra spaces in headers)
    readableStream
      .pipe(csvParser({ trim: true, skipEmptyLines: true }))
      .on("data", (row) => {
        if (!row.firstName || !row.phone || !row.notes) {
          console.warn("⚠️ Skipping invalid row:", row);
          return;
        }
        tasks.push(row);
      })
      .on("end", async () => {
        try {
          if (tasks.length === 0) {
            return res.status(400).json({ message: "No valid tasks found in CSV" });
          }

          // ✅ Assign tasks to agents
          const availableAgents = await Agent.find();
          if (availableAgents.length === 0) {
            return res.status(500).json({ message: "No available agents to assign tasks" });
          }

          let assignedTasks = tasks.map((task, index) => {
            const agent = availableAgents[index % availableAgents.length]; // Assign in round-robin
            return new Task({ ...task, assignedTo: agent._id });
          });

          // ✅ Save tasks in database
          await Task.insertMany(assignedTasks);

          res.status(201).json({ message: "Tasks uploaded successfully", tasks: assignedTasks });
        } catch (error) {
          console.error("Processing error:", error);
          res.status(500).json({ message: "Error processing CSV" });
        }
      });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
