import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { cartCount, refreshCart } = useCart();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
    refreshCart();
  }, [refreshCart]);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 group-hover:scale-105 transition-transform duration-200">
              AuraShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              All Products
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category}
                to={`/products/${category.toLowerCase()}`}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors capitalize"
              >
                {category}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-fade-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Orders
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-red-500 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium px-2">
                Home
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-primary-600 font-medium px-2">
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products/${category.toLowerCase()}`}
                  className="text-gray-600 hover:text-primary-600 font-medium px-2 capitalize"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}