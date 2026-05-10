import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    const response = await API.get('/cart');
    setCart(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const response = await API.post('/cart', { productId, quantity });
    setCart(response.data);
  };

  const updateCartItem = async (productId, quantity) => {
    const response = await API.put(`/cart/${productId}`, { quantity });
    setCart(response.data);
  };

  const removeCartItem = async (productId) => {
    const response = await API.delete(`/cart/${productId}`);
    setCart(response.data);
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, fetchCart, addToCart, updateCartItem, removeCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
