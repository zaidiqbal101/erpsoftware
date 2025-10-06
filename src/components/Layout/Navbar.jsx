import React from "react";
import { LogOut, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleHelp = () => {
    // You can open a modal, redirect, or call a support link
    window.open("https://support.yourcompany.com", "_blank");
  };

  return (
    <header className="flex justify-end items-center bg-white shadow-md p-4 sticky top-0 z-40">
      <button
        onClick={handleHelp}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <HelpCircle size={18} />
        <span>Help / Support</span>
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg ml-4 bg-red-500 text-white hover:bg-red-600 transition"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </header>
  );
}
