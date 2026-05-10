const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort = 'newest',
    featured,
    trending,
    limit,
  } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;
  if (featured) query.isFeatured = featured === 'true';
  if (trending) query.isTrending = trending === 'true';
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
    popular: { isTrending: -1, rating: -1 },
  };
  const productsQuery = Product.find(query).sort(sortMap[sort] || sortMap.newest);
  if (limit) productsQuery.limit(Number(limit));

  const products = await productsQuery;
  res.json(products);
};

exports.getProductSuggestions = async (req, res) => {
  const q = req.query.q || '';
  if (!q.trim()) return res.json([]);
  const suggestions = await Product.find({
    title: { $regex: q, $options: 'i' },
  }).select('title category image price').limit(6);
  res.json(suggestions);
};

exports.getProductMeta = async (req, res) => {
  const [categories, priceRange] = await Promise.all([
    Product.distinct('category'),
    Product.aggregate([
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
    ]),
  ]);
  res.json({ categories, priceRange: priceRange[0] || { min: 0, max: 0 } });
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updates = ['title', 'price', 'image', 'images', 'description', 'category', 'brand', 'rating', 'tags', 'isFeatured', 'isNewArrival', 'isTrending', 'discountPercent', 'stock'];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();
  res.json(updatedProduct);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
};
