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

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
});

const Product = mongoose.model("Product", productSchema);

// POST endpoint to create a new product
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).send({ error: "Failed to create product" });
  }
});

// GET endpoint to retrieve all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve products" });
  }
});

app.listen(3000, () => console.log("Catalog service listening on port 3000"));
