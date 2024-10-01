import * as React from 'react';

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface EmailTemplateProps {
  customerName: string;
  customerEmail: string;
  orderId: number;
  totalAmount: number;
  products: Product[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  customerName,
  customerEmail,
  orderId,
  totalAmount,
  products,
}) => (
  <div>
    <h1>New Order Placed</h1>
    <p><strong>Order ID:</strong> {orderId}</p>
    <p><strong>Customer Name:</strong> {customerName}</p>
    <p><strong>Customer Email:</strong> {customerEmail}</p>
    <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
    
    <h2>Order Details:</h2>
    <ul>
      {products.map((product, index) => (
        <li key={index}>
          <p><strong>Product:</strong> {product.name}</p>
          <p><strong>Quantity:</strong> {product.quantity}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
        </li>
      ))}
    </ul>
  </div>
);
