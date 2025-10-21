import { useState } from "react";
import { Link } from "react-router-dom";
import QuickBuyModal from "./QuickBuyModal";

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyNowClick = (e) => {
    e.preventDefault(); // Prevent navigation to product detail page
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <Link to={`/product/${product._id}`} className="group block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xl font-bold text-gray-900">${product.price}</span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
            {!product.inStock && (
              <span className="inline-block mb-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                Out of Stock
              </span>
            )}

            {/* Buy Now Button */}
            {product.inStock && (
              <button
                onClick={handleBuyNowClick}
                className="w-full mt-2 py-2 px-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Buy Modal */}
      <QuickBuyModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
