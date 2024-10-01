"use client";
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import { api } from '~/trpc/react';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [note, setNote] = useState('');

  const { data: cartItems = [], refetch, isLoading } = api.cart.getCartItems.useQuery();

  const updateCartItem = api.cart.updateCartItem.useMutation({
    onSuccess: () => refetch(),
  });
  const removeCartItem = api.cart.removeCartItem.useMutation({
    onSuccess: () => refetch(),
  });

  const createOrder = api.order.createOrder.useMutation({
    onSuccess: () => {
      setCheckoutOpen(true);
      toast.success('Order placed successfully!');
      refetch();
    },
  });

  const handleRemove = (id: number) => {
    removeCartItem.mutate(id);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem.mutate({ cartItemId: id, quantity: newQuantity });
  };

  const handleCheckout = () => {
    setConfirmationOpen(true);
  };

  const confirmOrder = () => {
    createOrder.mutate({
      cartItems: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.productId,
          name: item.product.name,
          price: item.product.price,
        },
      })),
      note,
    });
    setConfirmationOpen(false);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      <main className="flex-1 mt-12 p-6 flex flex-col lg:flex-row lg:space-x-10 space-y-6 lg:space-y-0">
        {cartItems.length > 0 ? (
          <div className="flex-1 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-10">
            <div className="w-full lg:w-2/3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center p-4 bg-white shadow-md rounded-lg mb-6">
                  <img src={item.product.images[0]} alt={item.product.name} width={80} height={80} className="rounded" />
                  <div className="ml-4 w-full">
                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                    <p className="text-sm text-gray-500">Price: ₹{item.product.price}</p>
                    <div className="mt-2 flex items-center">
                      <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded-l-md">-</button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                        className="w-16 text-center border-t border-b border-gray-200"
                        min="1"
                      />
                      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded-r-md">+</button>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-lg font-semibold">₹{item.product.price * item.quantity}</p>
                    <button onClick={() => handleRemove(item.id)} className="text-red-500 mt-2">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/3 bg-white p-6 shadow-md rounded-lg flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Title</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.product.name}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">₹{item.product.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4">
                <label htmlFor="note" className="block text-sm font-medium text-gray-700">Add a note for your order</label>
                <textarea
                  id="note"
                  rows={3}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-4 border-t pt-4 flex-grow flex flex-col justify-end">
                <p className="text-lg font-semibold">Total: ₹{totalPrice}</p>
                <button
                  className="w-full py-2 bg-green-600 text-white rounded-md mt-4"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 flex-1 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <Link href="/" className="mt-6 inline-block px-6 py-2 bg-green-500 text-white rounded-md w-1/4">Explore Products</Link>
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to place this order?</h2>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={confirmOrder} className="bg-green-600 text-white px-4 py-2 rounded-md">Yes</button>
              <button onClick={() => setConfirmationOpen(false)} className="bg-gray-300 px-4 py-2 rounded-md">No</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Checkout Pop-Up */}
      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your order has been placed!</h2>
            <p>Check the status in the "My Orders" page or continue shopping.</p>
            <div className="mt-6 flex space-x-4">
              <Link href="/orders" className="bg-blue-600 text-white px-4 py-2 rounded-md">My Orders</Link>
              <Link href="/" className="bg-gray-300 px-4 py-2 rounded-md">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default CartPage;
