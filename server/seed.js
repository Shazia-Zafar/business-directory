require("dotenv").config();
const mongoose = require("mongoose");
const Business = require("./models/Business");

const sampleBusinesses = [
  {
    name: "Maple & Rye Bakery",
    owner: "Dana Coelho",
    category: "Food",
    city: "Riverton",
    tagline: "Sourdough baked fresh every morning, no exceptions.",
    website: "https://mapleandrye.example.com",
    email: "hello@mapleandrye.example.com",
  },
  {
    name: "Thread & Needle Studio",
    owner: "Priya Anand",
    category: "Fashion",
    city: "Riverton",
    tagline: "Custom tailoring and alterations, done right the first time.",
    website: "https://threadandneedle.example.com",
    email: "studio@threadandneedle.example.com",
  },
  {
    name: "ByteWorks Repair",
    owner: "Marcus Lee",
    category: "Tech",
    city: "Fairview",
    tagline: "Phone and laptop repairs while you wait.",
    website: "https://byteworks.example.com",
    email: "fix@byteworks.example.com",
  },
  {
    name: "Clearwater Physio",
    owner: "Dr. Amina Yusuf",
    category: "Health",
    city: "Fairview",
    tagline: "Sports injury recovery with a plan built around you.",
    website: "https://clearwaterphysio.example.com",
    email: "care@clearwaterphysio.example.com",
  },
  {
    name: "Riverton Coding Club",
    owner: "Sam Ortiz",
    category: "Education",
    city: "Riverton",
    tagline: "Evening classes to get your first app off the ground.",
    website: "https://ritoncoding.example.com",
    email: "info@ritoncoding.example.com",
  },
  {
    name: "Greenline Landscaping",
    owner: "Tomas Brenner",
    category: "Services",
    city: "Hillcrest",
    tagline: "Lawns, hedges, and everything in between.",
    website: "https://greenlinelandscaping.example.com",
    email: "quotes@greenlinelandscaping.example.com",
  },
  {
    name: "Corner Shelf Books",
    owner: "Eleanor Park",
    category: "Retail",
    city: "Hillcrest",
    tagline: "New and secondhand books, plus a very good reading nook.",
    website: "https://cornershelf.example.com",
    email: "shop@cornershelf.example.com",
  },
  {
    name: "Fairview Dog Wash",
    owner: "Jules Renner",
    category: "Other",
    city: "Fairview",
    tagline: "Self-serve wash stations and full grooming, no appointment needed.",
    website: "https://fairviewdogwash.example.com",
    email: "woof@fairviewdogwash.example.com",
  },
  {
    name: "Pico de Gallo Taqueria",
    owner: "Rosa Delgado",
    category: "Food",
    city: "Hillcrest",
    tagline: "Family recipes, made fresh, served fast.",
    website: "https://picodegallo.example.com",
    email: "orders@picodegallo.example.com",
  },
  {
    name: "Summit Tutoring",
    owner: "Nadia Farrow",
    category: "Education",
    city: "Riverton",
    tagline: "One-on-one math and science tutoring for grades 6-12.",
    website: "https://summittutoring.example.com",
    email: "book@summittutoring.example.com",
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env — see server/README.md");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Business.deleteMany({});
    console.log("Cleared existing businesses");

    await Business.insertMany(sampleBusinesses);
    console.log(`Seeded ${sampleBusinesses.length} businesses`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
