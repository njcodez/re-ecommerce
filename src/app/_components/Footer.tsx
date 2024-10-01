const Footer = () => (
  <footer className="bg-green-700 text-white py-4">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="text-sm mb-4 md:mb-0">
          <p>12, 26th Street, Ashok Nagar, Chennai - 600083</p>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <a href="#" className="hover:text-yellow-400 mb-2 md:mb-0">Facebook</a>
          <a href="#" className="hover:text-yellow-400 mb-2 md:mb-0">Twitter</a>
          <a href="#" className="hover:text-yellow-400 mb-2 md:mb-0">Instagram</a>
          {/* Add more social media links */}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
