import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();

  const graphData = await getSalesPerMonth();

  return (
    <div className="px-8 py-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
      <Separator className="bg-gray-300 my-6" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Total Revenue */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex justify-between items-center bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold">Total Revenue</CardTitle>
            <CircleDollarSign className="w-6 h-6" />
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-semibold text-gray-800">$ {totalRevenue}</p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex justify-between items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold">Total Orders</CardTitle>
            <ShoppingBag className="w-6 h-6" />
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-semibold text-gray-800">{totalOrders}</p>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex justify-between items-center bg-gradient-to-r from-purple-400 to-purple-600 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold">Total Customers</CardTitle>
            <UserRound className="w-6 h-6" />
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-semibold text-gray-800">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="mt-10 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 rounded-t-lg">
          <CardTitle className="text-lg font-bold">Sales Chart ($)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
