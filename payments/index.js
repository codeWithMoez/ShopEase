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

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
  orderId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  status: String,
  paymentMethod: String,
});

const Payment = mongoose.model("Payment", paymentSchema);

// POST endpoint to create a new payment
app.post("/api/payments", async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).send({ message: "Payment created successfully", payment });
  } catch (error) {
    res.status(400).send({ error: "Failed to create payment" });
  }
});

// GET endpoint to retrieve all payments
app.get("/api/payments", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).send(payments);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve payments" });
  }
});

app.listen(3000, () => console.log("Payments service listening on port 3000"));
