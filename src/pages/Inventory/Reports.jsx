import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { FileText, PieChart as PieIcon, BarChart as BarIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const inventoryData = [
  { item: "Item A", quantity: 120, valuation: 3000 },
  { item: "Item B", quantity: 50, valuation: 1500 },
  { item: "Item C", quantity: 200, valuation: 8000 },
  { item: "Item D", quantity: 10, valuation: 500 },
];

const salesVsPurchase = [
  { month: "Jan", sales: 5000, purchases: 7000 },
  { month: "Feb", sales: 6000, purchases: 5000 },
  { month: "Mar", sales: 8000, purchases: 9000 },
];

const vendorSpending = [
  { vendor: "ABC Supplies", amount: 12000 },
  { vendor: "XYZ Traders", amount: 8000 },
  { vendor: "LMN Corp", amount: 5000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("inventory");

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let dataToExport = [];
    if (selectedReport === "inventory") dataToExport = inventoryData;
    else if (selectedReport === "sales") dataToExport = salesVsPurchase;
    else if (selectedReport === "vendor") dataToExport = vendorSpending;

    if (dataToExport.length === 0) return;

    const headers = Object.keys(dataToExport[0]).join(",");
    csvContent += headers + "\r\n";
    dataToExport.forEach((row) => {
      csvContent += Object.values(row).join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summary metrics
  const totalInventory = inventoryData.length;
  const totalSales = salesVsPurchase.reduce((sum, d) => sum + d.sales, 0);
  const totalVendors = vendorSpending.length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-blue-200 text-sm">
            View inventory, sales vs purchases, and vendor spending reports
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Total Inventory Items</p>
            <p className="text-3xl font-bold">{totalInventory}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Total Sales</p>
            <p className="text-3xl font-bold">${totalSales}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Total Vendors</p>
            <p className="text-3xl font-bold">{totalVendors}</p>
          </div>
        </div>

        {/* Report Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedReport("inventory")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              selectedReport === "inventory" ? "bg-blue-500 text-white" : "bg-white border"
            }`}
          >
            <BarIcon size={18} /> Inventory
          </button>
          <button
            onClick={() => setSelectedReport("sales")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              selectedReport === "sales" ? "bg-blue-500 text-white" : "bg-white border"
            }`}
          >
            <BarIcon size={18} /> Sales vs Purchases
          </button>
          <button
            onClick={() => setSelectedReport("vendor")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              selectedReport === "vendor" ? "bg-blue-500 text-white" : "bg-white border"
            }`}
          >
            <PieIcon size={18} /> Vendor Spending
          </button>
        </div>

        {/* Export Button */}
        <div className="mb-6">
          <button
            onClick={handleExportCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export CSV
          </button>
        </div>

        {/* Report Display */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          {selectedReport === "inventory" && (
            <>
              <h3 className="font-semibold mb-4">Inventory Stock & Valuation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="item" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#8884d8" name="Quantity" />
                  <Bar dataKey="valuation" fill="#82ca9d" name="Valuation" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {selectedReport === "sales" && (
            <>
              <h3 className="font-semibold mb-4">Sales vs Purchases</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesVsPurchase} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                  <Bar dataKey="purchases" fill="#82ca9d" name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {selectedReport === "vendor" && (
            <>
              <h3 className="font-semibold mb-4">Vendor Spending</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vendorSpending}
                    dataKey="amount"
                    nameKey="vendor"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {vendorSpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
