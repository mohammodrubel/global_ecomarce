"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Star,
  Target,
  Rocket,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "increase",
      icon: DollarSign,
      gradient: "from-green-400 to-blue-500",
      bgColor: "bg-gradient-to-r from-green-400 to-blue-500",
      iconColor: "text-white",
    },
    {
      title: "Total Orders",
      value: "2,350",
      change: "+15.3%",
      changeType: "increase",
      icon: ShoppingCart,
      gradient: "from-purple-400 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-400 to-pink-500",
      iconColor: "text-white",
    },
    {
      title: "Total Customers",
      value: "1,234",
      change: "+8.2%",
      changeType: "increase",
      icon: Users,
      gradient: "from-orange-400 to-red-500",
      bgColor: "bg-gradient-to-r from-orange-400 to-red-500",
      iconColor: "text-white",
    },
    {
      title: "Total Products",
      value: "567",
      change: "-2.1%",
      changeType: "decrease",
      icon: Package,
      gradient: "from-indigo-400 to-purple-500",
      bgColor: "bg-gradient-to-r from-indigo-400 to-purple-500",
      iconColor: "text-white",
    },
  ];

  const salesData = [
    { name: "Jan", sales: 4000, orders: 240, revenue: 4200 },
    { name: "Feb", sales: 3000, orders: 198, revenue: 3200 },
    { name: "Mar", sales: 5000, orders: 300, revenue: 5200 },
    { name: "Apr", sales: 4500, orders: 278, revenue: 4700 },
    { name: "May", sales: 6000, orders: 389, revenue: 6200 },
    { name: "Jun", sales: 5500, orders: 349, revenue: 5700 },
  ];

  const categoryData = [
    { name: "Electronics", value: 400, color: "#FF6B6B", fill: "fill-red-400" },
    { name: "Fashion", value: 300, color: "#4ECDC4", fill: "fill-teal-400" },
    { name: "Home", value: 200, color: "#FFD166", fill: "fill-yellow-400" },
    { name: "Sports", value: 100, color: "#06D6A0", fill: "fill-green-400" },
    { name: "Books", value: 150, color: "#118AB2", fill: "fill-blue-400" },
    { name: "Beauty", value: 120, color: "#9B5DE5", fill: "fill-purple-400" },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      amount: "$299.99",
      status: "Completed",
      date: "2024-03-15",
      statusColor: "bg-gradient-to-r from-green-400 to-teal-500",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      amount: "$149.99",
      status: "Processing",
      date: "2024-03-15",
      statusColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      amount: "$89.99",
      status: "Shipped",
      date: "2024-03-14",
      statusColor: "bg-gradient-to-r from-blue-400 to-cyan-500",
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      amount: "$199.99",
      status: "Pending",
      date: "2024-03-14",
      statusColor: "bg-gradient-to-r from-gray-400 to-slate-500",
    },
  ];

  const topProducts = [
    {
      name: "Wireless Headphones",
      sales: 234,
      revenue: "$23,400",
      growth: "+25%",
      color: "bg-gradient-to-r from-purple-400 to-pink-400",
    },
    {
      name: "Smart Watch",
      sales: 189,
      revenue: "$18,900",
      growth: "+18%",
      color: "bg-gradient-to-r from-blue-400 to-cyan-400",
    },
    {
      name: "Laptop Backpack",
      sales: 156,
      revenue: "$7,800",
      growth: "+12%",
      color: "bg-gradient-to-r from-green-400 to-teal-400",
    },
    {
      name: "Bluetooth Speaker",
      sales: 134,
      revenue: "$10,720",
      growth: "+8%",
      color: "bg-gradient-to-r from-orange-400 to-red-400",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200";
      case "Processing":
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200";
      case "Shipped":
        return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200";
      case "Pending":
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Welcome back! Here's what's happening with your store. 🎉
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-0 shadow-xl"
            >
              <div className={`absolute inset-0 ${stat.bgColor} opacity-10`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor} shadow-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </div>
                <div className="flex items-center text-xs mt-2">
                  {stat.changeType === "increase" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      stat.changeType === "increase"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1 text-gray-500">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart */}
        <Card className="col-span-4 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-10 w-5 mr-2" />
              Sales Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "10px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="url(#salesGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="url(#ordersGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient
                    id="ordersGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="col-span-3 border-0 shadow-xl bg-gradient-to-br from-white to-pink-50">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Target className="h-10 w-5 mr-2" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={({ name, percent }) =>
                  //   // `${name} ${(percent * 100).toFixed(0)}%`
                  // }
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-4 border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Zap className="h-10 w-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        order.statusColor.split(" ")[0]
                      } ${order.statusColor.split(" ")[1]}`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {order.id}
                      </p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      className={`${getStatusColor(order.status)} font-medium`}
                    >
                      {order.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">
                        {order.amount}
                      </p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-3 border-0 shadow-xl bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Star className="h-10 w-5 mr-2" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${product.color} text-white font-bold shadow-lg`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {product.sales} sales •{" "}
                        <span className="text-green-600 font-semibold">
                          {product.growth}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">
                      {product.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <Rocket className="h-10 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white border-0 shadow-lg transition-all duration-300">
              <Package className="h-6 w-6 mb-2" />
              Add Product
            </Button>
            <Button className="h-20 flex-col bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white border-0 shadow-lg transition-all duration-300">
              <ShoppingCart className="h-6 w-6 mb-2" />
              View Orders
            </Button>
            <Button className="h-20 flex-col bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white border-0 shadow-lg transition-all duration-300">
              <Users className="h-6 w-6 mb-2" />
              Manage Customers
            </Button>
            <Button className="h-20 flex-col bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white border-0 shadow-lg transition-all duration-300">
              <TrendingUp className="h-10 w-6 mb-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
