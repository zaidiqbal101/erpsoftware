import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";

// Dummy POs and orders for linking shipments
const purchaseOrders = [
  { id: 1, vendor: "ABC Supplies" },
  { id: 2, vendor: "XYZ Traders" },
];

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [newShipment, setNewShipment] = useState({
    type: "incoming",
    poId: "",
    courier: "",
    tracking: "",
    expectedDate: "",
    status: "In Transit",
    notes: "",
    proofFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proofFile") setNewShipment({ ...newShipment, proofFile: files[0] });
    else setNewShipment({ ...newShipment, [name]: value });
  };

  const handleAddShipment = () => {
    if (!newShipment.poId || !newShipment.courier || !newShipment.tracking) {
      alert("Please fill required fields (PO, Courier, Tracking)");
      return;
    }
    setShipments([...shipments, { ...newShipment, id: Date.now() }]);
    setNewShipment({
      type: "incoming",
      poId: "",
      courier: "",
      tracking: "",
      expectedDate: "",
      status: "In Transit",
      notes: "",
      proofFile: null,
    });
  };

  const handleStatusChange = (id, status) => {
    setShipments(shipments.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  // Stats
  const totalShipments = shipments.length;
  const incoming = shipments.filter(s => s.type === "incoming").length;
  const outgoing = shipments.filter(s => s.type === "outgoing").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            🚚 Shipments
          </h1>
          <p className="text-blue-200 text-sm">
            Track incoming and outgoing shipments with POs/SOs and status updates
          </p>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Total Shipments</h2>
            <p className="text-2xl font-bold text-blue-600">{totalShipments}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Incoming</h2>
            <p className="text-2xl font-bold text-green-600">{incoming}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Outgoing</h2>
            <p className="text-2xl font-bold text-red-600">{outgoing}</p>
          </div>
        </div>

        {/* Add Shipment Form */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 max-w-4xl">
          <h3 className="font-semibold mb-4">Add New Shipment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select name="type" value={newShipment.type} onChange={handleChange} className="border p-2 rounded">
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>

            <select name="poId" value={newShipment.poId} onChange={handleChange} className="border p-2 rounded">
              <option value="">Link to PO/SO</option>
              {purchaseOrders.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.id} - {po.vendor}
                </option>
              ))}
            </select>

            <input type="text" name="courier" placeholder="Courier / Carrier" value={newShipment.courier} onChange={handleChange} className="border p-2 rounded"/>
            <input type="text" name="tracking" placeholder="Tracking Number" value={newShipment.tracking} onChange={handleChange} className="border p-2 rounded"/>
            <input type="date" name="expectedDate" value={newShipment.expectedDate} onChange={handleChange} className="border p-2 rounded"/>
            <input type="file" name="proofFile" onChange={handleChange} className="border p-2 rounded"/>
            <input type="text" name="notes" placeholder="Notes" value={newShipment.notes} onChange={handleChange} className="border p-2 rounded col-span-2"/>
          </div>

          <button onClick={handleAddShipment} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Shipment
          </button>
        </div>

        {/* Shipments Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">PO/SO</th>
                <th className="p-2 border">Courier</th>
                <th className="p-2 border">Tracking</th>
                <th className="p-2 border">Expected Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Proof</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => {
                const po = purchaseOrders.find((p) => p.id == s.poId);
                return (
                  <tr key={s.id} className="hover:bg-blue-50 transition">
                    <td className="border px-4 py-2">{s.id}</td>
                    <td className="border px-4 py-2">{s.type}</td>
                    <td className="border px-4 py-2">{po ? `${po.id} - ${po.vendor}` : "-"}</td>
                    <td className="border px-4 py-2">{s.courier}</td>
                    <td className="border px-4 py-2">{s.tracking}</td>
                    <td className="border px-4 py-2">{s.expectedDate}</td>
                    <td className="border px-4 py-2">{s.status}</td>
                    <td className="border px-4 py-2">{s.proofFile?.name || "-"}</td>
                    <td className="border px-4 py-2 flex gap-2 flex-wrap">
                      {["In Transit", "Delivered", "Delayed", "Returned"].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(s.id, status)}
                          className={`px-2 py-1 rounded text-white text-sm ${
                            s.status === status ? "bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </td>
                  </tr>
                );
              })}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
