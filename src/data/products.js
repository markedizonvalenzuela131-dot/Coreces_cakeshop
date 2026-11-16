export const categories = [
  { id: 'birthday', name: 'Birthday Cakes', description: 'Celebrate special moments with our custom birthday cakes' },
  { id: 'wedding', name: 'Wedding Cakes', description: 'Elegant multi-tier cakes for your big day' },
  { id: 'cupcakes', name: 'Cupcakes', description: 'Delicious individual treats in various flavors' },
  { id: 'specialty', name: 'Specialty Cakes', description: 'Unique flavors and dietary-friendly options' },
  { id: 'seasonal', name: 'Seasonal Specials', description: 'Limited-time offerings for every season' }
];

// Cake style definitions for CSS-based rendering
export const cakeStyles = {
  chocolate: {
    base: '#5D3A2E',
    frosting: '#3D251A',
    accent: '#C49A6C',
    decoration: 'chocolate-shavings'
  },
  vanilla: {
    base: '#FFF8E7',
    frosting: '#FFF0D6',
    accent: '#F5E6C8',
    decoration: 'sprinkles'
  },
  strawberry: {
    base: '#FDF2F8',
    frosting: '#FCE7F3',
    accent: '#FBCFE8',
    decoration: 'strawberries'
  },
  redVelvet: {
    base: '#8B2635',
    frosting: '#F5F0EB',
    accent: '#C4736B',
    decoration: 'velvet-crumbs'
  },
  wedding: {
    base: '#FDFDFD',
    frosting: '#FAFAFA',
    accent: '#F5F0EF',
    decoration: 'flowers'
  },
  naked: {
    base: '#E8D5C4',
    frosting: '#F5E6DC',
    accent: '#D4B8A0',
    decoration: 'berries-flowers'
  },
  vegan: {
    base: '#4A3D35',
    frosting: '#3D2F28',
    accent: '#6B5B4F',
    decoration: 'cacao-nibs'
  },
  keto: {
    base: '#E8DCC8',
    frosting: '#F5EFC8',
    accent: '#D4C4A8',
    decoration: 'almonds'
  },
  pumpkin: {
    base: '#C46A2E',
    frosting: '#F5E6D3',
    accent: '#E8A87C',
    decoration: 'pecans'
  },
  peppermint: {
    base: '#2D4A3D',
    frosting: '#E8F5EB',
    accent: '#C4E8D4',
    decoration: 'peppermint-bark'
  },
  matcha: {
    base: '#7A9E7E',
    frosting: '#A8C8A8',
    accent: '#5D7E5D',
    decoration: 'matcha-powder'
  },
  rainbow: {
    base: '#FFF0F5',
    frosting: '#FFF8FA',
    accent: '#FFD6E8',
    decoration: 'rainbow-layers'
  }
};

export const products = [
  {
    id: 1,
    name: 'Classic Chocolate Birthday Cake',
    category: 'birthday',
    price: 2520,
    originalPrice: 3080,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-01.jpg`,
    style: 'chocolate',
    description: 'Rich chocolate sponge with dark chocolate buttercream, finished with chocolate shavings and a customizable message.',
    details: ['Serves 8-10 people', '3 layers of chocolate sponge', 'Dark chocolate buttercream', 'Customizable message'],
    tags: ['Popular', 'Best Seller'],
    rating: 4.9,
    reviews: 124,
    inStock: true,
    prepTime: '24 hours'
  },
  {
    id: 2,
    name: 'Vanilla Rainbow Celebration Cake',
    category: 'birthday',
    price: 2800,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-02.jpg`,
    style: 'rainbow',
    description: 'Six vibrant vanilla sponge layers with vanilla bean buttercream, perfect for celebrations.',
    details: ['Serves 10-12 people', '6 colorful vanilla layers', 'Vanilla bean buttercream', 'Edible glitter available'],
    tags: ['New', 'Kids Favorite'],
    rating: 4.8,
    reviews: 89,
    inStock: true,
    prepTime: '24 hours'
  },
  {
    id: 3,
    name: 'Fresh Strawberry Shortcake',
    category: 'birthday',
    price: 2688,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-03.jpg`,
    style: 'strawberry',
    description: 'Light vanilla sponge layered with fresh strawberries and whipped cream, topped with whole berries.',
    details: ['Serves 8-10 people', 'Fresh seasonal strawberries', 'Light whipped cream', 'Gluten-free option available'],
    tags: ['Seasonal', 'Fresh'],
    rating: 4.7,
    reviews: 67,
    inStock: true,
    prepTime: '12 hours'
  },
  {
    id: 4,
    name: 'Elegant Three-Tier Wedding Cake',
    category: 'wedding',
    price: 2650,
    originalPrice: 3000,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-04.jpg`,
    style: 'wedding',
    description: 'Stunning three-tier cake with smooth fondant finish, delicate sugar flowers, and customizable flavors per tier.',
    details: ['Serves 50-70 people', 'Three tiers (12", 9", 6")', 'Fondant or buttercream finish', 'Sugar flower decorations', '3 flavor combinations'],
    tags: ['Premium', 'Customizable'],
    rating: 5.0,
    reviews: 45,
    inStock: true,
    prepTime: '72 hours'
  },
  {
    id: 5,
    name: 'Rustic Naked Wedding Cake',
    category: 'wedding',
    price: 1500,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-05.jpg`,
    style: 'naked',
    description: 'Beautiful semi-naked cake with minimal frosting, fresh flowers and berries, perfect for outdoor weddings.',
    details: ['Serves 40-60 people', 'Three tiers with minimal frosting', 'Fresh flowers & berries', 'Cream cheese frosting between layers'],
    tags: ['Rustic', 'Trending'],
    rating: 4.9,
    reviews: 38,
    inStock: true,
    prepTime: '48 hours'
  },
  {
    id: 6,
    name: 'Classic Red Velvet Cupcakes (6pcs)',
    category: 'cupcakes',
    price: 1344,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-06.jpg`,
    style: 'redVelvet',
    description: 'Moist red velvet cupcakes with cream cheese frosting, topped with velvet crumbs.',
    details: ['6 cupcakes per box', 'Cream cheese frosting', 'Red velvet crumb topping', 'Individually wrapped'],
    tags: ['Classic', 'Gift Ready'],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    prepTime: '6 hours'
  },
  {
    id: 7,
    name: 'Assorted Gourmet Cupcakes (12pcs)',
    category: 'cupcakes',
    price: 2352,
    originalPrice: 2688,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-07.jpg`,
    style: 'vanilla',
    description: 'Assortment of signature flavors: chocolate, vanilla, red velvet, salted caramel, lemon, cookies & cream.',
    details: ['12 cupcakes (2 each flavor)', '6 signature flavors', 'Premium ingredients', 'Decorative gift box'],
    tags: ['Variety', 'Best Value'],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    prepTime: '12 hours'
  },
  {
    id: 8,
    name: 'Vegan Chocolate Avocado Cake',
    category: 'specialty',
    price: 3080,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-08.jpg`,
    style: 'vegan',
    description: 'Rich chocolate cake made with avocado for moisture, topped with vegan chocolate ganache and cacao nibs.',
    details: ['Serves 8-10 people', '100% vegan', 'No refined sugar', 'Avocado-based ganache', 'Gluten-free option'],
    tags: ['Vegan', 'Healthy'],
    rating: 4.6,
    reviews: 42,
    inStock: true,
    prepTime: '24 hours'
  },
  {
    id: 9,
    name: 'Keto Almond Flour Cheesecake',
    category: 'specialty',
    price: 2912,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-09.jpg`,
    style: 'keto',
    description: 'Creamy New York style cheesecake with almond flour crust, sweetened with monk fruit, topped with toasted almonds.',
    details: ['Serves 10-12 people', 'Keto-friendly', 'Low carb (3g net)', 'Sugar-free', 'Almond flour crust'],
    tags: ['Keto', 'Low Carb'],
    rating: 4.7,
    reviews: 35,
    inStock: true,
    prepTime: '24 hours'
  },
  {
    id: 10,
    name: 'Pumpkin Spice Layer Cake',
    category: 'seasonal',
    price: 2688,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-10.jpg`,
    style: 'pumpkin',
    description: 'Moist pumpkin spice cake with cream cheese frosting, candied pecans, and warm autumn spices.',
    details: ['Serves 8-10 people', 'Real pumpkin puree', 'Cinnamon, nutmeg, ginger', 'Candied pecan topping', 'Seasonal: Sep-Nov'],
    tags: ['Seasonal', 'Limited Time'],
    rating: 4.8,
    reviews: 78,
    inStock: true,
    prepTime: '12 hours'
  },
  {
    id: 11,
    name: 'Peppermint Chocolate Yule Log',
    category: 'seasonal',
    price: 3080,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-11.jpg`,
    style: 'peppermint',
    description: 'Traditional chocolate roulade with peppermint cream filling, dark chocolate bark, and festive peppermint pieces.',
    details: ['Serves 8-10 people', 'Peppermint cream filling', 'Dark chocolate exterior', 'Peppermint bark decoration', 'Seasonal: Dec only'],
    tags: ['Holiday', 'Limited Time'],
    rating: 4.9,
    reviews: 56,
    inStock: false,
    prepTime: '24 hours'
  },
  {
    id: 12,
    name: 'Matcha Green Tea Layer Cake',
    category: 'specialty',
    price: 3248,
    image: `${process.env.PUBLIC_URL}/images/cakes/cake-12.jpg`,
    style: 'matcha',
    description: 'Delicate matcha sponge with white chocolate matcha buttercream, dusted with premium ceremonial matcha.',
    details: ['Serves 8-10 people', 'Premium Japanese matcha', 'White chocolate matcha frosting', 'Unique flavor profile'],
    tags: ['Unique', 'Premium'],
    rating: 4.7,
    reviews: 31,
    inStock: true,
    prepTime: '24 hours'
  }
];

export const getProductsByCategory = (categoryId) => {
  if (!categoryId || categoryId === 'all') return products;
  return products.filter(p => p.category === categoryId);
};

export const getProductById = (id) => {
  return products.find(p => p.id === parseInt(id));
};

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
};

export const getFeaturedProducts = (limit = 4) => {
  return products
    .filter(p => p.inStock)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getRelatedProducts = (productId, category, limit = 4) => {
  return products
    .filter(p => p.id !== parseInt(productId) && p.category === category && p.inStock)
    .slice(0, limit);
};