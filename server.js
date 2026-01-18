const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Mongo error:", err.message));

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Note = mongoose.model("Note", NoteSchema);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  const note = await Note.create({
    title: req.body.title,
    content: req.body.content
  });
  res.json(note);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server started on", PORT));
