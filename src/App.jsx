import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";

// Financial Pages
import Ledger from "./pages/Financial/Ledger";
import Budgeting from "./pages/Financial/Budgeting";
import Taxes from "./pages/Financial/Taxes";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";

// HRM Pages
import Employees from "./pages/hrm/Employees";
import Attendance from "./pages/hrm/Attendance";
import Payroll from "./pages/hrm/Payroll";
import Recruitment from "./pages/hrm/Recruitment";

//Secuirity
import Security from "./pages/Security/Security";

//Inventory
import Inventory from "./pages/Inventory/Inventory";
import AddItem from "./pages/Inventory/AddItem";
import Vendors from "./pages/Inventory/Vendors";
import Orders from "./pages/Inventory/Orders";
import Shipments from "./pages/Inventory/Shipments";
import Reports from "./pages/Inventory/Reports";

// Auth
import Login from "./pages/Auth/Login";
import PrivateRoute from "./components/Auth/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />

                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Financial */}
                    <Route path="/ledger" element={<Ledger />} />
                    <Route path="/budgeting" element={<Budgeting />} />
                    <Route path="/taxes" element={<Taxes />} />

                    {/* HRM */}
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/payroll" element={<Payroll />} />
                    <Route path="/recruitment" element={<Recruitment />} />
                    <Route path="/security" element={<Security />} />

                  {/*Inventory*/}
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/add-item" element={<AddItem />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/shipments" element={<Shipments />} />
                  <Route path="/reports" element={<Reports />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
