import React, { useState } from "react";
import { Trash2, Download } from "lucide-react";

// Feature toggles
const features = {
  salesTransactions: true,
  inventoryUpdates: true,
  multiUser: false,
  exportCSV: true,
};

const POS = () => {
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState({
    1: 10,
    2: 5,
    3: 8,
  });

  const [products] = useState([
    { id: 1, name: "T-Shirt", price: 25 },
    { id: 2, name: "Jeans", price: 40 },
    { id: 3, name: "Jacket", price: 70 },
  ]);

  const addToCart = (product) => {
    if (features.inventoryUpdates && inventory[product.id] <= 0) {
      alert("Out of stock!");
      return;
    }
    setCart((prev) => [...prev, product]);
    if (features.inventoryUpdates) {
      setInventory((prev) => ({ ...prev, [product.id]: prev[product.id] - 1 }));
    }
  };

  const removeFromCart = (index) => {
    const product = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));
    if (features.inventoryUpdates) {
      setInventory((prev) => ({ ...prev, [product.id]: prev[product.id] + 1 }));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleExportCSV = () => {
    if (!features.exportCSV) return;
    const csv = ["Product,Price", ...cart.map((c) => `${c.name},${c.price}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pos_cart.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              POS Module
            </h1>
            {features.exportCSV && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Download size={20} /> Export Cart
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8 space-y-8">
          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="p-6 border rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer transition bg-white"
              >
                <h2 className="text-xl font-bold mb-2">{p.name}</h2>
                <p className="text-gray-700">Price: ${p.price}</p>
                {features.inventoryUpdates && (
                  <p className="text-sm text-gray-400 mt-1">Stock: {inventory[p.id]}</p>
                )}
                <p className="text-sm text-gray-400 mt-1">Click to add to cart</p>
              </div>
            ))}
          </div>

          {/* Cart */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-4">Cart</h2>
            {cart.length === 0 ? (
              <p>Cart is empty.</p>
            ) : (
              <ul className="space-y-2">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>{item.name} - ${item.price}</span>
                    <button
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      onClick={() => removeFromCart(idx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="font-bold mt-4 text-right">Total: ${total}</p>
            {features.salesTransactions && (
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  alert(`Payment Successful! Total: $${total}`);
                  setCart([]);
                }}
                className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition"
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
