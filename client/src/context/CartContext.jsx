import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartItems([]);
        return;
      }
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          "x-auth-token": token,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const refreshCart = () => {
    fetchCartItems();
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}