const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const products = [
  {
    title: 'Nova-1 Smart Peripheral',
    price: 899,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTtLAPSilkzul3Yo6N1eEc_gEYpPqtnguy8S-Ma9Dlm30JsR4sFY6EsbalfP0-gBDUwv5m8IyTDjZKFbT-JK-mrdINuwHzlc4Slu1v-vKcRm9iAiDF3kR7YvyTWjwvBtj11pT8sst84HkM3smfBTHQmUANSSghi4fpC2trMZ3creVv_wTwBw4_zAUr0qE9PW7pgRTqr8DStRqqhd2Dl4UQ64BylAYPEtSzI3LDUd92lczUM7wlUur5gNoAxCYDQkRN8CLM1NqgJFSC',
    description: 'Integrated biometric sensors wrapped in a seamless ceramic body. Performance meets purity.',
    category: 'Tech',
    stock: 24,
    isFeatured: true,
    isTrending: true,
    tags: ['smart', 'tech', 'premium'],
  },
  {
    title: 'Sonic Glass Audio',
    price: 449,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmgXtxiShgnGc_-NIjLpnNSmmbwVViSDpOqL5M9wULGLvkvBoYmy5bZnySp2Y4l9tlHvYQGk5TdlBaEt-uTXqRmdNUg-qI2dgAjlpQFyiIJBSzfS50CWJgm3rGXw29FTC85Q_ssmQbdGI7NJPnehKEnq5_bc4SGEWQpZQEhR4c8qkPe1nTt8se6eMNYQZM6B_xjTyivrG4Tgy37Iy5hOSImV2JG_Ln0aFoHHsfenGvAG8vbIzIUeY4zeV6PgoqF24VLSjHOo7FolUj',
    description: 'Spatial acoustics with active transparency modes for total immersion.',
    category: 'Accessories',
    stock: 16,
    isFeatured: true,
    isTrending: true,
    tags: ['audio', 'accessories'],
  },
  {
    title: 'Neon Sprint V2',
    price: 210,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF71_56FQExCoiJoNMS59q7MGkAnYxcdQjWAsSdNf-xmah1jSGMnhPKH41upFy1JP09DWquDHU5IUFGHD_K7tkd6_z-WMjwripiU4gl9QGC3JIACE2YTalscRcYCiDsPId9uVgscObjnLwtk7_VkV__qh-5p-dMNKVjKQpqJM1RSY5jn_Omm1lxa7gd5Qtzq22kF36k1nMhpdyb8IGgY_8y7vLdmWgDRVm0ICW9fHiUC11Fz3oTgkWIGkRmaPbYRnxW_OtKMuo0ORd',
    description: 'Propulsion technology meets avant-garde street aesthetic.',
    category: 'Apparel',
    stock: 28,
    isNewArrival: true,
    isTrending: true,
    discountPercent: 10,
    tags: ['shoes', 'apparel'],
  },
  {
    title: 'Obsidian Drone X',
    price: 2400,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDwA2hUJE-jfqkfaIBmZON7CB_bvnH1f7gWdem_bu70iGm6pF1EtYEREsc_lcSOj424JJcG2IUHomElDITZtHGltBMsSrp5do4OrW2m-0ICwmmWyx7dNzVSw20tuDGfFCG6JCHedC0nGZ7QjPCAxa1fy04tCdA4i9TSV6nxiLARJdIP7xFwnE0eQJPSSqu_8vcjWDSkxzKPLOilZU55UWk1k5EhMzLG05hwS7Snt0j2FCVWhEaqSYxDVpWwx67utt3WKxDXi7GEEP7',
    description: '8K Cinematic recording in a carbon-fiber collapsible frame.',
    category: 'Tech',
    stock: 7,
    isFeatured: true,
    tags: ['drone', 'camera', 'tech'],
  },
  {
    title: 'Prism Stilettos',
    price: 1150,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2l8PslJSWXPl5-ZuATcH9hr-E_dn1l0haA1BxBT6G_TFiPH-roYsYOaPq2FtpirtPYDFdO_RU1lCKTXpCY2oiyyJ9R4K-AWQn3L4YYtVKRnYe621ZnLbu9RChfIHq1Wlp5vjO6oPGvZw6KRFpQ-8BShX9N66pdeqYG_1yzloeG_72GGxlNK6GXAOd69LPOZtfNsGWUeiG3zLRUGeSdxwp8XB5hL3Ti0fh9lls3sYdK53PsNpxfWQU5_RwPPqPp4PgeK06pGnVHT-9',
    description: 'Iridescent leather with a structural chrome heel design.',
    category: 'Apparel',
    stock: 12,
    isNewArrival: true,
    tags: ['fashion', 'apparel'],
  },
];

const seed = async () => {
  await connectDB();

  const password = await bcrypt.hash('admin123', 10);
  await User.findOneAndUpdate(
    { email: 'admin@novacart.com' },
    { name: 'NovaCart Admin', email: 'admin@novacart.com', password, role: 'admin', isEmailVerified: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await User.findOneAndUpdate(
    { email: 'user@novacart.com' },
    { name: 'Sophia Nova', email: 'user@novacart.com', password: await bcrypt.hash('user123', 10), role: 'user', isEmailVerified: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await Promise.all(products.map((product) => (
    Product.findOneAndUpdate({ title: product.title }, product, { upsert: true, new: true, setDefaultsOnInsert: true })
  )));

  console.log('Seed completed successfully');
  process.exit();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
