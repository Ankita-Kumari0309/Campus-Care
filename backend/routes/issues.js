import express from "express";
import Issue from "../models/issue.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// 1️⃣ Create new issue (student)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, sensitive, anonymous } = req.body;

    const newIssue = new Issue({
      student: req.user._id,
      title,
      description,
      status: "Pending",
      sensitive: sensitive || false,
      anonymous: anonymous || false,
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(500).json({ message: err.message });
  }
});

// 2️⃣ Get all issues (Admin/Faculty)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    if (!["Admin", "Faculty"].includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });

    let issues;
    if (req.user.role === "Faculty") {
      // Faculty sees only issues that are NOT sensitive
      issues = await Issue.find({ sensitive: false })
        .populate("student", "name email role");
    } else {
      // Admin sees all issues
      issues = await Issue.find()
        .populate("student", "name email role");
    }

    res.json(issues);
  } catch (err) {
    console.error("Error fetching all issues:", err);
    res.status(500).json({ message: err.message });
  }
});

// 3️⃣ Update issue status (Admin/Faculty)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "In Progress", "Resolved"].includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    // Faculty cannot update sensitive issues
    if (req.user.role === "Faculty" && issue.sensitive) {
      return res.status(403).json({ message: "Faculty cannot update sensitive issues" });
    }

    issue.status = status;
    await issue.save();

    res.json(issue);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: err.message });
  }
});

// 4️⃣ Get issues for logged-in student
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find({ student: req.user._id });
    res.json(issues);
  } catch (err) {
    console.error("Error fetching user issues:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
