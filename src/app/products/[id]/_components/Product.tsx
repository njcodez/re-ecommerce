"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { api } from "~/trpc/react";
import ProductImages from "./ProductImages";

export const Product = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string | undefined;
    const { data: session } = useSession();

    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: product, isLoading, isError } = api.product.getProductById.useQuery(
        { id: id ? parseInt(id) : 0 },
        { enabled: !!id }
    );

    const addToCartMutation = api.cart.addToCart.useMutation();

    useEffect(() => {
        if (!isLoading && !product) {
            setLoading(false);
        }
    }, [isLoading, product]);

    const handleAddToCart = async () => {
        if (!session) {
            signIn();
            return;
        }

        if (product && quantity > 0) {
            try {
                setError(null);
                setSuccessMessage(null);
                await addToCartMutation.mutateAsync({
                    productId: product.id,
                    quantity,
                });
                setSuccessMessage("Product added to cart!");
                setQuantity(1);
            } catch (error) {
                console.error("Error adding to cart:", error);
                setError("Failed to add product to cart. Please try again.");
            }
        } else {
            setError("Please select a valid quantity.");
        }
    };

    const handleBuyNow = async () => {
        if (!session) {
            signIn();
            return;
        }

        if (product && quantity > 0) {
            try {
                setError(null);
                setSuccessMessage(null);
                await addToCartMutation.mutateAsync({
                    productId: product.id,
                    quantity,
                });
                router.push('/cart'); // Redirect to cart page
            } catch (error) {
                console.error("Error adding to cart:", error);
                setError("Failed to add product to cart. Please try again.");
            }
        } else {
            setError("Please select a valid quantity.");
        }
    };

    if (isLoading) {
        return <p className="mt-20 text-center text-dark-green">Loading...</p>;
    }

    if (isError || !product) {
        return (
            <p className="mt-20 text-center text-dark-green">Product not found</p>
        );
    }

    return (
        <div className="min-h-screen bg-green-100 text-dark-green">
            <main className="container mx-auto p-6">
                <div className="flex flex-col items-start mt-24 md:flex-row">
                    <div className="relative mx-auto md:w-1/2">
                        {product.images && product.images.length > 0 ? (
                            <ProductImages images={product.images} />
                        ) : (
                            <p className="text-center text-dark-green">No images available</p>
                        )}
                    </div>

                    <div className="md:w-1/2 md:pl-8">
                        <h1 className="mb-4 text-4xl font-bold text-dark-green">
                            {product.name}
                        </h1>
                        <p className="mb-4 text-2xl font-semibold text-dark-green">
                            ₹{product.price}
                        </p>
                        <p className="mb-6 text-gray-700">{product.description}</p>

                        <div className="mb-6 flex items-center space-x-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="bg-green-400 rounded-2xl p-3 w-12 font-bold hover:bg-green-500 transition"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                                className="w-24 text-center rounded-md border border-dark-green p-2 focus:outline-none focus:ring-2 focus:ring-dark-green"
                            />
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="bg-green-400 rounded-2xl w-12 p-3 font-bold hover:bg-green-500 transition"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <button
                                className="relative font-bold bg-yellow-400 text-white px-6 py-3 w-1/3 rounded-md shadow-lg transition duration-300 transform hover:scale-105 hover:text-black"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="relative bg-blue-400 font-bold text-white px-6 py-3 w-1/4 rounded-md shadow-lg transition duration-300 transform hover:scale-105 hover:text-black"
                                onClick={handleBuyNow}
                            >
                                Buy Now!
                            </button>
                        </div>

                        {error && <p className="mt-4 text-red-500">{error}</p>}
                        {successMessage && (
                            <p className="mt-4 text-green-500">{successMessage}</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
