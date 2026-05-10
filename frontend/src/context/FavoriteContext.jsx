import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const FavoriteContext = createContext(null);

export const FavoriteProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    setIsLoading(true);
    const response = await API.get('/favorites');
    setFavorites(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const addFavorite = async (productId) => {
    const response = await API.post('/favorites', { productId });
    setFavorites((prevFavorites) => [...prevFavorites, response.data]);
  };

  const removeFavorite = async (productId) => {
    await API.delete(`/favorites/${productId}`);
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.productId._id !== productId));
  };

  const isFavorite = (productId) => {
    return favorites.some((fav) => fav.productId?._id === productId);
  };

  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      await removeFavorite(productId);
    } else {
      await addFavorite(productId);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, isLoading, fetchFavorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};
