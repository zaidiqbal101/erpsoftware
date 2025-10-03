import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { Plus, FileText } from "lucide-react";

const vendorsList = [
  { id: 1, name: "ABC Supplies" },
  { id: 2, name: "XYZ Traders" },
];

const inventoryList = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Monitor" },
  { id: 3, name: "Keyboard" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ vendorId: "", items: [], status: "Draft", notes: "" });

  const handleAddItem = () => {
    setNewOrder({ ...newOrder, items: [...newOrder.items, { itemId: "", quantity: 0, unitCost: 0 }] });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = value;
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...newOrder.items];
    updatedItems.splice(index, 1);
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleSubmit = () => {
    if (!newOrder.vendorId || newOrder.items.length === 0) {
      alert("Select vendor and add at least one item");
      return;
    }
    setOrders([...orders, { ...newOrder, id: Date.now() }]);
    setNewOrder({ vendorId: "", items: [], status: "Draft", notes: "" });
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  const calculateTotal = (items) => items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);

  // Summary cards
  const statuses = ["Draft", "Pending Approval", "Ordered", "Received", "Cancelled"];
  const summaryCounts = statuses.map(status => ({
    status,
    count: orders.filter(o => o.status === status).length
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            Purchase Orders Dashboard
          </h1>
          <p className="text-blue-200 text-sm">Manage vendors, create and track purchase orders</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Total POs</p>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
          {summaryCounts.map(s => (
            <div key={s.status} className={`bg-gradient-to-br ${s.status==='Draft'?'from-gray-400 to-gray-500':s.status==='Pending Approval'?'from-yellow-500 to-yellow-600':s.status==='Ordered'?'from-blue-500 to-blue-600':s.status==='Received'?'from-green-500 to-emerald-600':'from-red-500 to-red-600'} rounded-2xl p-6 text-white shadow-xl`}>
              <p className="text-sm font-medium mb-1">{s.status}</p>
              <p className="text-3xl font-bold">{s.count}</p>
            </div>
          ))}
        </div>

        {/* Create New PO */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Create New Purchase Order</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={newOrder.vendorId}
              onChange={(e) => setNewOrder({ ...newOrder, vendorId: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="">Select Vendor</option>
              {vendorsList.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <input
              type="text"
              placeholder="Notes"
              value={newOrder.notes}
              onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
              className="border p-2 rounded"
            />
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full border table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Item</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Unit Cost</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      <select
                        value={item.itemId}
                        onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
                        className="border p-1 rounded w-full"
                      >
                        <option value="">Select Item</option>
                        {inventoryList.map(inv => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <input type="number" min="0" value={item.quantity} onChange={(e)=>handleItemChange(index,"quantity",Number(e.target.value))} className="border p-1 rounded w-full"/>
                    </td>
                    <td className="border px-4 py-2">
                      <input type="number" min="0" value={item.unitCost} onChange={(e)=>handleItemChange(index,"unitCost",Number(e.target.value))} className="border p-1 rounded w-full"/>
                    </td>
                    <td className="border px-4 py-2">{item.quantity*item.unitCost}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button onClick={()=>handleRemoveItem(index)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remove</button>
                    </td>
                  </tr>
                ))}
                {newOrder.items.length===0 && (
                  <tr><td colSpan={5} className="text-center py-2 text-gray-500">No items added</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <button onClick={handleAddItem} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2">Add Item</button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2">Create PO</button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText size={24}/> Existing Orders</h3>
          <table className="w-full border-collapse min-w-[700px]">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-4 py-2 border">PO ID</th>
                <th className="px-4 py-2 border">Vendor</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border">Total Cost</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length===0 && (
                <tr><td colSpan={6} className="text-center py-4 text-gray-500">No purchase orders</td></tr>
              )}
              {orders.map(order => {
                const vendor = vendorsList.find(v=>v.id==order.vendorId)?.name;
                return (
                  <tr key={order.id}>
                    <td className="border px-4 py-2">{order.id}</td>
                    <td className="border px-4 py-2">{vendor}</td>
                    <td className="border px-4 py-2">{order.items.map(i=>inventoryList.find(inv=>inv.id==i.itemId)?.name+' (x'+i.quantity+') ').join(', ')}</td>
                    <td className="border px-4 py-2">{calculateTotal(order.items)}</td>
                    <td className="border px-4 py-2">{order.status}</td>
                    <td className="border px-4 py-2 flex gap-2 flex-wrap">
                      {statuses.map(status=>(
                        <button key={status} onClick={()=>handleStatusChange(order.id,status)}
                          className={`px-2 py-1 rounded text-white ${order.status===status?'bg-blue-600':'bg-gray-500 hover:bg-gray-600'} text-sm`}>
                          {status}
                        </button>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
