import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, Download, Package } from "lucide-react";

const BOM = () => {
  const [bomList, setBOMList] = useState([
    {
      id: 1,
      name: "Product A",
      quantity: 100,
      costPerUnit: 50,
      components: [
        { id: 11, name: "Component X", quantity: 2, costPerUnit: 10 },
        { id: 12, name: "Component Y", quantity: 1, costPerUnit: 20 },
      ],
    },
    {
      id: 2,
      name: "Product B",
      quantity: 50,
      costPerUnit: 80,
      components: [
        { id: 21, name: "Component Z", quantity: 3, costPerUnit: 15 },
      ],
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newComponent, setNewComponent] = useState({ name: "", quantity: 1, costPerUnit: 0 });

  const calculateTotalCost = (product) =>
    product.components.reduce((sum, comp) => sum + comp.quantity * comp.costPerUnit, 0);

  const handleAddComponent = (productId) => {
    if (!newComponent.name) return;
    setBOMList((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, components: [...p.components, { ...newComponent, id: Date.now() }] }
          : p
      )
    );
    setNewComponent({ name: "", quantity: 1, costPerUnit: 0 });
  };

  const handleDeleteComponent = (productId, compId) => {
    setBOMList((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, components: p.components.filter((c) => c.id !== compId) }
          : p
      )
    );
  };

  const handleExportCSV = () => {
    const csv = [
      "Product,Component,Quantity,Cost per Unit,Total Cost",
      ...bomList.flatMap(p =>
        p.components.map(c => `${p.name},${c.name},${c.quantity},${c.costPerUnit},${c.quantity * c.costPerUnit}`)
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bom.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                BOM Management
              </h1>
              <p className="text-blue-200 text-sm">Manage Bill of Materials & Component Costs</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Download size={20} /> Export CSV
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-blue-100 text-sm font-medium mb-1">Total Products</p>
              <p className="text-3xl font-bold">{bomList.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-green-100 text-sm font-medium mb-1">Total Components</p>
              <p className="text-3xl font-bold">{bomList.reduce((sum, p) => sum + p.components.length, 0)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-purple-100 text-sm font-medium mb-1">Total Cost</p>
              <p className="text-3xl font-bold">${bomList.reduce((sum, p) => sum + calculateTotalCost(p), 0)}</p>
            </div>
          </div>

          {/* BOM Tables */}
          {bomList.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-xl mb-8 border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-gray-700 font-semibold">Total Cost: ${calculateTotalCost(product)}</p>
              </div>
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Component</th>
                    <th className="border p-2 text-right">Quantity</th>
                    <th className="border p-2 text-right">Cost/Unit</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {product.components.map((c) => (
                    <tr key={c.id}>
                      <td className="border p-2">{c.name}</td>
                      <td className="border p-2 text-right">{c.quantity}</td>
                      <td className="border p-2 text-right">{c.costPerUnit}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleDeleteComponent(product.id, c.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add Component */}
              <div className="flex gap-2 items-center mt-2">
                <input
                  type="text"
                  placeholder="Component Name"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  className="px-3 py-2 border rounded-xl w-1/3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={newComponent.quantity}
                  onChange={(e) => setNewComponent({ ...newComponent, quantity: Number(e.target.value) })}
                  className="px-3 py-2 border rounded-xl w-1/6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Cost/Unit"
                  value={newComponent.costPerUnit}
                  onChange={(e) => setNewComponent({ ...newComponent, costPerUnit: Number(e.target.value) })}
                  className="px-3 py-2 border rounded-xl w-1/6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleAddComponent(product.id)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BOM;
