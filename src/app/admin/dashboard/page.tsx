"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../layout";

// Mock data until backend is connected
const mockOrders = [
  {
    id: 1,
    userId: 1,
    totalAmount: 100,
    status: "DELIVERED",
    products: [
      { id: 1, name: "Product 1", quantity: 2 },
      { id: 2, name: "Product 2", quantity: 1 },
    ],
    createdAt: "2023-08-12",
  },
  {
    id: 2,
    userId: 2,
    totalAmount: 200,
    status: "DELIVERED",
    products: [{ id: 3, name: "Product 3", quantity: 1 }],
    createdAt: "2023-08-10",
  },
];

const DashboardPage = () => {
  const [deliveredOrders, setDeliveredOrders] = useState<
    {
      id: number;
      userId: number;
      totalAmount: number;
      status: string;
      products: { id: number; name: string; quantity: number }[];
      createdAt: string;
    }[]
  >([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Filter delivered orders and calculate total revenue
    const delivered = mockOrders.filter(
      (order) => order.status === "DELIVERED",
    );
    setDeliveredOrders(delivered);

    const revenue = delivered.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );
    setTotalRevenue(revenue);
  }, []);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {/* Metrics Overview */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Total Delivered Orders</h2>
          <p className="mt-2 text-3xl font-bold">{deliveredOrders.length}</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">
            Total Revenue from Delivered Orders
          </h2>
          <p className="mt-2 text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Delivered Orders */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Recent Delivered Orders</h2>

        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Product(s)</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {deliveredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">
                  {order.products.map((product) => (
                    <div key={product.id}>
                      {product.name} (x{product.quantity})
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">
                ₹{order.totalAmount.toFixed(2)}
                </td>
                <td className="border px-4 py-2">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
  );
};

export default DashboardPage;
