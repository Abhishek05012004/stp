const mongoose = require("mongoose")
const Product = require("../models/Product")
require("dotenv").config()

const sampleProducts = [
  // Food Items (FOOD001-FOOD015)
  {
    id: "FOOD001",
    name: "Vada Pav",
    price: 25.0,
    image: "/images/food/vada-pav.jpg",
    description: "Mumbai's famous street food - spicy potato fritter in bun",
    category: "Food",
    stock: 50,
  },
  {
    id: "FOOD002",
    name: "Pav Bhaji",
    price: 60.0,
    image: "/images/food/pav-bhaji.jpg",
    description: "Spicy vegetable curry served with buttered bread rolls",
    category: "Food",
    stock: 30,
  },
  {
    id: "FOOD003",
    name: "Dosa",
    price: 45.0,
    image: "/images/food/dosa.jpg",
    description: "Crispy South Indian crepe served with sambar and chutney",
    category: "Food",
    stock: 40,
  },
  {
    id: "FOOD004",
    name: "Biryani",
    price: 120.0,
    image: "/images/food/biryani.jpg",
    description: "Aromatic basmati rice with spiced chicken/mutton",
    category: "Food",
    stock: 25,
  },
  {
    id: "FOOD005",
    name: "Samosa",
    price: 15.0,
    image: "/images/food/samosa.jpg",
    description: "Crispy triangular pastry filled with spiced potatoes",
    category: "Food",
    stock: 100,
  },
  {
    id: "FOOD006",
    name: "Idli Sambar",
    price: 35.0,
    image: "/images/food/idli.jpg",
    description: "Steamed rice cakes served with lentil curry",
    category: "Food",
    stock: 60,
  },
  {
    id: "FOOD007",
    name: "Chole Bhature",
    price: 80.0,
    image: "/images/food/chole.jpg",
    description: "Spicy chickpea curry with fried bread",
    category: "Food",
    stock: 35,
  },
  {
    id: "FOOD008",
    name: "Masala Chai",
    price: 10.0,
    image: "/images/food/chai.jpg",
    description: "Traditional Indian spiced tea",
    category: "Food",
    stock: 200,
  },
  {
    id: "FOOD009",
    name: "Butter Chicken",
    price: 150.0,
    image: "/images/food/butter-chicken.jpg",
    description: "Creamy tomato-based chicken curry",
    category: "Food",
    stock: 20,
  },
  {
    id: "FOOD010",
    name: "Gulab Jamun",
    price: 40.0,
    image: "/images/food/gulab-jamun.jpeg",
    description: "Sweet milk dumplings in sugar syrup",
    category: "Food",
    stock: 80,
  },
  {
    id: "FOOD011",
    name: "Rajma Chawal",
    price: 90.0,
    image: "/images/food/rajma.jpg",
    description: "Kidney bean curry with steamed rice",
    category: "Food",
    stock: 45,
  },
  {
    id: "FOOD012",
    name: "Paneer Tikka",
    price: 180.0,
    image: "/images/food/paneer-tikka.jpg",
    description: "Grilled cottage cheese with spices",
    category: "Food",
    stock: 30,
  },
  {
    id: "FOOD013",
    name: "Aloo Paratha",
    price: 50.0,
    image: "/images/food/paratha.jpg",
    description: "Stuffed potato flatbread with butter",
    category: "Food",
    stock: 70,
  },
  {
    id: "FOOD014",
    name: "Lassi",
    price: 30.0,
    image: "/images/food/lassi.jpg",
    description: "Traditional yogurt-based drink",
    category: "Food",
    stock: 90,
  },
  {
    id: "FOOD015",
    name: "Jalebi",
    price: 35.0,
    image: "/images/food/jalebi.jpeg",
    description: "Sweet spiral-shaped dessert in sugar syrup",
    category: "Food",
    stock: 60,
  },

  // Electronics (ELEC001-ELEC020)
  {
    id: "ELEC001",
    name: "Wireless Bluetooth Headphones",
    price: 2999.0,
    image: "/images/electronics/headphones.jpg",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    stock: 50,
  },
  {
    id: "ELEC002",
    name: "Washing Machine",
    price: 25999.0,
    image: "/images/electronics/washing-machine.jpg",
    description: "Latest AIDD Technology washing machine with 9 kg capacity",
    category: "Electronics",
    stock: 30,
  },
  {
    id: "ELEC003",
    name: "Laptop",
    price: 45999.0,
    image: "/images/electronics/laptop.jpeg",
    description: "14-inch laptop with Intel i5 processor and 8GB RAM",
    category: "Electronics",
    stock: 20,
  },
  {
    id: "ELEC004",
    name: "Smart Watch",
    price: 8999.0,
    image: "/images/electronics/smart-watch.jpeg",
    description: "Fitness tracking smartwatch with heart rate monitor",
    category: "Electronics",
    stock: 40,
  },
  {
    id: "ELEC005",
    name: "Geyser",
    price: 9999.0,
    image: "/images/electronics/geyser.jpg",
    description: "Geyser with 25L capacity and 5-star rating",
    category: "Electronics",
    stock: 60,
  },
  

  // Clothes (CLTH001-CLTH020)
  {
    id: "CLTH001",
    name: "Cotton T-Shirt",
    price: 499.0,
    image: "/images/clothes/t-shirt.jpeg",
    description: "100% cotton casual t-shirt, available in multiple colors",
    category: "Clothes",
    stock: 100,
  },
  {
    id: "CLTH002",
    name: "Denim Jeans",
    price: 1299.0,
    image: "/images/clothes/jeans.jpg",
    description: "Classic blue denim jeans with comfortable fit",
    category: "Clothes",
    stock: 80,
  },
  {
    id: "CLTH003",
    name: "Formal Shirt",
    price: 899.0,
    image: "/images/clothes/formal-shirt.jpeg",
    description: "White formal shirt perfect for office wear",
    category: "Clothes",
    stock: 60,
  },
  {
    id: "CLTH004",
    name: "Hoodie",
    price: 1599.0,
    image: "/images/clothes/hoodie.jpg",
    description: "Warm and comfortable hoodie with front pocket",
    category: "Clothes",
    stock: 50,
  },
  {
    id: "CLTH005",
    name: "Sports Shoes",
    price: 2499.0,
    image: "/images/clothes/sports-shoes.jpg",
    description: "Comfortable running shoes with good grip",
    category: "Clothes",
    stock: 40,
  },
  

  // Books (BOOK001-BOOK015)
  {
    id: "BOOK001",
    name: "Programming in Python",
    price: 599.0,
    image: "/images/books/python-book.jpeg",
    description: "Complete guide to Python programming for beginners",
    category: "Books",
    stock: 40,
  },
  {
    id: "BOOK002",
    name: "Web Development Guide",
    price: 799.0,
    image: "/images/books/web-dev-book.jpg",
    description: "Learn HTML, CSS, and JavaScript from scratch",
    category: "Books",
    stock: 35,
  },
  {
    id: "BOOK003",
    name: "Data Science Handbook",
    price: 899.0,
    image: "/images/books/data-science.jpeg",
    description: "Comprehensive guide to data science and machine learning",
    category: "Books",
    stock: 25,
  },
  {
    id: "BOOK004",
    name: "Business Strategy",
    price: 699.0,
    image: "/images/books/business-book.jpeg",
    description: "Modern business strategies for entrepreneurs",
    category: "Books",
    stock: 30,
  },
  {
    id: "BOOK005",
    name: "Cooking Recipes",
    price: 399.0,
    image: "/images/books/recipe-book.jpg",
    description: "Collection of traditional Indian recipes",
    category: "Books",
    stock: 50,
  },
  {
    id: "BOOK006",
    name: "English Grammar",
    price: 299.0,
    image: "/images/books/grammar-book.jpeg",
    description: "Complete English grammar guide with exercises",
    category: "Books",
    stock: 60,
  },
  {
    id: "BOOK007",
    name: "Mathematics Class 12",
    price: 449.0,
    image: "/images/books/math-book.jpg",
    description: "NCERT Mathematics textbook for class 12",
    category: "Books",
    stock: 45,
  },
  {
    id: "BOOK008",
    name: "Physics Concepts",
    price: 549.0,
    image: "/images/books/physics-book.jpeg",
    description: "Fundamental physics concepts with examples",
    category: "Books",
    stock: 35,
  },
  {
    id: "BOOK009",
    name: "History of India",
    price: 399.0,
    image: "/images/books/history-book.jpeg",
    description: "Complete history of India from ancient to modern times",
    category: "Books",
    stock: 40,
  },
  {
    id: "BOOK010",
    name: "Yoga and Meditation",
    price: 349.0,
    image: "/images/books/yoga-book.jpg",
    description: "Guide to yoga poses and meditation techniques",
    category: "Books",
    stock: 55,
  },
  {
    id: "BOOK011",
    name: "Digital Marketing",
    price: 649.0,
    image: "/images/books/marketing-book.jpg",
    description: "Complete guide to digital marketing strategies",
    category: "Books",
    stock: 30,
  },
  {
    id: "BOOK012",
    name: "Photography Basics",
    price: 499.0,
    image: "/images/books/photo-book.jpg",
    description: "Learn photography from basics to advanced techniques",
    category: "Books",
    stock: 25,
  },
  {
    id: "BOOK013",
    name: "Financial Planning",
    price: 599.0,
    image: "/images/books/finance-book.jpg",
    description: "Personal finance and investment planning guide",
    category: "Books",
    stock: 35,
  },
  {
    id: "BOOK014",
    name: "Motivational Stories",
    price: 299.0,
    image: "/images/books/stories-book.jpg",
    description: "Collection of inspiring and motivational stories",
    category: "Books",
    stock: 70,
  },
  {
    id: "BOOK015",
    name: "Travel Guide India",
    price: 449.0,
    image: "/images/books/travel-book.jpg",
    description: "Complete travel guide to explore India",
    category: "Books",
    stock: 40,
  },

  // Home & Garden (HOME001-HOME015)
  {
    id: "HOME001",
    name: "LED Table Lamp",
    price: 1299.0,
    image: "/images/home/table-lamp.jpeg",
    description: "Adjustable LED table lamp with touch control",
    category: "Home & Garden",
    stock: 45,
  },
  {
    id: "HOME002",
    name: "Coffee Mug Set",
    price: 499.0,
    image: "/images/home/coffee-mugs.jpg",
    description: "Set of 4 ceramic coffee mugs with beautiful designs",
    category: "Home & Garden",
    stock: 60,
  },
  {
    id: "HOME003",
    name: "Indoor Plant Pot",
    price: 299.0,
    image: "/images/home/plant-pot.jpg",
    description: "Decorative ceramic pot perfect for indoor plants",
    category: "Home & Garden",
    stock: 80,
  },
  {
    id: "HOME004",
    name: "Wall Clock",
    price: 899.0,
    image: "/images/home/wall-clock.jpg",
    description: "Modern wall clock with silent movement",
    category: "Home & Garden",
    stock: 35,
  },
  {
    id: "HOME005",
    name: "Bed Sheet Set",
    price: 1599.0,
    image: "/images/home/bed-sheets.jpg",
    description: "Cotton bed sheet set with pillow covers",
    category: "Home & Garden",
    stock: 40,
  },
  {
    id: "HOME006",
    name: "Kitchen Knife Set",
    price: 1199.0,
    image: "/images/home/knife-set.jpg",
    description: "Stainless steel kitchen knife set with wooden block",
    category: "Home & Garden",
    stock: 30,
  },
  
  // Sports & Fitness (SPRT001-SPRT015)
  {
    id: "SPRT001",
    name: "Yoga Mat",
    price: 799.0,
    image: "/images/sports/yoga-mat.jpg",
    description: "Non-slip yoga mat for exercise and meditation",
    category: "Sports & Fitness",
    stock: 50,
  },
  {
    id: "SPRT002",
    name: "Dumbbell Set",
    price: 2499.0,
    image: "/images/sports/dumbbells.jpeg",
    description: "Adjustable dumbbell set for home workouts",
    category: "Sports & Fitness",
    stock: 25,
  },
  {
    id: "SPRT003",
    name: "Cricket Bat",
    price: 1899.0,
    image: "/images/sports/cricket-bat.jpg",
    description: "Professional cricket bat made from English willow",
    category: "Sports & Fitness",
    stock: 20,
  },
  {
    id: "SPRT004",
    name: "Football",
    price: 699.0,
    image: "/images/sports/football.jpg",
    description: "Official size football for outdoor games",
    category: "Sports & Fitness",
    stock: 40,
  },
  {
    id: "SPRT005",
    name: "Water Bottle",
    price: 299.0,
    image: "/images/sports/water-bottle.jpeg",
    description: "Stainless steel water bottle with insulation",
    category: "Sports & Fitness",
    stock: 100,
  },
  
]

const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding process...")

    // Connect to your MongoDB Atlas database
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb+srv://alispatel1112003:eRu2Kpql6QWXajHA@cluster0.cke1m7w.mongodb.net/pin-tap-pay?retryWrites=true&w=majority&appName=Cluster0"

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("✅ Connected to MongoDB Atlas")
    console.log(`📊 Database: ${mongoose.connection.name}`)

    // Check if products already exist
    const existingProducts = await Product.countDocuments()
    console.log(`📦 Existing products in database: ${existingProducts}`)

    if (existingProducts > 0) {
      console.log("⚠️  Products already exist. Clearing existing products...")
      await Product.deleteMany({})
      console.log("🗑️  Cleared existing products")
    }

    // Insert sample products
    console.log("📝 Inserting sample products...")
    const insertedProducts = await Product.insertMany(sampleProducts)
    console.log(`✅ Successfully inserted ${insertedProducts.length} products`)

    // Display inserted products by category
    console.log("\n📋 Inserted Products by Category:")

    const categories = [...new Set(insertedProducts.map((p) => p.category))]
    categories.forEach((category) => {
      console.log(`\n🏷️  ${category}:`)
      const categoryProducts = insertedProducts.filter((p) => p.category === category)
      categoryProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.id} - ${product.name} (₹${product.price})`)
      })
    })

    console.log(`\n📊 Summary:`)
    categories.forEach((category) => {
      const count = insertedProducts.filter((p) => p.category === category).length
      console.log(`   ${category}: ${count} products`)
    })

    console.log("\n🎉 Database seeded successfully!")
    console.log("🔗 You can now test with QR codes/NFC tags:")
    console.log("   Food: FOOD001-FOOD015")
    console.log("   Electronics: ELEC001-ELEC020")
    console.log("   Clothes: CLTH001-CLTH020")
    console.log("   Books: BOOK001-BOOK015")
    console.log("   Home & Garden: HOME001-HOME015")
    console.log("   Sports & Fitness: SPRT001-SPRT015")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error.message)
    process.exit(1)
  }
}

seedDatabase()