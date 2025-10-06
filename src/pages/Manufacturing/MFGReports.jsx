import React from "react";

export default function MFGReports() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manufacturing Reports & Analytics</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded shadow">
          <h2 className="font-semibold mb-2">BOM Cost Summary</h2>
          <p>Total Products: 2</p>
          <p>Average Cost: $75</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Production Status</h2>
          <p>Pending: 1</p>
          <p>In Progress: 1</p>
          <p>Completed: 0</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="font-semibold mb-2">QC Summary</h2>
          <p>Pass: 0</p>
          <p>Fail: 0</p>
        </div>
      </div>
    </div>
  );
}
