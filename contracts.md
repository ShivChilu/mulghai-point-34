# Mulghai Point - API Contracts and Implementation Plan

## Overview
This document outlines the API contracts, data structure, and implementation plan for transitioning from mock data to a fully functional backend for Mulghai Point meat delivery application.

## Current Mock Data Structure

### Products Schema
```javascript
{
  id: Number,
  name: String,
  description: String,
  category: String, // 'chicken', 'mutton', 'fish', 'processed'
  pricePerKg: Number,
  image: String, // URL
  rating: Number,
  isNew: Boolean,
  discount: Number, // percentage
  tags: Array[String],
  weights: Array[{
    weight: String, // '250g', '500g', '1kg'
    price: Number
  }],
  nutritionalInfo: {
    protein: String,
    fat: String,
    calories: String
  },
  benefits: Array[String],
  cookingTips: Array[String]
}
```

### Cart Item Schema
```javascript
{
  id: String, // `${productId}-${weight}`
  productId: Number,
  name: String,
  weight: String,
  price: Number,
  quantity: Number,
  image: String
}
```

### Order Schema
```javascript
{
  id: String,
  customerName: String,
  phone: String,
  address: String,
  pincode: String,
  instructions: String,
  items: Array[CartItem],
  subtotal: Number,
  deliveryCharge: Number,
  total: Number,
  status: String, // 'pending', 'confirmed', 'preparing', 'delivered'
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Required

### Products API
- `GET /api/products` - Get all products with optional filters
  - Query params: `category`, `search`, `page`, `limit`
  - Response: `{ products: Product[], total: Number, page: Number }`

- `GET /api/products/:id` - Get single product details
  - Response: `{ product: Product }`

- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders API
- `POST /api/orders` - Create new order
  - Body: Order schema without id, status, timestamps
  - Response: `{ order: Order, whatsappUrl: String }`

- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

### Utility API
- `POST /api/check-pincode` - Check if pincode is serviceable
  - Body: `{ pincode: String }`
  - Response: `{ serviceable: Boolean, area: String }`

## Database Schema (MongoDB)

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  pricePerKg: Number,
  image: String,
  rating: Number,
  isNew: Boolean,
  discount: Number,
  tags: [String],
  weights: [{
    weight: String,
    price: Number
  }],
  nutritionalInfo: {
    protein: String,
    fat: String,
    calories: String
  },
  benefits: [String],
  cookingTips: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  orderNumber: String, // Auto-generated unique ID
  customerName: String,
  phone: String,
  address: String,
  pincode: String,
  instructions: String,
  items: [{
    productId: ObjectId,
    name: String,
    weight: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: Number,
  deliveryCharge: Number,
  total: Number,
  status: String,
  whatsappSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ServiceAreas Collection
```javascript
{
  _id: ObjectId,
  pincode: String,
  area: String,
  deliveryCharge: Number,
  isActive: Boolean
}
```

## Frontend-Backend Integration Points

### 1. Product Listing Page
- **Current**: Uses `mockProducts` from `mockData.js`
- **Backend**: Replace with API call to `/api/products`
- **Implementation**: Update `HomePage.js` to fetch products from API

### 2. Product Search & Filtering
- **Current**: Client-side filtering of mock data
- **Backend**: Server-side filtering with database queries
- **Implementation**: Update search/filter functions to make API calls

### 3. Cart Management
- **Current**: Local state management with localStorage
- **Backend**: Optional cart persistence (can remain client-side)
- **Implementation**: Keep current approach or add user sessions

### 4. Order Placement
- **Current**: Direct WhatsApp integration with formatted message
- **Backend**: Save order to database, then send WhatsApp
- **Implementation**: Update `CheckoutModal.js` to POST order to API

### 5. Pincode Validation
- **Current**: Hardcoded serviceable pincodes object
- **Backend**: Database-driven service area management
- **Implementation**: Replace hardcoded data with API call

## Mock Data Migration Plan

### Phase 1: Basic CRUD Operations
1. Create Product model with Mongoose schema
2. Seed database with current mock product data
3. Implement GET /api/products endpoint
4. Update frontend to fetch from API instead of mock data

### Phase 2: Order Management
1. Create Order model and API endpoints
2. Update checkout process to save orders to database
3. Maintain WhatsApp integration for order notifications
4. Add order status tracking

### Phase 3: Admin Features
1. Create admin interface for product management
2. Implement order management dashboard
3. Add service area management
4. Implement analytics and reporting

## WhatsApp Integration Enhancement

### Current Format
```
🛒 NEW ORDER 🛒

*Customer Details:*
Name: John Doe
Phone: 9876543210
Address: LPU Campus
Pincode: 144411

*Order Items:*
• Premium Chicken Breast (500g) × 2 = ₹320

*Order Summary:*
Subtotal: ₹320
Delivery Charge: ₹0
*Total Amount: ₹320*
Payment: Cash on Delivery
```

### Enhanced Format (with order tracking)
```
🛒 NEW ORDER #MP001234 🛒

*Customer Details:*
Name: John Doe
Phone: 9876543210
Address: LPU Campus, Room 123
Pincode: 144411 (LPU Campus)

*Order Items:*
• Premium Chicken Breast (500g) × 2 = ₹320

*Order Summary:*
Subtotal: ₹320
Delivery: FREE (Above ₹500)
*Total: ₹320*

Order Link: https://mulghai-point.com/orders/MP001234
Reply with CONFIRM to accept this order.
```

## Testing Strategy

### Frontend Testing
- Test product listing and filtering
- Test cart functionality
- Test checkout process
- Test responsive design
- Test WhatsApp integration

### Backend Testing
- Unit tests for all API endpoints
- Integration tests for database operations
- Test order creation and WhatsApp formatting
- Test pincode validation
- Load testing for concurrent orders

## Deployment Considerations

### Database Setup
- MongoDB Atlas for production
- Proper indexing for search functionality
- Backup and restore procedures

### API Security
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Error handling and logging

### Performance Optimization
- Image optimization and CDN
- Database query optimization
- Caching for frequently accessed data
- Lazy loading for product images

## Future Enhancements

1. **User Authentication**: Customer accounts and order history
2. **Payment Integration**: Online payment options
3. **Real-time Updates**: WebSocket for order status updates
4. **Inventory Management**: Stock tracking and low stock alerts
5. **Delivery Tracking**: GPS-based delivery tracking
6. **Customer Reviews**: Product ratings and reviews system
7. **Bulk Orders**: Support for large quantity orders
8. **Subscription Service**: Regular delivery subscriptions