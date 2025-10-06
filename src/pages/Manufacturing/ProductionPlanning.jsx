import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, CalendarCheck, Download } from "lucide-react";

const ProductionPlanning = () => {
  const [orders, setOrders] = useState([
    { id: 1, product: "Product A", quantity: 100, startDate: "2025-10-10", endDate: "2025-10-15", status: "Planned" },
    { id: 2, product: "Product B", quantity: 50, startDate: "2025-10-12", endDate: "2025-10-18", status: "In Progress" },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newOrder, setNewOrder] = useState({ product: "", quantity: 0, startDate: "", endDate: "", status: "Planned" });

  const statuses = ["Planned", "In Progress", "Completed"];

  const handleAddOrUpdate = () => {
    if (!newOrder.product || newOrder.quantity <= 0) return;
    if (editingId !== null) {
      setOrders(orders.map(o => o.id === editingId ? { ...o, ...newOrder } : o));
      setEditingId(null);
    } else {
      setOrders([...orders, { id: Date.now(), ...newOrder }]);
    }
    setNewOrder({ product: "", quantity: 0, startDate: "", endDate: "", status: "Planned" });
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setNewOrder(order);
  };

  const handleDelete = (id) => setOrders(orders.filter(o => o.id !== id));

  const handleExportCSV = () => {
    const csv = [
      "Product,Quantity,Start Date,End Date,Status",
      ...orders.map(o => `${o.product},${o.quantity},${o.startDate},${o.endDate},${o.status}`)
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "production_orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Planned": return "bg-yellow-100 text-yellow-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Production Planning
              </h1>
              <p className="text-blue-200 text-sm">Manage production orders and schedules efficiently</p>
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
              <p className="text-blue-100 text-sm font-medium mb-1">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-green-100 text-sm font-medium mb-1">Planned Orders</p>
              <p className="text-3xl font-bold">{orders.filter(o => o.status === "Planned").length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-purple-100 text-sm font-medium mb-1">In Progress</p>
              <p className="text-3xl font-bold">{orders.filter(o => o.status === "In Progress").length}</p>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{editingId !== null ? 'Edit Order' : 'Add New Order'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <input type="text" placeholder="Product Name" value={newOrder.product} onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" placeholder="Qty" value={newOrder.quantity} onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input type="date" value={newOrder.startDate} onChange={(e) => setNewOrder({ ...newOrder, startDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input type="date" value={newOrder.endDate} onChange={(e) => setNewOrder({ ...newOrder, endDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={newOrder.status} onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {editingId !== null ? <Save size={18} /> : <Plus size={18} />} {editingId !== null ? 'Update' : 'Add'} Order
              </button>
              {editingId !== null && (
                <button onClick={() => { setEditingId(null); setNewOrder({ product: "", quantity: 0, startDate: "", endDate: "", status: "Planned" }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200">
                  <Trash2 size={18} /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <CalendarCheck size={24} /> Production Orders
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Product</th>
                    <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-left font-semibold">Start Date</th>
                    <th className="px-6 py-4 text-left font-semibold">End Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">{o.product}</td>
                      <td className="px-6 py-4">{o.quantity}</td>
                      <td className="px-6 py-4">{o.startDate}</td>
                      <td className="px-6 py-4">{o.endDate}</td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>{o.status}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(o)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200 shadow-md"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(o.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-md"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CalendarCheck size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No production orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionPlanning;
