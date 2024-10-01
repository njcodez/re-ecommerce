"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Header from '../_components/Header';
import { api } from '~/trpc/react';

const OrdersPage = () => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Fetch orders using the tRPC query
  const { data: orders = [], isLoading, isError } = api.order.getAllOrders.useQuery();

  const handleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading state
  }

  if (isError) {
    return <div>Error loading orders</div>; // Handle error state
  }

  return (
    <div>
      <div className="min-h-screen p-6 mt-16">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.map((order) => (
          <div key={order.id} className="mb-4">
            <div className="bg-white shadow-md rounded-lg p-4 flex items-start space-x-4">
              <div className="flex-shrink-0">
                {order.products.slice(0, 3).map((product, index) => (
                  <div key={index} className={`relative -ml-${index * 4}`}>
                    <img
                      src={product.product.images[0]} // Use product details from order
                      alt={product.product.name} 
                      width={50} 
                      height={50} 
                      className="rounded-md" 
                    />
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Order ID: {order.id}</span>
                  <span className="font-semibold">₹{order.totalAmount}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-3 h-3 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <span className="text-sm">{order.status}</span>
                </div>
                <button
                  onClick={() => handleExpand( order.id.toString())}
                  className="mt-4 text-blue-600 flex items-center space-x-2"
                >
                  <span>{expandedOrderId === order.id.toString() ? 'Collapse' : 'Expand'}</span>
                  <ChevronDownIcon className={`w-5 h-5 ${expandedOrderId === order.id.toString() ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
{/* 
            {expandedOrderId === order.id && ( */}
              <Dialog open={expandedOrderId === order.id.toString()} onClose={() => handleExpand('')}>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                    <Dialog.Title className="text-lg font-semibold mb-4 flex justify-between items-center">
                      Order Details
                      <button
                        onClick={() => handleExpand('')}
                        className="text-gray-600 hover:text-gray-900"
                        aria-label="Close"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </Dialog.Title>

                    <div className="overflow-y-auto max-h-80">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-center mb-4">
                          <img
                            src={product.product.images[0]} 
                            alt={product.product.name} 
                            width={60} 
                            height={60} 
                            className="rounded-md" 
                          />
                          <div className="ml-4">
                            <p className="font-semibold">{product.product.name}</p>
                            <p className="text-sm">Quantity: {product.quantity}</p>
                            {/* <p className="text-sm">Subtotal: ₹{product.}</p> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog>
            {/* )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
