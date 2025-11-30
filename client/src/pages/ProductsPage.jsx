import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import axios from "axios";

export default function ProductsPage() {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `http://localhost:5000/api/products?category=${selectedCategory}`
          : "http://localhost:5000/api/products";
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${!selectedCategory
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                  }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium capitalize ${selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-primary-50 text-primary-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedCategory || "All Products"}
            </h1>
            <p className="text-gray-600 mt-2">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}