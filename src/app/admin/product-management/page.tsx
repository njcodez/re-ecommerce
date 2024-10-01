// import { useEffect, useState } from "react";
// import AdminLayout from "../layout";
// import ProductForm from "../components/ProductForm";
// import { fetchProducts, deleteProduct } from "../../../lib/productService";
// import { Product } from "../../../types/Product";
// import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert from Material UI

// const ProductManagementPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [confirmationOpen, setConfirmationOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<number | null>(null);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const products = await fetchProducts();
//         setProducts(products);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     loadProducts();
//   }, []);

//   const sortedProducts = (() => {
//     // Sorting logic here if needed
//     return products;
//   })();

//   const filteredProducts = sortedProducts.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ??
//       product.brandName.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const handleAddProduct = () => {
//     setShowForm(true);
//     setSelectedProduct(null);
//   };

//   const handleEditProduct = (product: Product) => {
//     setShowForm(true);
//     setSelectedProduct(product);
//   };

//   const handleDeleteProduct = async (id: number) => {
//     setProductToDelete(id);
//     setConfirmationOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (productToDelete === null) return;
//     try {
//       await deleteProduct(productToDelete);
//       setProducts((prev) =>
//         prev.filter((product) => product.id !== productToDelete),
//       );
//       setSnackbarMessage("Product deleted successfully.");
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       setSnackbarMessage("Error deleting product.");
//     } finally {
//       setSnackbarOpen(true);
//       setConfirmationOpen(false);
//       setProductToDelete(null);
//     }
//   };

//   const handleCloseForm = () => {
//     setShowForm(false);
//     setSelectedProduct(null);
//   };

//   const handleFormSubmit = async () => {
//     try {
//       const products = await fetchProducts();
//       setProducts(products);
//       setSnackbarMessage("Product saved successfully.");
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setSnackbarMessage("Error saving product.");
//     } finally {
//       setSnackbarOpen(true);
//       handleCloseForm();
//     }
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <>
//       <div className="container mx-auto p-4">
//         <div className="mb-4 flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Product Management</h1>
//           <button
//             onClick={handleAddProduct}
//             className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//           >
//             Add Product
//           </button>
//         </div>
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="mb-4 w-full rounded border p-2"
//         />
//         <table className="min-w-full border border-gray-300 bg-white">
//           <thead>
//             <tr>
//               <th className="border-b px-4 py-2 text-left">Name</th>
//               <th className="border-b px-4 py-2 text-left">Brand</th>
//               <th className="border-b px-4 py-2 text-left">Price</th>
//               <th className="border-b px-4 py-2 text-left">Status</th>
//               <th className="border-b px-4 py-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map((product) => (
//               <tr key={product.id}>
//                 <td className="border-b px-4 py-2 capitalize">
//                   {product.name}
//                 </td>
//                 <td className="border-b px-4 py-2 capitalize">
//                   {product.brandName}
//                 </td>
//                 <td className="border-b px-4 py-2">₹{product.price}</td>
//                 <td className="border-b px-4 py-2">
//                   <span
//                     className={`inline-block rounded px-2 py-1 ${product.status === "AVAILABLE" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
//                   >
//                     {product.status}
//                   </span>
//                 </td>
//                 <td className="flex space-x-2 border-b px-4 py-2">
//                   <button
//                     onClick={() => handleEditProduct(product)}
//                     className="rounded-lg bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600 mr-8"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteProduct(product.id)}
//                     className="rounded-lg bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {showForm && (
//           <ProductForm
//             product={selectedProduct}
//             onSubmit={handleFormSubmit}
//             onClose={handleCloseForm}
//           />
//         )}
//         {confirmationOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
//             <div className="animate-fadeIn rounded bg-white p-4 shadow-lg">
//               <h2 className="mb-4 text-lg font-bold">Confirm Deletion</h2>
//               <p>Are you sure you want to delete this product?</p>
//               <div className="mt-4 flex justify-end space-x-2">
//                 <button
//                   onClick={() => setConfirmationOpen(false)}
//                   className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </>
//   );
// };

// export default ProductManagementPage;

"use client"
import React, { useState } from 'react'
import { CreateProductForm } from "./_components/CreateProductForm";
import { DataTable } from "./_components/DataTable";
import { api } from "~/trpc/react";
import { fetchProducts } from '~/lib/productService';
import { productColumns } from './_components/Columns';
import { Product } from '~/types/Product';

const page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);


  const { data: productData, isLoading, error } = api.product.getTableProducts.useQuery();

  const handleFormSubmit = async () => {
    try {
      setProducts(products);
      setSnackbarMessage("Product saved successfully.");
    } catch (error) {
      console.error("Error fetching products:", error);
      setSnackbarMessage("Error saving product.");
    } finally {
      setSnackbarOpen(true);
      handleCloseForm();
    }
  };

  const handleCloseForm = () => {
    // setShowForm(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If there's an error, we can display an error message
  if (error) {
    return <div>Error fetching products: {error.message}</div>;
  }

  return (
    <>
      <CreateProductForm onClose={handleFormSubmit} onSubmit={handleCloseForm} />
      <div className="container mx-auto py-10">
        {/* Pass an empty array as a fallback if productData is undefined */}
        <DataTable columns={productColumns} data={productData ?? []} />
      </div>
    </>
  );
}

export default page;