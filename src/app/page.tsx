

import Header from './_components/Header';
import Banner from './_components/Banner';
import Footer from './_components/Footer';
import ProductsSection from './_components/ProductSection';
import ClientProvider from './client-provider'; // Import your ClientProvider if needed

// Define metadata at the top level
export const metadata = {
  title: "RE Agencies",
  description: "Ayurvedic distributor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const HomePage = () => {
  // Example scroll function (uncomment if needed)
  const scrollToProducts = () => {
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ClientProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Banner />
          <ProductsSection /> {/* Ensure this component is properly named and imported */}
        </main>
        <Footer />
      </div>
    </ClientProvider>
  );
};

export default HomePage;
