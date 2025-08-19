// Comprehensive product data for Mulghai Point - Premium Butcher Shop
export const mockProducts = [
  // CHICKEN PRODUCTS (7 items - removed chicken keema and chicken sausages)
  {
    id: 1,
    name: "Premium Chicken Breast",
    description: "Fresh, tender chicken breast cuts perfect for grilling, roasting, or curry preparations. Skinless and boneless for convenience.",
    category: "chicken",
    pricePerKg: 320,
    image: "https://images.unsplash.com/photo-1682991136736-a2b44623eeba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxjaGlja2VuJTIwY3V0c3xlbnwwfHx8fDE3NTU1OTcyOTN8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.8,
    isNew: true,
    discount: null,
    tags: ["Fresh", "Boneless", "Premium", "Protein Rich", "Grilled"],
    weights: [
      { weight: "250g", price: 80 },
      { weight: "500g", price: 160 },
      { weight: "1kg", price: 320 }
    ]
  },
  {
    id: 2,
    name: "Chicken Thighs - Bone-in",
    description: "Juicy, flavorful chicken thighs with bone for enhanced taste. Perfect for curries, roasts, and traditional preparations.",
    category: "chicken",
    pricePerKg: 280,
    image: "https://images.unsplash.com/photo-1629966207968-16b1027bed09?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxjaGlja2VuJTIwY3V0c3xlbnwwfHx8fDE3NTU1OTcyOTN8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.7,
    isNew: false,
    discount: 10,
    tags: ["Fresh", "Juicy", "Bone-in", "Traditional", "Curry"],
    weights: [
      { weight: "250g", price: 70 },
      { weight: "500g", price: 140 },
      { weight: "1kg", price: 280 }
    ]
  },
  {
    id: 3,
    name: "Chicken Wings",
    description: "Premium chicken wings perfect for BBQ, tandoor, or spicy preparations. Fresh and tender with natural flavor.",
    category: "chicken",
    pricePerKg: 260,
    image: "https://images.unsplash.com/photo-1718421670841-19501b4a9e03?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxjaGlja2VuJTIwY3V0c3xlbnwwfHx8fDE3NTU1OTcyOTN8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.6,
    isNew: false,
    discount: null,
    tags: ["Wings", "BBQ", "Tandoor", "Spicy", "Party"],
    weights: [
      { weight: "250g", price: 65 },
      { weight: "500g", price: 130 },
      { weight: "1kg", price: 260 }
    ]
  },
  {
    id: 4,
    name: "Chicken Drumsticks",
    description: "Fresh chicken drumsticks with skin on for maximum flavor. Great for tandoor, curry, or grilled preparations.",
    category: "chicken",
    pricePerKg: 270,
    image: "https://images.unsplash.com/photo-1690983323238-0b91789e1b5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxyYXclMjBtZWF0fGVufDB8fHx8MTc1NTU5NzMwOHww&ixlib=rb-4.1.0&q=85",
    rating: 4.7,
    isNew: false,
    discount: 5,
    tags: ["Drumsticks", "Skin-on", "Tandoor", "Flavorful"],
    weights: [
      { weight: "250g", price: 68 },
      { weight: "500g", price: 135 },
      { weight: "1kg", price: 270 }
    ]
  },
  {
    id: 5,
    name: "Whole Chicken - Cleaned",
    description: "Fresh whole chicken, cleaned and ready for cooking. Perfect for roasting, curry, or biryani preparations.",
    category: "chicken",
    pricePerKg: 240,
    image: "https://images.unsplash.com/photo-1690983321750-ad6f6d59a84b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxyYXclMjBtZWF0fGVufDB8fHx8MTc1NTU5NzMwOHww&ixlib=rb-4.1.0&q=85",
    rating: 4.8,
    isNew: false,
    discount: null,
    tags: ["Whole", "Cleaned", "Roasting", "Biryani", "Traditional"],
    weights: [
      { weight: "1kg", price: 240 },
      { weight: "1.5kg", price: 360 },
      { weight: "2kg", price: 480 }
    ]
  },
  {
    id: 6,
    name: "Chicken Curry Cut",
    description: "Mixed chicken pieces cut specially for curry preparations. Contains a mix of all parts for authentic taste.",
    category: "chicken",
    pricePerKg: 250,
    image: "https://images.unsplash.com/photo-1690983322025-aab4f95a0269?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxyYXclMjBtZWF0fGVufDB8fHx8MTc1NTU5NzMwOHww&ixlib=rb-4.1.0&q=85",
    rating: 4.6,
    isNew: false,
    discount: null,
    tags: ["Curry", "Mixed", "Traditional", "Home Style", "Bone-in"],
    weights: [
      { weight: "500g", price: 125 },
      { weight: "1kg", price: 250 },
      { weight: "1.5kg", price: 375 }
    ]
  },
  {
    id: 7,
    name: "Chicken Boneless Cubes",
    description: "Premium boneless chicken cut into perfect cubes for tikka, kabab, and stir-fry preparations.",
    category: "chicken",
    pricePerKg: 350,
    image: "https://images.unsplash.com/photo-1613454320437-0c228c8b1723?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxyYXclMjBtZWF0fGVufDB8fHx8MTc1NTU5NzMwOHww&ixlib=rb-4.1.0&q=85",
    rating: 4.9,
    isNew: true,
    discount: null,
    tags: ["Boneless", "Cubes", "Tikka", "Kabab", "Premium"],
    weights: [
      { weight: "250g", price: 88 },
      { weight: "500g", price: 175 },
      { weight: "1kg", price: 350 }
    ]
  },
  {
    id: 8,
    name: "Chicken Liver",
    description: "Fresh chicken liver, rich in iron and vitamins. Perfect for traditional preparations and health-conscious choices.",
    category: "chicken",
    pricePerKg: 180,
    image: "https://images.pexels.com/photos/5490707/pexels-photo-5490707.jpeg",
    rating: 4.4,
    isNew: false,
    discount: null,
    tags: ["Liver", "Iron Rich", "Healthy", "Traditional", "Vitamins"],
    weights: [
      { weight: "250g", price: 45 },
      { weight: "500g", price: 90 },
      { weight: "1kg", price: 180 }
    ]
  },

  // MUTTON PRODUCTS (4 items - removed mutton ribs)
  {
    id: 11,
    name: "Mutton Leg - Premium Cut",
    description: "Premium mutton leg pieces, tender and flavorful. Perfect for special occasions and traditional biryanis.",
    category: "mutton",
    pricePerKg: 650,
    image: "https://images.unsplash.com/photo-1717980651515-7796a793002f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxtdXR0b258ZW58MHx8fHwxNzU1NTk3MzAzfDA&ixlib=rb-4.1.0&q=85",
    rating: 4.9,
    isNew: false,
    discount: null,
    tags: ["Premium", "Leg", "Tender", "Biryani", "Special"],
    weights: [
      { weight: "500g", price: 325 },
      { weight: "1kg", price: 650 },
      { weight: "1.5kg", price: 975 }
    ]
  },
  {
    id: 12,
    name: "Mutton Shoulder - Bone-in",
    description: "Fresh mutton shoulder with bone, perfect for slow-cooked curries and traditional preparations.",
    category: "mutton",
    pricePerKg: 620,
    image: "https://images.pexels.com/photos/112781/pexels-photo-112781.jpeg",
    rating: 4.7,
    isNew: false,
    discount: 8,
    tags: ["Shoulder", "Bone-in", "Slow-cook", "Curry", "Traditional"],
    weights: [
      { weight: "500g", price: 310 },
      { weight: "1kg", price: 620 },
      { weight: "1.5kg", price: 930 }
    ]
  },
  {
    id: 13,
    name: "Mutton Keema",
    description: "Fresh minced mutton, perfect for keema curry, kababs, and authentic Lucknowi preparations.",
    category: "mutton",
    pricePerKg: 580,
    image: "https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg",
    rating: 4.8,
    isNew: false,
    discount: null,
    tags: ["Keema", "Minced", "Kabab", "Lucknowi", "Authentic"],
    weights: [
      { weight: "250g", price: 145 },
      { weight: "500g", price: 290 },
      { weight: "1kg", price: 580 }
    ]
  },
  {
    id: 15,
    name: "Mutton Boneless",
    description: "Premium boneless mutton pieces, carefully cleaned and cut. Perfect for quick cooking and modern preparations.",
    category: "mutton",
    pricePerKg: 720,
    image: "https://images.unsplash.com/photo-1659881981676-33ab127152c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxtZWF0JTIwcHJvZHVjdHN8ZW58MHx8fHwxNzU1NTk3Mjk4fDA&ixlib=rb-4.1.0&q=85",
    rating: 4.9,
    isNew: true,
    discount: 5,
    tags: ["Boneless", "Premium", "Quick Cook", "Modern", "Clean"],
    weights: [
      { weight: "250g", price: 180 },
      { weight: "500g", price: 360 },
      { weight: "1kg", price: 720 }
    ]
  },

  // FISH PRODUCTS (existing ones - keeping for variety)
  {
    id: 16,
    name: "Fresh Pomfret",
    description: "Fresh pomfret fish, cleaned and ready to cook. Perfect for Bengali fish curry and fried preparations.",
    category: "fish",
    pricePerKg: 450,
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    isNew: false,
    discount: null,
    tags: ["Fish", "Fresh", "Pomfret", "Bengali", "Curry"],
    weights: [
      { weight: "250g", price: 113 },
      { weight: "500g", price: 225 },
      { weight: "1kg", price: 450 }
    ]
  },

  // PROCESSED ITEMS
  {
    id: 17,
    name: "Chicken Seekh Kebab",
    description: "Ready-to-cook chicken seekh kebabs with traditional spices and herbs. Just grill and serve.",
    category: "processed",
    pricePerKg: 420,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    isNew: true,
    discount: 10,
    tags: ["Kebab", "Ready-to-cook", "Spiced", "Grilled", "Party"],
    weights: [
      { weight: "250g", price: 105 },
      { weight: "500g", price: 210 },
      { weight: "1kg", price: 420 }
    ]
  }
];

// Service areas with pincodes
export const serviceablePincodes = {
  "144411": "LPU Campus (Chaheru, Phagwara)",
  "144402": "LPU vicinity / Law Gate / General LPU", 
  "144401": "Phagwara city and surrounding areas",
  "144407": "Nearby locality: Domeli"
};

// WhatsApp message templates with emojis
export const whatsappTemplates = {
  orderMessage: (cart, customerDetails, total) => {
    const itemsList = cart.map(item => 
      `🥩 ${item.name} (${item.weight}) - ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}`
    ).join('\n');
    
    return `🛒 *NEW ORDER FROM MULGHAI POINT* 🛒

👤 *Customer Details:*
📞 Name: ${customerDetails.name}
📱 Phone: ${customerDetails.phone}
📍 Address: ${customerDetails.address}
📮 Pincode: ${customerDetails.pincode}

🥩 *Order Details:*
${itemsList}

💰 *Total Amount: ₹${total}*

⏰ *Order Time:* ${new Date().toLocaleString()}

✅ Please confirm this order and provide delivery time.

🚚 Thank you for choosing Mulghai Point! 
🐓 Fresh • Premium • Hygienic Quality 🐓`;
  },
  
  customerConfirmation: (orderDetails) => {
    return `🎉 Thank you for your order! 🎉

Your order has been received and will be prepared with utmost care.

🕐 Expected delivery time: 45-60 minutes
📞 For any queries, call: 6284307484

✅ 100% Fresh | 🚚 Fast Delivery | 🧼 Hygienic | 🐓 Antibiotic-Free

Mulghai Point - Premium Fresh Meat 🥩`;
  },
  
  quickOrder: `🛒 Hi Mulghai Point! 

I would like to place a quick order:

📱 Phone: 
📍 Address: 
🥩 Items: 

Please confirm availability and delivery time. Thank you! 🐓`,
  
  inquiry: `👋 Hello Mulghai Point!

I have a question about:
🥩 Product availability
🚚 Delivery areas  
💰 Pricing
⏰ Order timing

Please assist me. Thank you! 🙏`
};