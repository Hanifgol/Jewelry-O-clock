import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Pearl & Crystal Ensemble',
    price: 1500000,
    description: 'A luxurious multi-strand pearl necklace and bracelet set accented with gold and crystal spacers. Perfect for grand occasions.',
    category: Category.Sets,
    image: 'https://images.unsplash.com/photo-1620656199806-a24443912190?q=80&w=800&auto=format&fit=crop',
    stock: 5
  },
  {
    id: '2',
    name: 'Butterfly Essence Gold Watch',
    price: 6500000,
    description: 'A statement timepiece in 18k gold featuring a unique butterfly motif on the dial. A blend of precision and poetry.',
    category: Category.Watches,
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800&auto=format&fit=crop',
    stock: 3,
    variants: [
      { id: 'v2-1', name: 'Gold Strap', price: 6500000, stock: 2, options: { "Strap": "Gold" } },
      { id: 'v2-2', name: 'Leather Strap', price: 6200000, stock: 1, options: { "Strap": "Leather" } }
    ]
  },
  {
    id: '3',
    name: 'Pink Amethyst Teardrop Set',
    price: 950000,
    description: 'Vibrant pink amethyst teardrops suspended from a gold vine necklace with matching drop earrings.',
    category: Category.Sets,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
    stock: 8
  },
  {
    id: '4',
    name: 'Halo Diamond Engagement Ring',
    price: 4500000,
    description: 'A breathtaking brilliant-cut diamond surrounded by a double halo of pave stones. Set in platinum.',
    category: Category.Rings,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    stock: 12,
    variants: [
      { id: 'v4-1', name: 'Size 6 - Platinum', price: 4500000, stock: 3, options: { "Size": "6", "Material": "Platinum" } },
      { id: 'v4-2', name: 'Size 7 - Platinum', price: 4500000, stock: 4, options: { "Size": "7", "Material": "Platinum" } },
      { id: 'v4-3', name: 'Size 8 - Platinum', price: 4500000, stock: 0, options: { "Size": "8", "Material": "Platinum" } },
      { id: 'v4-4', name: 'Size 6 - Rose Gold', price: 4200000, stock: 2, options: { "Size": "6", "Material": "Rose Gold" } },
      { id: 'v4-5', name: 'Size 7 - Rose Gold', price: 4200000, stock: 3, options: { "Size": "7", "Material": "Rose Gold" } }
    ]
  },
  {
    id: '5',
    name: 'Sport Elite Chronograph',
    price: 350000,
    description: 'Rugged durability meets modern aesthetics. A black digital-analog hybrid watch for the active lifestyle.',
    category: Category.Watches,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop',
    stock: 20
  },
  {
    id: '6',
    name: 'Pearl & Gold Wire Choker',
    price: 550000,
    description: 'Contemporary minimalist design featuring large south sea pearls on a structured gold wire collar.',
    category: Category.Necklaces,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    stock: 15
  },
  {
    id: '7',
    name: 'Eternal Rose Gift Box',
    price: 250000,
    description: 'The ultimate romantic gesture. A delicate jewelry set presented in a box of everlasting red roses.',
    category: Category.Sets,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    stock: 50
  },
  {
    id: '8',
    name: 'Executive Leather Watch',
    price: 180000,
    description: 'Classic sophistication with a black leather strap and Roman numeral dial. Timeless elegance.',
    category: Category.Watches,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop',
    stock: 10
  }
];
