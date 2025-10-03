import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";

export default function Inventory() {
  const isManager = true;

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [inventory, setInventory] = useState([
    {
      id: 1,
      code: "SKU1001",
      name: "Paracetamol",
      category: "Medicine",
      quantity: 15,
      unit: "Box",
      location: "Rack A1",
      lot: "L-12345",
      mfg: "2025-01-10",
      exp: "2026-01-10",
      supplier: "ABC Pharma",
      history: [],
    },
    {
      id: 2,
      code: "SKU1002",
      name: "Glucose Powder",
      category: "Supplements",
      quantity: 3,
      unit: "Packet",
      location: "Rack B2",
      lot: "L-98765",
      mfg: "2024-07-05",
      exp: "2025-07-05",
      supplier: "XYZ Nutrition",
      history: [],
    },
  ]);

  const [adjustItem, setAdjustItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [reason, setReason] = useState("");

  // Helper: days until expiry
  const daysUntilExpiry = (expDate) => {
    const today = new Date();
    const exp = new Date(expDate);
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  };

  const handleAdjustment = () => {
    if (!adjustItem || !adjustQty || !reason) return;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === adjustItem.id) {
          const newQty = item.quantity + Number(adjustQty);
          return {
            ...item,
            quantity: newQty,
            history: [
              ...item.history,
              {
                date: new Date().toISOString().split("T")[0],
                change: Number(adjustQty),
                reason,
              },
            ],
          };
        }
        return item;
      })
    );

    setAdjustItem(null);
    setAdjustQty("");
    setReason("");
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(inventory.map((i) => i.category))];

  // Summary stats
  const totalItems = inventory.length;
  const lowStock = inventory.filter((i) => i.quantity < 5).length;
  const expiringSoon = inventory.filter((i) => daysUntilExpiry(i.exp) <= 30).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      {/* Main */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            📦 Inventory Dashboard
          </h1>
          <p className="text-blue-200 text-sm">Monitor stock levels, expiries, and adjustments</p>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Total Items</h2>
            <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Low Stock</h2>
            <p className="text-2xl font-bold text-red-600">{lowStock}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Expiring Soon</h2>
            <p className="text-2xl font-bold text-yellow-600">{expiringSoon}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[250px]"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="p-2 border">SKU</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Unit</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Lot</th>
                <th className="p-2 border">Mfg</th>
                <th className="p-2 border">Exp</th>
                <th className="p-2 border">Supplier</th>
                {isManager && <th className="p-2 border">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const daysExp = daysUntilExpiry(item.exp);
                let rowColor = "bg-white";
                if (item.quantity < 5) rowColor = "bg-red-50";
                else if (daysExp <= 30) rowColor = "bg-yellow-50";

                return (
                  <tr key={item.id} className={`${rowColor} hover:bg-blue-50 transition`}>
                    <td className="p-2 border">{item.code}</td>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.category}</td>
                    <td className="p-2 border font-bold">{item.quantity}</td>
                    <td className="p-2 border">{item.unit}</td>
                    <td className="p-2 border">{item.location}</td>
                    <td className="p-2 border">{item.lot}</td>
                    <td className="p-2 border">{item.mfg}</td>
                    <td className="p-2 border">{item.exp}</td>
                    <td className="p-2 border">{item.supplier}</td>
                    {isManager && (
                      <td className="p-2 border">
                        <button
                          onClick={() => setAdjustItem(item)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Adjust
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Stock Adjustment Modal */}
        {adjustItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
              <h3 className="text-lg font-bold mb-4">
                Adjust Stock: {adjustItem.name}
              </h3>
              <input
                type="number"
                placeholder="Enter adjustment (+/-)"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                className="border p-2 w-full rounded mb-3"
              />
              <input
                type="text"
                placeholder="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border p-2 w-full rounded mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAdjustItem(null)}
                  className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjustment}
                  className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
