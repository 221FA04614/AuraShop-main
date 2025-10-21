import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function QuickCheckoutPage() {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Get query parameters
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity')) || 1;
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';

  // Shipping address form state
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        toast.error("Product not specified");
        navigate("/products");
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please log in to continue");
          navigate(`/auth?redirect=/quick-checkout?productId=${productId}&quantity=${quantity}&size=${size}&color=${color}`);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error("Failed to load product details");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, quantity, size, color, navigate]);

  // Validation function
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value || value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'Name must be less than 100 characters';
        }
        break;
      case 'phone':
        if (!value || value.trim().length === 0) {
          error = 'Phone number is required';
        } else if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
          error = 'Invalid phone number format';
        }
        break;
      case 'street':
        if (!value || value.trim().length < 5) {
          error = 'Street address must be at least 5 characters';
        } else if (value.trim().length > 200) {
          error = 'Street address must be less than 200 characters';
        }
        break;
      case 'city':
        if (!value || value.trim().length < 2) {
          error = 'City must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'City must be less than 100 characters';
        }
        break;
      case 'state':
        if (!value || value.trim().length < 2) {
          error = 'State must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'State must be less than 100 characters';
        }
        break;
      case 'zipCode':
        if (!value || value.trim().length < 5) {
          error = 'Zip code must be at least 5 characters';
        } else if (value.trim().length > 10) {
          error = 'Zip code must be less than 10 characters';
        }
        break;
      case 'country':
        if (!value || value.trim().length < 2) {
          error = 'Country must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'Country must be less than 100 characters';
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(shippingAddress).forEach(field => {
      const error = validateField(field, shippingAddress[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      street: true,
      city: true,
      state: true,
      zipCode: true,
      country: true
    });
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid
  const isFormValid = () => {
    return Object.keys(shippingAddress).every(field => {
      const value = shippingAddress[field];
      return value && value.trim().length > 0 && !validateField(field, value);
    });
  };

  // Handle checkout submission
  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (!product) {
      toast.error("Product information not available");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      // Trim all address fields
      const trimmedAddress = {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        zipCode: shippingAddress.zipCode.trim(),
        country: shippingAddress.country.trim()
      };

      const response = await axios.post(
        "http://localhost:5000/api/payment/create-quick-checkout-session",
        {
          productId: product._id,
          quantity,
          size: size || undefined,
          color: color || undefined,
          shippingAddress: trimmedAddress
        },
        { headers: { "x-auth-token": token } }
      );

      // Redirect to Stripe checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to initialize payment");
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Quick checkout error:', error);
      const errorMessage = error.response?.data?.message || "Failed to proceed to payment. Please try again.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading checkout...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="text-gray-600 mt-2">The product you're trying to purchase is not available</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Quick Checkout</h1>

      <form onSubmit={handleProceedToPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side: Shipping Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Street Address Field */}
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.street && errors.street ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your street address"
                  />
                  {touched.street && errors.street && (
                    <p className="text-red-600 text-sm mt-1">{errors.street}</p>
                  )}
                </div>

                {/* City and State Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        touched.city && errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
                    />
                    {touched.city && errors.city && (
                      <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        touched.state && errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter state/province"
                    />
                    {touched.state && errors.state && (
                      <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* Zip Code and Country Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Zip/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        touched.zipCode && errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter zip code"
                    />
                    {touched.zipCode && errors.zipCode && (
                      <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        touched.country && errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter country"
                    />
                    {touched.country && errors.country && (
                      <p className="text-red-600 text-sm mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Product Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            {/* Product Details */}
            <div className="mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              {(size || color) && (
                <p className="text-sm text-gray-600 mt-1">
                  {size && `Size: ${size}`}
                  {size && color && ' | '}
                  {color && `Color: ${color}`}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">Quantity: {quantity}</p>
            </div>

            <div className="border-t pt-3 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Price per item</span>
                <span className="font-medium">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">× {quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full mt-6 py-3 rounded-lg transition-colors font-semibold ${
                isFormValid() && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              You will be redirected to Stripe to complete payment securely
            </p>
          </div>

        </div>
      </form>
    </div>
  );
}
