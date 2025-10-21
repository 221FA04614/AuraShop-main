import { useNavigate } from "react-router-dom";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Info Icon and Message */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-lg text-gray-600">Your payment was not processed.</p>
      </div>

      {/* Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Your cart items are still saved</p>
              <p className="text-sm text-gray-600 mt-1">
                All items remain in your cart. You can return to complete your purchase at any time.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <svg className="h-6 w-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">No charges were made</p>
              <p className="text-sm text-gray-600 mt-1">
                Your payment method was not charged. You can try again when you're ready.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <svg className="h-6 w-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Need help?</p>
              <p className="text-sm text-gray-600 mt-1">
                If you encountered any issues during checkout, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate("/cart")}
          className="flex-1 sm:flex-none bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Return to Cart
        </button>
        <button
          onClick={() => navigate("/products")}
          className="flex-1 sm:flex-none bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
