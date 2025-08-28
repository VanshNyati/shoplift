import { connectDB } from '../db/mongoose';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

async function run() {
  await connectDB();

  await Category.deleteMany({});
  await Product.deleteMany({});

  const cats = await Category.insertMany([
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home', slug: 'home' },
  ]);

  const [electronics, fashion, home] = cats;

  await Product.insertMany([
  {
    title: 'Wireless Headphones',
    description: 'Comfortable over-ear, 30h battery, BT 5.3',
    price: 4999, // ₹4,999
    imageUrl: 'https://images.unsplash.com/photo-1518443801921-529f04b6fa77?q=80&w=800',
    categoryId: electronics._id
  },
  {
    title: 'Casual T-Shirt',
    description: '100% cotton, breathable fabric',
    price: 799, // ₹799
    imageUrl: 'https://images.unsplash.com/photo-1520975922284-9a98f56a2366?q=80&w=800',
    categoryId: fashion._id
  },
  {
    title: 'Ceramic Mug',
    description: 'Dishwasher-safe, 350ml',
    price: 299, // ₹299
    imageUrl: 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=800',
    categoryId: home._id
  }
]);


  console.log('✅ Seeded categories & products');
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
