import React, { useState } from "react";

function App() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("");

  const placeOrder = async () => {
    const response = await fetch("http://localhost:3002/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product, quantity, status }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div>
      <h1>ShopEase - Place an Order</h1>
      <input
        type="text"
        placeholder="Product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default App;
