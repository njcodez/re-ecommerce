import { useState } from 'react';
import type { Product } from '../../../types/Product'; // Use import type
import { upsertProduct } from '../../../lib/productService';
import { motion } from 'framer-motion';

type ProductFormProps = {
  product: Product | null;
  onSubmit: () => void;
  onClose: () => void;
};

const ProductForm = ({ product, onSubmit, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState<Product>({
    id: product?.id ?? 0,
    name: product?.name ?? '',
    brandName: product?.brandName ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    images: product?.images ?? [''], // Initialize with one empty string
    status: product?.status ?? 'AVAILABLE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleAddImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleRemoveImageField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData); // Log form data

    try {
      // Convert price to number
      const productWithCorrectPrice = {
        ...formData,
        price: parseFloat(formData.price.toString()), // Ensure price is a number
      };
      console.log("Submitting product data:", productWithCorrectPrice);
      await upsertProduct(productWithCorrectPrice);
      onSubmit();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        initial={{ y: "-50vh" }}
        animate={{ y: "0" }}
        exit={{ y: "50vh" }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {product ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="AVAILABLE">Available</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image URLs</label>
            {formData.images.map((image, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder={`Image URL ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImageField(index)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImageField}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Another Image
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;
