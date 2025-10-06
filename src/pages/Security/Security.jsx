import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function Security() {
  const [whitelistedIPs, setWhitelistedIPs] = useState([
    "192.168.1.10",
    "10.0.0.5",
    "172.16.0.12",
  ]);

  const [requestedIPs, setRequestedIPs] = useState([
    { id: 1, ip: "203.0.113.25", status: "Pending" },
    { id: 2, ip: "198.51.100.42", status: "Pending" },
  ]);

  const [blockedIPs, setBlockedIPs] = useState(["203.0.113.100"]);
  const [newRequestIP, setNewRequestIP] = useState("");
  const [search, setSearch] = useState("");

  const handleRequestIP = () => {
    if (!newRequestIP) return;
    if (blockedIPs.includes(newRequestIP)) {
      alert("This IP is blocked and cannot be whitelisted.");
      setNewRequestIP("");
      return;
    }
    setRequestedIPs([
      ...requestedIPs,
      { id: Date.now(), ip: newRequestIP, status: "Pending" },
    ]);
    setNewRequestIP("");
  };

  const handleApprove = (id) => {
    const ipToApprove = requestedIPs.find((r) => r.id === id);
    if (!ipToApprove) return;
    if (blockedIPs.includes(ipToApprove.ip)) {
      alert("This IP is blocked and cannot be approved.");
      return;
    }
    setWhitelistedIPs([...whitelistedIPs, ipToApprove.ip]);
    setRequestedIPs(requestedIPs.filter((r) => r.id !== id));
  };

  const handleReject = (id) => {
    setRequestedIPs(requestedIPs.filter((r) => r.id !== id));
  };

  const handleBlock = (ip) => {
    if (blockedIPs.includes(ip)) return;
    setBlockedIPs([...blockedIPs, ip]);
    setWhitelistedIPs(whitelistedIPs.filter((wip) => wip !== ip));
    setRequestedIPs(requestedIPs.filter((req) => req.ip !== ip));
  };

  const handleUnblock = (ip) => {
    setBlockedIPs(blockedIPs.filter((bip) => bip !== ip));
  };

  const filteredIPs = whitelistedIPs.filter((ip) => ip.includes(search));
  const filteredRequests = requestedIPs.filter((r) => r.ip.includes(search));
  const filteredBlockedIPs = blockedIPs.filter((ip) => ip.includes(search));

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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Security & IP Management
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8 space-y-8">
          {/* Search & Request IP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border">
              <h2 className="text-2xl font-bold mb-4">Search IP</h2>
              <input
                type="text"
                placeholder="Search IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl border">
              <h2 className="text-2xl font-bold mb-4">Request IP Whitelist</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Enter IP Address"
                  value={newRequestIP}
                  onChange={(e) => setNewRequestIP(e.target.value)}
                  className="border p-3 rounded-xl flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleRequestIP}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-600 transition"
                >
                  Request
                </button>
              </div>
            </div>
          </div>

          {/* Whitelisted IPs */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-4">Whitelisted IPs</h2>
            {filteredIPs.length === 0 ? (
              <p className="text-gray-500">No IPs whitelisted.</p>
            ) : (
              <ul className="space-y-2">
                {filteredIPs.map((ip, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between p-3 rounded-xl bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                  >
                    <span>{ip}</span>
                    <button
                      onClick={() => handleBlock(ip)}
                      className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                    >
                      Block
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Requested IPs */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-4">Requested IPs</h2>
            {filteredRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              <ul className="space-y-2">
                {filteredRequests.map((req) => (
                  <li
                    key={req.id}
                    className="flex justify-between p-3 rounded-xl bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                  >
                    <div>
                      <span className="font-semibold">{req.ip}</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleBlock(req.ip)}
                        className="px-3 py-1 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
                      >
                        Block
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Blocked IPs */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-4">Blocked IPs</h2>
            {filteredBlockedIPs.length === 0 ? (
              <p className="text-gray-500">No IPs blocked.</p>
            ) : (
              <ul className="space-y-2">
                {filteredBlockedIPs.map((ip, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between p-3 rounded-xl bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                  >
                    <span>{ip}</span>
                    <button
                      onClick={() => handleUnblock(ip)}
                      className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
