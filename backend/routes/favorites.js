const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:productId', removeFavorite);

module.exports = router;
