const express = require("express");
const mongoose = require("mongoose");
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

// Define schema and model
const orderSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
  status: String,
});

const Order = mongoose.model("Order", orderSchema);

// POST endpoint to create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).send({ message: "Order created successfully", order });
  } catch (error) {
    res.status(400).send({ error: "Failed to create order" });
  }
});

// GET endpoint to retrieve all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve orders" });
  }
});

app.listen(3000, () => console.log("Orders service listening on port 3000"));
