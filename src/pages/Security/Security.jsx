import React, { useState } from "react";

export default function Security() {
  const [whitelistedIPs, setWhitelistedIPs] = useState([
    "192.168.1.10",
    "10.0.0.5",
    "172.16.0.12"
  ]);

  const [requestedIPs, setRequestedIPs] = useState([
    { id: 1, ip: "203.0.113.25", status: "Pending" },
    { id: 2, ip: "198.51.100.42", status: "Pending" },
  ]);

  const [newRequestIP, setNewRequestIP] = useState("");
  const [search, setSearch] = useState("");

  const handleRequestIP = () => {
    if (!newRequestIP) return;
    setRequestedIPs([...requestedIPs, { id: Date.now(), ip: newRequestIP, status: "Pending" }]);
    setNewRequestIP("");
  };

  const handleApprove = (id) => {
    const ipToApprove = requestedIPs.find(r => r.id === id);
    if (ipToApprove) {
      setWhitelistedIPs([...whitelistedIPs, ipToApprove.ip]);
      setRequestedIPs(requestedIPs.filter(r => r.id !== id));
    }
  };

  const handleReject = (id) => {
    setRequestedIPs(requestedIPs.filter(r => r.id !== id));
  };

  const filteredIPs = whitelistedIPs.filter(ip => ip.includes(search));
  const filteredRequests = requestedIPs.filter(r => r.ip.includes(search));

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Approved":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="ml-72 min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Security & IP Whitelisting</h1>

      {/* Search & Request Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search IP</h2>
          <input
            type="text"
            placeholder="Search IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Request IP Whitelist</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter IP Address"
              value={newRequestIP}
              onChange={(e) => setNewRequestIP(e.target.value)}
              className="border p-3 rounded flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleRequestIP}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
            >
              Request
            </button>
          </div>
        </div>
      </div>

      {/* Whitelisted IPs Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Whitelisted IPs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-2">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredIPs.length === 0 ? (
                <tr>
                  <td className="px-4 py-3 text-center text-gray-500">No IPs whitelisted</td>
                </tr>
              ) : (
                filteredIPs.map((ip, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-3">{ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requested IPs Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Requested IPs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-2">IP Address</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-center text-gray-500">No pending requests</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{req.ip}</td>
                    <td className={`px-4 py-3 font-semibold ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Login Attempts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recent Login Attempts</h2>
        <ul className="space-y-2">
          <li className="flex justify-between p-3 rounded bg-gray-50 shadow-sm hover:bg-gray-100 transition">
            <span>192.168.1.10</span>
            <span className="text-green-600 font-semibold">Successful</span>
          </li>
          <li className="flex justify-between p-3 rounded bg-gray-50 shadow-sm hover:bg-gray-100 transition">
            <span>203.0.113.50</span>
            <span className="text-red-600 font-semibold">Failed</span>
          </li>
          <li className="flex justify-between p-3 rounded bg-gray-50 shadow-sm hover:bg-gray-100 transition">
            <span>198.51.100.42</span>
            <span className="text-green-600 font-semibold">Successful</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
