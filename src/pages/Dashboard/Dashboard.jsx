import React from "react";
import { 
  TrendingUp, DollarSign, Users, Clock, Eye, ArrowUpRight, ArrowDownRight,
  Package, ShoppingCart, UserCheck, AlertCircle, Activity, BarChart3
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

export default function Dashboard() {
  // ERP-focused stats
  const stats = [
    { 
      title: "Total Revenue", 
      value: "$245,680", 
      change: "+12.5%", 
      trend: "up",
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Active Orders", 
      value: "1,247", 
      change: "+8.2%", 
      trend: "up",
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    { 
      title: "Inventory Items", 
      value: "8,543", 
      change: "-2.4%", 
      trend: "down",
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      title: "Active Employees", 
      value: "156", 
      change: "+5.1%", 
      trend: "up",
      icon: UserCheck,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
  ];

  // Sales data
  const salesData = [
    { month: "Jan", sales: 45000, target: 40000 },
    { month: "Feb", sales: 52000, target: 45000 },
    { month: "Mar", sales: 48000, target: 50000 },
    { month: "Apr", sales: 61000, target: 55000 },
    { month: "May", sales: 55000, target: 58000 },
    { month: "Jun", sales: 67000, target: 60000 },
  ];

  // Revenue breakdown
  const revenueData = [
    { name: "Product Sales", value: 45, amount: "$110,556" },
    { name: "Services", value: 30, amount: "$73,704" },
    { name: "Subscriptions", value: 25, amount: "$61,420" },
  ];
  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6"];

  // Inventory status
  const inventoryData = [
    { category: "Electronics", stock: 2340, status: "In Stock", alert: false },
    { category: "Furniture", stock: 1567, status: "In Stock", alert: false },
    { category: "Office Supplies", stock: 456, status: "Low Stock", alert: true },
    { category: "Raw Materials", stock: 89, status: "Critical", alert: true },
    { category: "Packaging", stock: 3421, status: "In Stock", alert: false },
  ];

  // Recent activities
  const recentActivities = [
    { action: "New purchase order #PO-2847 created", time: "5 mins ago", type: "order" },
    { action: "Invoice #INV-1923 paid by Client Corp", time: "23 mins ago", type: "payment" },
    { action: "Stock level alert: Office Supplies", time: "1 hour ago", type: "alert" },
    { action: "Employee John Doe clocked in", time: "2 hours ago", type: "hr" },
    { action: "New vendor 'ABC Supplies' added", time: "3 hours ago", type: "vendor" },
  ];

  // Performance metrics
  const performanceData = [
    { day: "Mon", efficiency: 85 },
    { day: "Tue", efficiency: 88 },
    { day: "Wed", efficiency: 82 },
    { day: "Thu", efficiency: 90 },
    { day: "Fri", efficiency: 87 },
    { day: "Sat", efficiency: 78 },
    { day: "Sun", efficiency: 72 },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 ml-72">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-blue-200 text-sm">Welcome back, Admin! Here's what's happening today.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-200">Current Period</p>
                <p className="text-xl font-semibold">October 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Quick Alert Banner */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 rounded-xl p-4 mb-8 shadow-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-orange-500" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">Attention Required</h3>
                <p className="text-sm text-gray-700">3 items are running low on stock. Review inventory management.</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      <TrendIcon size={14} />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Sales Performance */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 size={24} className="text-blue-600" />
                    Sales Performance
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Monthly sales vs targets</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Revenue Breakdown</h3>
              <p className="text-sm text-gray-500 mb-4">Distribution by category</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {revenueData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inventory Status */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={24} className="text-purple-600" />
                Inventory Status
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.category}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{item.stock}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "In Stock" ? "bg-green-100 text-green-700" :
                            item.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={24} className="text-green-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === "order" ? "bg-blue-100" :
                      activity.type === "payment" ? "bg-green-100" :
                      activity.type === "alert" ? "bg-red-100" :
                      activity.type === "hr" ? "bg-purple-100" :
                      "bg-orange-100"
                    }`}>
                      {activity.type === "order" && <ShoppingCart size={16} className="text-blue-600" />}
                      {activity.type === "payment" && <DollarSign size={16} className="text-green-600" />}
                      {activity.type === "alert" && <AlertCircle size={16} className="text-red-600" />}
                      {activity.type === "hr" && <Users size={16} className="text-purple-600" />}
                      {activity.type === "vendor" && <Package size={16} className="text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Efficiency */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-600" />
              Operational Efficiency
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}