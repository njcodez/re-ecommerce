export const addToCart = async (productId: number, quantity: number, userId: string) => {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity, userId }),
        });

        console.log('Add to cart response status:', response.status); // Log response status
        
        if (!response.ok) {
            const errorText = await response.text(); // Capture error text for debugging
            console.error('Add to cart error response text:', errorText); // Log error text
            throw new Error('Failed to add to cart');
        }

        const result = await response.json();
        console.log('Add to cart result:', result); // Log the result after adding to cart
        return result;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw new Error("Unable to add to cart.");
    }
};
