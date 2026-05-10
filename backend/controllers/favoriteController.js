const Favorite = require('../models/Favorite');

exports.getFavorites = async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id }).populate('productId');
  res.json(favorites);
};

exports.addFavorite = async (req, res) => {
  const { productId } = req.body;
  const existing = await Favorite.findOne({ userId: req.user._id, productId });
  if (existing) {
    return res.status(400).json({ message: 'Already in favorites' });
  }
  const favorite = await Favorite.create({ userId: req.user._id, productId });
  await favorite.populate('productId');
  res.status(201).json(favorite);
};

exports.removeFavorite = async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({ userId: req.user._id, productId: req.params.productId });
  if (!favorite) {
    return res.status(404).json({ message: 'Favorite not found' });
  }
  res.json({ message: 'Removed from favorites' });
};
