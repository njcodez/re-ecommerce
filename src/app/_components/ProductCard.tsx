import Image from 'next/image';
import { FC } from 'react';

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
  };
};

const ProductCard: FC<ProductCardProps> = ({ product }) => (
  <div className="border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
    <div className="relative h-48 w-full">
      {product.images.length > 0 ? (
        <Image src={product.images[0] ?? ''} alt={product.name} layout="fill" objectFit="cover" />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-600 text-lg">{product.name}</div>
      )}
    </div>
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
      <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
    </div>
  </div>
);

export default ProductCard;
