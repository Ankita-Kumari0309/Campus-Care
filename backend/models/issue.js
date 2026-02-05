import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  sensitive: { type: Boolean, default: false },        // Faculty should not see sensitive       // 🔹 add this
  anonymous: { type: Boolean, default: false },        // 🔹 add this
  createdAt: { type: Date, default: Date.now },
});

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
