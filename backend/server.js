const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'VAULTIFY';

client.connect();

// ✅ Register user
app.post("/register", async (req, res) => {
  const db = client.db(dbName);
  const users = db.collection("users");
  const { username, password } = req.body;

  const exists = await users.findOne({ username });
  if (exists) {
    return res.status(400).json({ success: false, message: "Username already exists" });
  }

  await users.insertOne({ username, password, vault: [] });
  res.status(201).json({ success: true, message: "Registered successfully" });
});

// ✅ Login user
app.post("/login", async (req, res) => {
  const db = client.db(dbName);
  const users = db.collection("users");
  const { username, password } = req.body;

  const user = await users.findOne({ username, password });
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  res.status(200).json({ success: true, message: "Login successful" });
});

app.get("/", (req, res) => {
  res.send("Vaultify backend is working!");
});
// ✅ Add a password to user's vault
// Add password to existing user
app.post("/addpass", async (req, res) => {
  const db = client.db(dbName);
  const users = db.collection("users");
  const { owner, site, username, password } = req.body;

  if (!owner || !site || !username || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const result = await users.updateOne(
    { username: owner },
    { $push: { vault: { site, username, password } } }
  );

  if (result.modifiedCount === 1) {
    res.json({ success: true, message: "Password added" });
  } else {
    res.status(400).json({ success: false, message: "User not found or update failed" });
  }
});

// ✅ Get all passwords for a user
app.get("/passwords/:username", async (req, res) => {
  const db = client.db(dbName);
  const users = db.collection("users");
  const username = req.params.username;

  const user = await users.findOne({ username });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, passwords: user.vault || [] });
});

// ✅ Delete a password from user's vault
app.delete("/passwords", async (req, res) => {
  const { site, username, password, owner } = req.body;

  if (!site || !username || !password || !owner) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const db = client.db(dbName);
  const users = db.collection("users");

  const result = await users.updateOne(
    { username: owner },
    { $pull: { vault: { site, username, password } } }
  );

  res.json({ success: true, message: "Deleted", result });
});

// ✅ Update a password in user's vault
app.put("/passwords", async (req, res) => {
  const { owner, old, new: updated } = req.body;

  if (!owner || !old || !updated) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const db = client.db(dbName);
  const users = db.collection("users");

  const result = await users.updateOne(
    {
      username: owner,
      "vault.site": old.site,
      "vault.username": old.username,
      "vault.password": old.password
    },
    {
      $set: {
        "vault.$.site": updated.site,
        "vault.$.username": updated.username,
        "vault.$.password": updated.password
      }
    }
  );

  if (result.modifiedCount === 1) {
    res.json({ success: true, message: "Password updated" });
  } else {
    res.json({ success: false, message: "Nothing updated" });
  }
});

app.listen(port, () => {
  console.log(`Vaultify backend running on http://localhost:${port}`);
});