import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products?featured=true");
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };
    fetchFeaturedProducts();

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary-500 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-primary-400 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in">
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-primary-300">Aura</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 animate-slide-up">
              Explore our curated collection of premium fashion items designed for the modern lifestyle.
            </p>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/products"
                className="inline-block bg-white text-primary-900 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products/${category.toLowerCase()}`}
                className="group text-center"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 capitalize group-hover:text-primary-600 transition-colors">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700 hover:underline">
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-10 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}