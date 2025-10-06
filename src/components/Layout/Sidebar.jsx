import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Users, Settings, BarChart3, Wallet, CreditCard, Send,
  Shield, HelpCircle, ChevronRight, LogOut, Truck,
  FileText, CalendarCheck, Package
} from "lucide-react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();

  // Full ERP Menu Sections
  const menuSections = [
    {
      title: "Dashboard & Analytics",
      items: [
        { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard" },
        { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
      ]
    },
    {
      title: "User & Role Management",
      items: [
        { id: "users", label: "Users", icon: Users, path: "/users" },
        { id: "roles", label: "Roles & Permissions", icon: Shield, path: "/roles" },
      ]
    },
    {
      title: "Financial Management",
      items: [
        { id: "ledger", label: "Ledger", icon: CreditCard, path: "/ledger" },
        { id: "budgeting", label: "Budgeting", icon: Wallet, path: "/budgeting" },
        { id: "taxes", label: "Tax & Reporting", icon: Send, path: "/taxes" },
      ]
    },
    {
      title: "Human Resource Management",
      items: [
        { id: "employees", label: "Employee Profiles", icon: Users, path: "/employees" },
        { id: "attendance", label: "Attendance", icon: CalendarCheck, path: "/attendance" },
        { id: "payroll", label: "Payroll", icon: Wallet, path: "/payroll" },
        { id: "recruitment", label: "Recruitment & Reviews", icon: FileText, path: "/recruitment" },
      ]
    },
    {
  title: "Inventory & Supply Chain",
  items: [
    { id: "inventory", label: "Stock & Batch", icon: Package, path: "/inventory" },
    { id: "add-item", label: "Add Item", icon: FileText, path: "/add-item" },
    { id: "vendors", label: "Vendors & Orders", icon: Truck, path: "/vendors" },
    { id: "orders", label: "Purchase Orders", icon: CreditCard, path: "/orders" },
    { id: "shipments", label: "Shipments", icon: Send, path: "/shipments" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
  ]
}
,
    {
      title: "Customer Relationship Management",
      items: [
        { id: "leads", label: "Leads & Opportunities", icon: Users, path: "/leads" },
        { id: "crm", label: "Customer History", icon: FileText, path: "/crm" },
        { id: "sales", label: "Sales Forecasting", icon: BarChart3, path: "/sales" },
      ]
    },
    {
      title: "Project Management",
      items: [
        { id: "tasks", label: "Tasks & Milestones", icon: CalendarCheck, path: "/tasks" },
        { id: "resources", label: "Resource Allocation", icon: Users, path: "/resources" },
        { id: "collaboration", label: "Collaboration Tools", icon: FileText, path: "/collaboration" },
      ]
    },
{
  title: "Manufacturing",
  items: [
    { id: "bom", label: "BOM Management", icon: FileText, path: "/manufacturing/bom" },
    { id: "production", label: "Production Planning", icon: CalendarCheck, path: "/manufacturing/production" },
    { id: "qc", label: "Quality Control", icon: Shield, path: "/manufacturing/qc" },
    // { id: "mfg-reports", label: "Reports & Analytics", icon: BarChart3, path: "/manufacturing/reports" },
  ]
},
{
  title: "E-commerce & POS",
  items: [
    { id: "online-integration", label: "Online Integration", icon: Send, path: "/ecommerce/online" },
    { id: "pos", label: "POS Module", icon: CreditCard, path: "/ecommerce/pos" },
  ]
}




  ];

  // Account / Bottom menu
  const bottomMenuItems = [
    { id: "security", label: "Security", icon: Shield, path: "/security" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    { id: "help", label: "Help Center", icon: HelpCircle, path: "/help-center" },
  ];

  
  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition 
           no-underline ${
             isActive || activeItem === item.id
               ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105"
               : "text-blue-200 hover:bg-white/10 hover:shadow-md hover:scale-101"
           }`
        }
        onClick={() => setActiveItem(item.id)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-md flex items-center justify-center ${
              activeItem === item.id ? "bg-white/20" : ""
            }`}
          >
            <Icon size={18} />
          </div>
          <span className="font-medium">{item.label}</span>
        </div>
        {(activeItem === item.id) && (
          <ChevronRight size={16} className="opacity-70" />
        )}
      </NavLink>
    );
  };

  // 🔒 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside
      className="w-72 flex flex-col fixed top-0 left-0 bottom-0 
                 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900
                 text-white shadow-2xl border-r border-blue-500/30
                 overflow-y-auto z-50"
    >
      {/* Brand header */}
      <div className="p-6 border-b border-blue-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center 
                       bg-gradient-to-r from-blue-500 to-purple-500 shadow-md"
          >
            <Wallet size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              ERP Solutions
            </h2>
            <p className="text-xs text-blue-300">Web Solutions</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1">
        {menuSections.map((section, idx) => (
          <div key={idx} className="px-2 py-6">
            <h3 className="text-[0.65rem] font-semibold text-blue-300 uppercase tracking-wide mb-3 pl-2">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        ))}

        {/* Bottom Section */}
        <div className="px-2 pt-6 border-t border-blue-500/30">
          <h3 className="text-[0.65rem] font-semibold text-blue-300 uppercase tracking-wide mb-3 pl-2">
            Account
          </h3>
          {bottomMenuItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}

          {/* 🚪 Logout */}
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 px-4 py-3 w-full text-left 
                       text-red-500 rounded-xl hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
