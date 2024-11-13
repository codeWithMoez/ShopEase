const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// POST endpoint to register a new user
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).send({ error: "Failed to register user" });
  }
});

// POST endpoint to log in a user
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret");
    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send({ error: "Failed to log in user" });
  }
});

app.listen(3000, () => console.log("User Auth service listening on port 3000"));
