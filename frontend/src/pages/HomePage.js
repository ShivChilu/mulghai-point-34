import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Phone, Clock, Award, Truck, MapPin, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';
import CheckoutModal from '../components/CheckoutModal';
import { mockProducts } from '../data/mockData';

const HomePage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'All Items', count: products.length },
    { id: 'chicken', name: 'Chicken', count: products.filter(p => p.category === 'chicken').length },
    { id: 'mutton', name: 'Mutton', count: products.filter(p => p.category === 'mutton').length },
    { id: 'fish', name: 'Fish & Seafood', count: products.filter(p => p.category === 'fish').length },
    { id: 'processed', name: 'Processed Items', count: products.filter(p => p.category === 'processed').length }
  ];

  const serviceablePincodes = {
    "144411": "LPU Campus (Chaheru, Phagwara)",
    "144402": "LPU vicinity / Law Gate / General LPU",
    "144401": "Phagwara city and surrounding areas",
    "144407": "Nearby locality: Domeli"
  };

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

  const filterProducts = () => {
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product, weight, price) => {
    const cartItem = {
      id: `${product.id}-${weight}`,
      productId: product.id,
      name: product.name,
      weight,
      price,
      quantity: 1,
      image: product.image
    };

    const existingItem = cart.find(item => item.id === cartItem.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === cartItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, cartItem]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} (${weight}) added successfully`,
    });
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40 border-b border-amber-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-2 rounded-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mulghai Point</h1>
                <p className="text-sm text-amber-600">Premium Fresh Meat</p>
              </div>
            </div>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for chicken, mutton, fish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-amber-200 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a 
                href="tel:7986955634"
                className="hidden md:flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">7986955634</span>
              </a>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for chicken, mutton, fish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Fresh Meat
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Farm-fresh quality delivered to your doorstep
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-white text-amber-600 hover:bg-amber-50 font-semibold"
                onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600"
                onClick={() => window.open('https://wa.me/917986955634', '_blank')}
              >
                WhatsApp Order
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6" />
                <span className="text-lg">Fresh Daily</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Truck className="w-6 h-6" />
                <span className="text-lg">Fast Delivery</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Award className="w-6 h-6" />
                <span className="text-lg">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-amber-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? "bg-amber-600 hover:bg-amber-700 text-white" 
                    : "border-amber-200 text-amber-700 hover:bg-amber-50"
                }`}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Fresh Products</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked premium quality meat, sourced from trusted farms and delivered fresh to your door
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-xl transition-all duration-300 border-amber-100 hover:border-amber-300 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                        New
                      </Badge>
                    )}
                    {product.discount && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-600">₹{product.pricePerKg}/kg</p>
                        <p className="text-xs text-gray-500">Starting from ₹{Math.round(product.pricePerKg * 0.25)}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                    >
                      Select Weight
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Mulghai Point?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Premium Quality</h4>
                    <p className="text-gray-600">Hand-selected from trusted farms, ensuring the highest quality and freshness.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Truck className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h4>
                    <p className="text-gray-600">Quick and reliable delivery to keep your meat fresh and your meals on schedule.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Local & Fresh</h4>
                    <p className="text-gray-600">Sourced from local farms, supporting our community while ensuring maximum freshness.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80"
                alt="Fresh meat display"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-2 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold">Mulghai Point</h4>
              </div>
              <p className="text-gray-400 mb-4">Your trusted partner for premium fresh meat delivery.</p>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>7986955634</span>
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Delivery Areas</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>LPU Campus & Vicinity</li>
                <li>Phagwara City</li>
                <li>Domeli & Surrounding Areas</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mulghai Point. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        getCartTotal={getCartTotal}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        cartTotal={getCartTotal()}
        serviceablePincodes={serviceablePincodes}
        onOrderComplete={() => {
          setCart([]);
          setIsCheckoutOpen(false);
          toast({
            title: "Order Sent!",
            description: "Your order has been sent via WhatsApp. We'll confirm shortly.",
          });
        }}
      />

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg animate-pulse"
          onClick={() => window.open('https://wa.me/917986955634?text=Hi%20Mulghai%20Point,%20I%20need%20help%20with%20my%20order!', '_blank')}
        >
          <Phone className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;