const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadProductImage = async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary environment variables are not configured' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'novacart/products',
    resource_type: 'image',
  });

  res.status(201).json({ url: result.secure_url, publicId: result.public_id });
};
