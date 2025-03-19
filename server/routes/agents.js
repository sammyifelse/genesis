import express from "express";
import Agent from "../models/Agent.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ Create an Agent (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { name, email, mobile, password } = req.body;
    let agent = await Agent.findOne({ email });
    if (agent) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    agent = new Agent({ name, email, mobile, password });
    await agent.save();

    res.status(201).json({ message: "Agent created successfully" });
  } catch (error) {
    console.error("Create Agent error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Agents (Admin Only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const agents = await Agent.find().select("-password");
    res.json(agents);
  } catch (error) {
    console.error("Get Agents error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get a Single Agent (Admin & The Agent)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select("-password");

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    if (req.user.role !== "admin" && req.user.userId !== agent._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json(agent);
  } catch (error) {
    console.error("Get Agent error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update Agent (Admin Only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ message: "Agent updated successfully", updatedAgent });
  } catch (error) {
    console.error("Update Agent error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Agent (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const deletedAgent = await Agent.findByIdAndDelete(req.params.id);
    if (!deletedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Delete Agent error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
