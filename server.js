const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("Mongo error:", err.message);
    process.exit(1);
  });

// ===== MODELS =====
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

const NoteSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String
});
const Note = mongoose.model("Note", NoteSchema);

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Missing fields" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "User exists" });

  const user = await User.create({ email, password });
  res.json({ msg: "Signup success", userId: user._id });
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ msg: "Invalid login" });

  res.json({ msg: "Login success", userId: user._id });
});

// get user notes
app.get("/notes/:userId", async (req, res) => {
  const notes = await Note.find({ userId: req.params.userId });
  res.json(notes);
});

// save note
app.post("/notes/:userId", async (req, res) => {
  const note = await Note.create({
    userId: req.params.userId,
    title: req.body.title || "",
    content: req.body.content || ""
  });
  res.json(note);
});

app.listen(PORT, () => {
  console.log("Server started on", PORT);
});
