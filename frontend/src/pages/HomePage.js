import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Phone, Clock, Award, Truck, MapPin, Star, Menu, X, Home, Package, Info, Users } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
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

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-black/80 to-purple-900/80 backdrop-blur-md shadow-2xl sticky top-0 z-40 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Mulghai Point
                </h1>
                <p className="text-sm text-orange-300">Premium Fresh Meat</p>
              </div>
            </div>
            
            {/* Enhanced Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-300 w-5 h-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Search for chicken, mutton, fish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-black/40 border-2 border-orange-500/30 rounded-full text-white placeholder-gray-400 focus:border-orange-500 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a 
                href="tel:7986955634"
                className="hidden md:flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors duration-300 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">7986955634</span>
              </a>
              
              <Button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full animate-pulse">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-20"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-300 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for chicken, mutton, fish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-black/40 border-2 border-orange-500/30 rounded-full text-white placeholder-gray-400 focus:border-orange-500 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-purple-500/20">
              <div className="flex flex-col space-y-3">
                <Button variant="ghost" onClick={() => scrollToSection('home')} className="text-left justify-start text-orange-300 hover:text-orange-200 hover:bg-orange-500/10">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button variant="ghost" onClick={() => scrollToSection('products')} className="text-left justify-start text-orange-300 hover:text-orange-200 hover:bg-orange-500/10">
                  <Package className="w-4 h-4 mr-2" />
                  Products
                </Button>
                <Button variant="ghost" onClick={() => scrollToSection('about')} className="text-left justify-start text-orange-300 hover:text-orange-200 hover:bg-orange-500/10">
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Button>
                <Button variant="ghost" onClick={() => scrollToSection('contact')} className="text-left justify-start text-orange-300 hover:text-orange-200 hover:bg-orange-500/10">
                  <Users className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section with Background */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=2000&q=80"
            alt="Premium meat background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/70 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-red-500/10 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
              Premium Fresh Meat
            </h2>
            <p className="text-xl md:text-3xl mb-8 text-gray-200 opacity-90">
              Farm-fresh quality delivered to your doorstep
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('products')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 border-0"
              >
                Shop Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open('https://wa.me/917986955634', '_blank')}
                className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white backdrop-blur-sm bg-black/20 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </Button>
            </div>

            {/* Enhanced Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Clock className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Fresh Daily</h3>
                <p className="text-gray-300">Delivered fresh every day</p>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Truck className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
                <p className="text-gray-300">Quick and reliable service</p>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Award className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Premium Quality</h3>
                <p className="text-gray-300">Hand-selected finest cuts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories */}
      <section className="py-8 bg-gradient-to-r from-black/90 to-purple-900/90 backdrop-blur-md border-y border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 shadow-lg" 
                    : "border-2 border-orange-500/50 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400 bg-black/30 backdrop-blur-sm"
                } transition-all duration-300 transform hover:scale-105 rounded-full px-6 py-3`}
              >
                {category.name}
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${
                    selectedCategory === category.id 
                      ? "bg-white/20 text-white" 
                      : "bg-orange-500/20 text-orange-200"
                  }`}
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section id="products" className="py-16 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Our Fresh Products
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Hand-picked premium quality meat, sourced from trusted farms and delivered fresh to your door
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-md rounded-2xl p-12 border border-purple-500/20">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-xl">No products found matching your search.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 bg-gradient-to-br from-black/60 to-purple-900/60 backdrop-blur-md border-2 border-purple-500/20 hover:border-orange-500/50 cursor-pointer transform hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {product.isNew && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-3 py-1 rounded-full animate-pulse">
                        New
                      </Badge>
                    )}
                    {product.discount && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-3 py-1 rounded-full">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors duration-300">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center space-x-1 bg-yellow-500/20 rounded-full px-2 py-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-yellow-300 font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="text-sm text-gray-300 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                          ₹{product.pricePerKg}/kg
                        </p>
                        <p className="text-xs text-gray-400">Starting from ₹{Math.round(product.pricePerKg * 0.25)}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 rounded-full py-3 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
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

      {/* Enhanced About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-purple-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Why Choose Mulghai Point?
              </h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 transform group-hover:scale-110">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-semibold text-white mb-3">Premium Quality</h4>
                    <p className="text-gray-300 leading-relaxed">Hand-selected from trusted farms, ensuring the highest quality and freshness for every cut.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 group">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 transform group-hover:scale-110">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-semibold text-white mb-3">Fast Delivery</h4>
                    <p className="text-gray-300 leading-relaxed">Quick and reliable delivery to keep your meat fresh and your meals on schedule.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 group">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 transform group-hover:scale-110">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-semibold text-white mb-3">Local & Fresh</h4>
                    <p className="text-gray-300 leading-relaxed">Sourced from local farms, supporting our community while ensuring maximum freshness.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80"
                alt="Fresh meat display"
                className="relative rounded-3xl shadow-2xl w-full transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer id="contact" className="bg-gradient-to-r from-black to-purple-900 text-white py-16 border-t border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Mulghai Point</h4>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">Your trusted partner for premium fresh meat delivery.</p>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-full px-4 py-3 border border-orange-500/20">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-orange-300 font-medium">7986955634</span>
              </div>
            </div>
            
            <div>
              <h5 className="text-xl font-semibold mb-6 text-orange-400">Quick Links</h5>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('products')} className="text-gray-300 hover:text-orange-400 transition-colors duration-300">Products</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-orange-400 transition-colors duration-300">About Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-orange-400 transition-colors duration-300">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-xl font-semibold mb-6 text-orange-400">Delivery Areas</h5>
              <ul className="space-y-3 text-gray-300">
                <li className="bg-gradient-to-r from-purple-500/10 to-orange-500/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/20">LPU Campus & Vicinity</li>
                <li className="bg-gradient-to-r from-purple-500/10 to-orange-500/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/20">Phagwara City</li>
                <li className="bg-gradient-to-r from-purple-500/10 to-orange-500/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/20">Domeli & Surrounding Areas</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-500/20 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Mulghai Point. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-black/95 to-purple-900/95 backdrop-blur-md border-t border-purple-500/20 z-30">
        <div className="flex justify-around py-3">
          <button
            onClick={() => scrollToSection('home')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
              activeSection === 'home' 
                ? 'text-orange-400 bg-orange-500/20' 
                : 'text-gray-400 hover:text-orange-300'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => scrollToSection('products')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
              activeSection === 'products' 
                ? 'text-orange-400 bg-orange-500/20' 
                : 'text-gray-400 hover:text-orange-300'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs font-medium">Products</span>
          </button>
          
          <button
            onClick={() => scrollToSection('about')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
              activeSection === 'about' 
                ? 'text-orange-400 bg-orange-500/20' 
                : 'text-gray-400 hover:text-orange-300'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-xs font-medium">About</span>
          </button>
          
          <button
            onClick={() => scrollToSection('contact')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
              activeSection === 'contact' 
                ? 'text-orange-400 bg-orange-500/20' 
                : 'text-gray-400 hover:text-orange-300'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Contact</span>
          </button>
        </div>
      </div>

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
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-2xl hover:shadow-green-500/25 animate-pulse border-0 p-4"
          onClick={() => window.open('https://wa.me/917986955634?text=Hi%20Mulghai%20Point,%20I%20need%20help%20with%20my%20order!', '_blank')}
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;