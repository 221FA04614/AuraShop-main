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
      <Link to={`/product/${product._id}`} className="group block h-full">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-64 w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
            {!product.inStock && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Out of Stock
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
              <span className="text-lg font-bold text-primary-600">${product.price}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{product.description}</p>

            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">{product.category}</span>
            </div>

            {/* Buy Now Button */}
            {product.inStock && (
              <button
                onClick={handleBuyNowClick}
                className="w-full mt-4 py-2.5 px-4 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
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
