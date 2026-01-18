const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// TEMP in‑memory notes (abhi DB nahi)
let notes = [];

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// get all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// save note
app.post("/notes", (req, res) => {
  const note = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content
  };
  notes.push(note);
  res.json(note);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server started on", PORT));
