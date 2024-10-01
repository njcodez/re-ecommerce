"use client";

import { useState, useEffect } from "react";
import { Slider } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import { Product } from "~/types/Product";

const ProductsSection = () => {
  const [priceRange, setPriceRange] = useState<number[]>([100, 100000]);
  const [brandFilters, setBrandFilters] = useState<Record<string, boolean>>({});
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState<string>("");

  const { data: products = [] } = api.product.getAllProducts.useQuery();

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleBrandFilterChange = (brand: string) => {
    setBrandFilters((prevFilters) => ({
      ...prevFilters,
      [brand]: !prevFilters[brand],
    }));
  };

  useEffect(() => {
    const updatedBrands = Object.keys(brandFilters).filter(
      (brand) => brandFilters[brand]
    );
    setSelectedBrands(updatedBrands);
  }, [brandFilters]);

  const uniqueBrands = Array.from(
    new Set(products.map((product: Product) => product.brandName))
  );

  const filteredProducts = products
    .filter((product: Product | undefined) => {
      const lowercasedSearch = productSearch.toLowerCase();
      const matchesName = product?.name?.toLowerCase().includes(lowercasedSearch);
      const matchesBrand = product?.brandName?.toLowerCase().includes(lowercasedSearch);
      return matchesName || matchesBrand;
    })
    .filter((product: Product) =>
      product.price !== undefined &&
      product.price >= (priceRange[0] || 10) &&
      product.price <= (priceRange[1] || 100000) &&
      (selectedBrands.length === 0 || selectedBrands.includes(product.brandName))
    );

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Our Products</h1>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search products"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-4 text-lg font-bold transition-all duration-300 ease-in-out focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">Our Products</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <form className="hidden lg:block">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700">Price Range</h3>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={100}
                  max={100000}
                  className="mt-4"
                />
                <p className="text-sm text-gray-500">₹{priceRange[0]} - ₹{priceRange[1]}</p>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Brands</h3>
                {uniqueBrands.map((brand) => (
                  <div key={brand} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={!!brandFilters[brand]}
                      onChange={() => handleBrandFilterChange(brand)}
                      className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-gray-700">{brand}</label>
                  </div>
                ))}
              </div>
            </form>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <div className="group relative transition-transform transform hover:scale-105">
                        <div className="aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden rounded-lg bg-gray-200 lg:h-64">
                          <div className="relative h-full w-full">
                            {product.images.length > 0 && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={400}
                                height={400}
                                className="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out"
                              />
                            ) : (
                              <p>No images available</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <h3 className="text-lg font-bold capitalize text-gray-700">{product.name}</h3>
                            <p className="text-md mt-1 font-semibold text-gray-900">₹{product.price}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>No products available</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductsSection;
