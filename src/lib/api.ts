

export const getDeliveredOrdersOverview = async () => {
    // Replace with actual API call
    const response = await fetch('/api/admin/dashboard'); // Example endpoint
    const data = await response.json();
    return data;
  };
  