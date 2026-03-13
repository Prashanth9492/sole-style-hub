import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

interface OverviewStats {
  products: {
    total: number;
    inStock: number;
    outOfStock: number;
    featured: number;
  };
  orders: {
    total: number;
    revenue: number;
    pending: number;
    delivered: number;
    cancelled: number;
  };
  customers: {
    total: number;
    active: number;
    blocked: number;
  };
}

interface RevenueData {
  today: { revenue: number; orders: number };
  thisMonth: { revenue: number; orders: number };
  lastMonth: { revenue: number; orders: number };
  growth: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const headers = { Authorization: `Bearer ${token}` };

      const [overviewRes, revenueRes, salesRes, categoryRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/admin/analytics/overview`, { headers }),
        fetch(`${API_URL}/admin/analytics/revenue`, { headers }),
        fetch(`${API_URL}/admin/analytics/sales-over-time?period=30days`, { headers }),
        fetch(`${API_URL}/admin/analytics/orders-by-category`, { headers }),
        fetch(`${API_URL}/admin/analytics/top-products?limit=5`, { headers })
      ]);

      const [overviewData, revenueData, salesData, categoryData, productsData] = await Promise.all([
        overviewRes.json(),
        revenueRes.json(),
        salesRes.json(),
        categoryRes.json(),
        productsRes.json()
      ]);

      setOverview(overviewData);
      setRevenue(revenueData);
      setSalesData(salesData);
      setCategoryData(categoryData);
      setTopProducts(productsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenue?.today.revenue.toFixed(2) || 0}</div>
            <p className="text-xs text-muted-foreground">{revenue?.today.orders || 0} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenue?.thisMonth.revenue.toFixed(2) || 0}</div>
            <p className="text-xs text-muted-foreground">
              {revenue?.growth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{overview?.orders.revenue.toFixed(2) || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.products.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.products.inStock || 0} in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.orders.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.orders.pending || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.customers.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.customers.active || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.products.outOfStock || 0}</div>
            <p className="text-xs text-muted-foreground">Products need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Over Time */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales Over Time (Last 30 Days)</CardTitle>
            <CardDescription>Daily revenue and order trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="_id.day" 
                  label={{ value: 'Day', position: 'insideBottom', offset: -5 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Category */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Orders by Category</CardTitle>
            <CardDescription>Revenue distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="revenue"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Best performing products by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue (₹)" />
              <Bar dataKey="totalQuantity" fill="#82ca9d" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
