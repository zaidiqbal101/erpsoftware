import React, { useState } from "react";
import { Trash2, PlusCircle } from "lucide-react";

// ERP Sections for dropdown
const sections = [
  "Dashboard & Analytics",
  "User & Role Management",
  "Financial Management",
  "Human Resource Management",
  "Inventory & Supply Chain",
  "Customer Relationship Management",
  "Project Management",
  "Manufacturing",
  "E-commerce & POS",
];

export default function HelpCenter() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    section: "",
    priority: "Medium",
    description: "",
  });

  const handleSubmit = () => {
    if (!newTicket.section || !newTicket.description) {
      alert("Please select a section and provide a description.");
      return;
    }

    setTickets([
      ...tickets,
      {
        id: Date.now(),
        section: newTicket.section,
        priority: newTicket.priority,
        description: newTicket.description,
        status: "Pending",
      },
    ]);

    setNewTicket({ section: "", priority: "Medium", description: "" });
  };

  const handleDelete = (id) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-200 text-red-800";
      case "Medium":
        return "bg-yellow-200 text-yellow-800";
      case "Low":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Help Center & Support
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8 space-y-8">
          {/* New Ticket Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-4">Submit a Ticket</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={newTicket.section}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, section: e.target.value })
                }
                className="p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select ERP Section</option>
                {sections.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={newTicket.priority}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, priority: e.target.value })
                }
                className="p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <textarea
              placeholder="Describe your issue..."
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
              className="mt-4 w-full p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-32"
            />

            <button
              onClick={handleSubmit}
              className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-600 transition"
            >
              <PlusCircle size={18} /> Submit Ticket
            </button>
          </div>

          {/* Tickets List */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-4">Submitted Tickets</h2>
            {tickets.length === 0 ? (
              <p className="text-gray-500">No tickets submitted yet.</p>
            ) : (
              <ul className="space-y-4">
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{ticket.section}</h3>
                      <p className="text-gray-700">{ticket.description}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        Priority: {ticket.priority}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-2 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
    