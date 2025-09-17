import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../context/CartContext.jsx";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('');
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please log in to proceed to checkout.");
          navigate("/auth");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: { "x-auth-token": token },
        });
        setCartItems(response.data);
      } catch (error) {
        toast.error("Failed to fetch cart items.");
        navigate("/cart");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartItems();
  }, [navigate]);

  // --- Price Calculations ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);
  const taxRate = 0.05; // Mock 5% tax
  const tax = subtotal * taxRate;
  const finalPrice = subtotal + tax;

  // --- Mock Order Placement ---
  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method.");
      return;
    }

    // This is a mock shipping address. In a real app, you'd collect this from a form.
    const mockShippingAddress = {
      street: "123 Aura Lane",
      city: "Styleburg",
      state: "Fashion",
      zipCode: "12345",
      country: "USA",
    };

    const orderItems = cartItems.map(item => ({
      productId: item.productId._id,
      productName: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
      size: item.size,
      color: item.color,
    }));

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: orderItems,
          totalAmount: finalPrice,
          shippingAddress: mockShippingAddress,
        },
        { headers: { "x-auth-token": token } }
      );

      toast.success("Order placed successfully!");
      refreshCart(); // Update cart count in header
      navigate("/orders"); // Redirect to the orders page
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-16">Loading checkout...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Payment Methods */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>
            <div className="space-y-4">
              {/* UPI Option */}
              <div 
                onClick={() => setSelectedPayment('upi')}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'upi' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
              >
                <h3 className="font-medium text-lg">UPI</h3>
                <p className="text-gray-600">Pay with any UPI app (Google Pay, PhonePe, etc.)</p>
              </div>

              {/* COD Option */}
              <div 
                onClick={() => setSelectedPayment('cod')}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
              >
                <h3 className="font-medium text-lg">Cash on Delivery (COD)</h3>
                <p className="text-gray-600">Pay with cash when your order is delivered.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (5%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Price</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            disabled={!selectedPayment || cartItems.length === 0}
          >
            Place Order
          </button>
        </div>

      </div>
    </div>
  );
}