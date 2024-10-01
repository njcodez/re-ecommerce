import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current path

  const activeClass = (path: string) =>
    pathname === path ? 'bg-white text-dark-green' : '';

  return (
    <div>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-dark-green text-white rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      <aside 
        className={`fixed top-0 left-0 w-64 h-screen bg-light-green-300 shadow-lg transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
      >
        <div className="p-6 flex items-center space-x-4">
          {/* Logo */}
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          {/* Title */}
          <div className="font-bold text-2xl text-dark-green">
            RE Admin
          </div>
        </div>

        <nav className="mt-4">
          <ul>
            <li className={`mb-2 ${activeClass('/admin/dashboard')}`}>
              <Link legacyBehavior href="/admin/dashboard">
                <a className={`block px-6 py-3 rounded-lg transition duration-300 ease-in-out ${activeClass('/admin/dashboard')}`}>
                  Dashboard
                </a>
              </Link>
            </li>
            <li className={`mb-2 ${activeClass('/admin/product-management')}`}>
              <Link legacyBehavior href="/admin/product-management">
                <a className={`block px-6 py-3 rounded-lg transition duration-300 ease-in-out ${activeClass('/admin/product-management')}`}>
                  Product Management
                </a>
              </Link>
            </li>
            <li className={`mb-2 ${activeClass('/admin/order-management')}`}>
              <Link legacyBehavior href="/admin/order-management">
                <a className={`block px-6 py-3 rounded-lg transition duration-300 ease-in-out ${activeClass('/admin/order-management')}`}>
                  Order Management
                </a>
              </Link>
            </li>
            <li className={`mb-2 ${activeClass('/admin/user-management')}`}>
              <Link legacyBehavior href="/admin/user-management">
                <a className={`block px-6 py-3 rounded-lg transition duration-300 ease-in-out ${activeClass('/admin/user-management')}`}>
                  User Management
                </a>
              </Link>
            </li>
            <li className={`mb-2 ${activeClass('/admin/notification-management')}`}>
              <Link legacyBehavior href="/admin/notification-management">
                <a className={`block px-6 py-3 rounded-lg transition duration-300 ease-in-out ${activeClass('/admin/notification-management')}`}>
                  Notification Management
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
