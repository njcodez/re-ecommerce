export const fetchProducts = async () => {
    try {
        const response = await fetch('/api/products');
        
        console.log('Fetch response status:', response.status); // Log response status
        
        if (!response.ok) {
            const errorText = await response.text(); // Capture error text for debugging
            console.error('Fetch error response text:', errorText); // Log error text
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        console.log('Fetched products:', products); // Log fetched products
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Unable to fetch products.");
    }
};

export const fetchProductById = async (id: number) => {
    try {
        const response = await fetch(`/api/products/${id}`);
        
        console.log('Fetch product by ID response status:', response.status); // Log response status
        
        if (!response.ok) {
            const errorText = await response.text(); // Capture error text for debugging
            console.error('Fetch product by ID error response text:', errorText); // Log error text
            throw new Error('Failed to fetch product by ID');
        }
        
        const product = await response.json();
        console.log('Fetched product by ID:', product); // Log fetched product
        return product;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw new Error("Unable to fetch product by ID.");
    }
};

export const upsertProduct = async (product: any) => {
    try {
        console.log('Upserting product data:', product); // Log the product data being sent
        
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        
        console.log('Upsert response status:', response.status); // Log response status
        
        if (!response.ok) {
            const errorText = await response.text(); // Capture error text for debugging
            console.error('Upsert error response text:', errorText); // Log error text
            throw new Error('Failed to upsert product');
        }
        
        const result = await response.json();
        console.log('Upsert result:', result); // Log the result after upserting
        return result;
    } catch (error) {
        console.error("Error upserting product:", error);
        throw new Error("Unable to upsert product.");
    }
};

export const deleteProduct = async (id: number) => {
    try {
        console.log('Deleting product with id:', id); // Log the id being deleted
        
        const response = await fetch('/api/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        
        console.log('Delete response status:', response.status); // Log response status
        
        if (!response.ok) {
            const errorText = await response.text(); // Capture error text for debugging
            console.error('Delete error response text:', errorText); // Log error text
            throw new Error('Failed to delete product');
        }
        
        const result = await response.json();
        console.log('Delete result:', result); // Log the result after deletion
        return result;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Unable to delete product.");
    }
};
