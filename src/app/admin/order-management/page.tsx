"use client";

import { api } from "~/trpc/react";
import AdminLayout from "../layout";
import { useState, useEffect } from "react";

type OrderStatus = "UNDER_REVIEW" | "PAYMENT_PENDING" | "OUT_FOR_DELIVERY" | "DELIVERED";

const OrderManagementPage = () => {
  const { data: orders = [], isLoading } = api.order.getAllOrders.useQuery();
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const updateOrderStatus = api.order.updateOrderStatus.useMutation();

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some((productOrder: { product: { name: string } }) =>
          productOrder.product.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) ||
        order.id.toString().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    const previousOrders = [...filteredOrders];
    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    try {
      await updateOrderStatus.mutateAsync({
        orderId,
        status: newStatus,
      });
    } catch (error) {
      setFilteredOrders(previousOrders);
      console.error("Failed to update order status:", error);
    }
  };

  const handleViewDetails = (orderId: number) => {
    const   order = orders.find((o) => o.id === orderId);
    setOrderDetails(order ?? null);
    setSelectedOrderId(orderId);
  };

  const handleCloseDetails = () => {
    setOrderDetails(null);
    setSelectedOrderId(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Order Management</h1>
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Search Orders</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by user name, product name, order ID, or status"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Orders List</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">Total Amount</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.user.name}</td>
                <td className="border px-4 py-2">₹{order.totalAmount}</td>
                <td className="border px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    className="rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="PAYMENT_PENDING">Payment Pending</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="text-indigo-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300 ease-in-out">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out">
            <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
            <button
              onClick={handleCloseDetails}
              className="absolute right-4 top-4 text-gray-600 hover:text-gray-900 text-xl"
            >
              &times;
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-medium">
                Order ID: {orderDetails.id}
              </h3>
              <p className="text-sm text-gray-600">
                User: {orderDetails.user.name}
              </p>
              <p className="text-sm text-gray-600">
                Total Amount: ₹{orderDetails.totalAmount}
              </p>
              <p className="text-sm text-gray-600">
                Note: {orderDetails.note}
              </p>
              <p className="text-sm text-gray-600">
                Status: {orderDetails.status}
              </p>
            </div>
            <h3 className="mb-2 text-lg font-medium">Products</h3>
            <ul>
              {orderDetails.products.map((productOrder: any) => (
                <li key={productOrder.id} className="mb-2">
                  <p className="text-sm font-medium">
                    {productOrder.product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {productOrder.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Subtotal: ₹
                    {productOrder.quantity * productOrder.product.price}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderManagementPage;
