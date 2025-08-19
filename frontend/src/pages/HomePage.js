import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Phone, Clock, Award, Truck, MapPin, Sparkles, Drumstick, Shield, Leaf, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';
import CheckoutModal from '../components/CheckoutModal';
import MobileBottomNav from '../components/MobileBottomNav';
import { mockProducts, whatsappTemplates } from '../data/mockData';

const HomePage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showIntro, setShowIntro] = useState(true);
  const [titleText, setTitleText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 1400);
    return () => clearTimeout(t);
  }, []);

  // Enhanced typewriter effect
  useEffect(() => {
    const phrases = ['Fresh Meat', 'Premium Cuts', 'Quality First', 'Fresh Meat'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer;

    const typeWriter = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        setTitleText(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        timer = setTimeout(typeWriter, 50);
      } else {
        setTitleText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          timer = setTimeout(typeWriter, 1500);
        } else {
          timer = setTimeout(typeWriter, 100);
        }
      }
    };
    typeWriter();
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', count: products.length, icon: '🥩' },
    { id: 'chicken', name: 'Chicken', count: products.filter(p => p.category === 'chicken').length, icon: '🐓' },
    { id: 'mutton', name: 'Mutton', count: products.filter(p => p.category === 'mutton').length, icon: '🐑' },
    { id: 'fish', name: 'Fish & Seafood', count: products.filter(p => p.category === 'fish').length, icon: '🐟' },
    { id: 'processed', name: 'Processed Items', count: products.filter(p => p.category === 'processed').length, icon: '🍖' }
  ];

  const serviceablePincodes = {
    "144411": "LPU Campus (Chaheru, Phagwara)",
    "144402": "LPU vicinity / Law Gate / General LPU",
    "144401": "Phagwara city and surrounding areas",
    "144407": "Nearby locality: Domeli"
  };

  useEffect(() => { filterProducts(); }, [selectedCategory, searchQuery, products]);

  const filterProducts = () => {
    let filtered = products;
    if (selectedCategory !== 'all') filtered = filtered.filter(product => product.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.tags.some(tag => tag.toLowerCase().includes(q))
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
      setCart(cart.map(item => item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, cartItem]);
    }
    
    toast({ 
      title: 'Added to Cart 🛒', 
      description: `${product.name} (${weight}) added successfully!` 
    });
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) setCart(cart.filter(item => item.id !== itemId));
    else setCart(cart.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    
    // Special handling for home section
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'products', 'about', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const SearchBox = ({ mobile = false }) => (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/70 w-5 h-5 z-10" />
      <Input
        type="text"
        placeholder="Search chicken, mutton, fish..."
        value={searchQuery}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-12 pr-4 py-3 bg-white/90 border border-amber-200 rounded-full text-slate-700 placeholder-slate-400 focus:border-amber-400 focus:ring-0 backdrop-blur-sm transition-all duration-300"
      />
    </div>
  );

  return (
    <div className="min-h-screen transition-all duration-500" 
         style={{ 
           background: 'linear-gradient(135deg, #fefaf6 0%, #fff8f0 50%, #fef3e2 100%)'
         }}>
      
      {/* Intro Splash */}
      {showIntro && (
        <div className="fixed inset-0 z-[60] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
          <div className="splash-enter text-center">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-2xl logo-glow">
              <Drumstick className="w-10 h-10 text-white" />
            </div>
            <h1 className="mt-6 text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent butcher-title">
              Mulghai Point
            </h1>
            <p className="text-amber-600/80 mt-2 premium-text">Premium Fresh Meat</p>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <header className="bg-white/85 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-amber-100 wood-texture">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-3 rounded-2xl shadow-lg hover-rotate logo-glow">
                <Drumstick className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent butcher-title">
                  Mulghai Point
                </h1>
                <p className="text-sm text-amber-600/80 premium-text flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Premium Fresh Meat
                </p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBox />
            </div>

            <div className="flex items-center space-x-3">
              {/* Phone Number - Desktop */}
              <a 
                href="tel:6284307484" 
                className="hidden md:flex items-center space-x-2 text-amber-700 hover:text-amber-800 transition-colors px-4 py-2 rounded-full bg-amber-50 hover-lift"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">6284307484</span>
              </a>

              {/* Cart Button */}
              <Button 
                onClick={() => setIsCartOpen(true)} 
                className="relative btn-premium rounded-full px-6 py-3 shadow-lg hover-lift"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline font-semibold">Cart</span>
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-400 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full animate-pulse border-2 border-white shadow-lg font-bold">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <SearchBox mobile />
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* HD Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1690983320937-ca293f1d1d97" 
            alt="Premium fresh meat cuts and steaks" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50"></div>
        </div>

        {/* Floating Animation Elements */}
        <div className="particles">
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
        </div>

        {/* Enhanced Content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="reveal-up text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-white butcher-title mobile-title" 
                style={{textShadow:'0 4px 20px rgba(0,0,0,0.8)'}}>
              {titleText}<span className="caret animate-pulse">|</span>
            </h2>
            
            <p className="reveal-up mb-8" style={{animationDelay:'300ms'}}>
              <span className="inline-block bg-white/95 text-amber-900 rounded-full px-6 py-3 shadow-lg ring-2 ring-amber-300 hover-glow premium-text font-semibold">
                🥩 Farm-fresh quality delivered to your doorstep 🚚
              </span>
            </p>

            {/* Feature Icons Row */}
            <div className="reveal-up mb-12" style={{animationDelay:'500ms'}}>
              <div className="flex justify-center items-center gap-6 md:gap-8 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-medium text-sm">100% Fresh</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="text-white font-medium text-sm">Hygienic</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <Leaf className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium text-sm">Antibiotic-Free</span>
                </div>
              </div>
            </div>

            <div className="reveal-up flex flex-col sm:flex-row justify-center gap-4 mb-16" style={{animationDelay:'700ms'}}>
              <Button 
                size="lg" 
                onClick={() => scrollToSection('products')} 
                className="btn-premium font-bold px-10 py-4 rounded-full shadow-xl text-lg hover-lift"
              >
                🛒 Shop Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => window.open(`https://wa.me/916284307484?text=${encodeURIComponent(whatsappTemplates.inquiry)}`, '_blank')} 
                className="border-2 border-white text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-10 py-4 rounded-full font-bold text-lg hover-lift"
              >
                💬 WhatsApp Us
              </Button>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="scale-in product-card bg-white/95 rounded-2xl p-4 md:p-6 backdrop-blur-sm hover-lift mobile-card" style={{animationDelay:'900ms'}}>
                <Clock className="w-8 h-8 md:w-10 md:h-10 text-amber-600 mx-auto mb-3 md:mb-4 float-1" />
                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 butcher-title">Fresh Daily</h3>
                <p className="text-slate-600 text-sm md:text-base">Delivered fresh every day from trusted farms</p>
              </div>
              
              <div className="scale-in product-card bg-white/95 rounded-2xl p-4 md:p-6 backdrop-blur-sm hover-lift mobile-card" style={{animationDelay:'1100ms'}}>
                <Truck className="w-8 h-8 md:w-10 md:h-10 text-amber-600 mx-auto mb-3 md:mb-4 float-2" />
                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 butcher-title">Fast Delivery</h3>
                <p className="text-slate-600 text-sm md:text-base">Quick and reliable service within 60 minutes</p>
              </div>
              
              <div className="scale-in product-card bg-white/95 rounded-2xl p-4 md:p-6 backdrop-blur-sm hover-lift mobile-card" style={{animationDelay:'1300ms'}}>
                <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-600 mx-auto mb-3 md:mb-4 float-3" />
                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 butcher-title">Premium Quality</h3>
                <p className="text-slate-600 text-sm md:text-base">Hand-selected finest cuts and premium meat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories */}
      <section className="py-8 bg-white/80 backdrop-blur-md border-y border-amber-100 wood-texture">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <Button 
                key={category.id} 
                variant={selectedCategory === category.id ? 'default' : 'outline'} 
                onClick={() => setSelectedCategory(category.id)} 
                className={`${
                  selectedCategory === category.id 
                    ? 'btn-premium shadow-lg scale-105' 
                    : 'border-2 border-amber-200 text-amber-700 hover:bg-amber-50 bg-white/50'
                } rounded-full px-6 py-3 transition-all duration-300 hover-lift font-semibold backdrop-blur-sm`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${
                    selectedCategory === category.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-amber-100 text-amber-700'
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
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent butcher-title">
              Our Fresh Products
            </h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto premium-text">
              Hand-picked premium quality meat, sourced from trusted farms and delivered fresh to your door with guaranteed quality and hygiene
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="product-card bg-white/95 rounded-3xl p-12 backdrop-blur-sm hover-lift">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-500 text-xl">No products found matching your search.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group product-card hover-lift rounded-3xl overflow-hidden cursor-pointer border-2 scale-in" 
                  onClick={() => setSelectedProduct(product)}
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {product.isNew && (
                      <Badge className="absolute top-4 left-4 bg-emerald-500 text-white font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        ✨ New
                      </Badge>
                    )}
                    {product.discount && (
                      <Badge className="absolute top-4 right-4 bg-rose-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                        🔥 {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-amber-700 transition-colors butcher-title">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600 line-clamp-2 premium-text">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-wrap gap-2">
                        {product.tags.slice(0, 2).map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs bg-amber-100 text-amber-700 border border-amber-200 font-medium"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-700 butcher-title">
                          ₹{product.pricePerKg}/kg
                        </p>
                        <p className="text-xs text-slate-500">
                          Starting from ₹{Math.round(product.pricePerKg * 0.25)}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full btn-premium rounded-full py-4 font-bold text-lg hover-lift shadow-lg" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedProduct(product); 
                      }}
                    >
                      🛒 Select Weight
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-20 bg-white/80 wood-texture">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <h3 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent butcher-title">
                Why Choose Mulghai Point?
              </h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-6 hover-lift p-4 rounded-2xl">
                  <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-4 rounded-2xl shadow-lg float-1">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-3 butcher-title">Premium Quality</h4>
                    <p className="text-slate-600 text-lg premium-text">
                      Hand-selected from trusted farms, ensuring the highest quality and freshness for every cut with rigorous quality checks.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 hover-lift p-4 rounded-2xl">
                  <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-4 rounded-2xl shadow-lg float-2">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-3 butcher-title">Fast Delivery</h4>
                    <p className="text-slate-600 text-lg premium-text">
                      Quick and reliable delivery within 60 minutes to keep your meat fresh and your meals on schedule.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 hover-lift p-4 rounded-2xl">
                  <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-4 rounded-2xl shadow-lg float-3">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-3 butcher-title">Local & Fresh</h4>
                    <p className="text-slate-600 text-lg premium-text">
                      Sourced from local farms, supporting our community while ensuring maximum freshness and sustainability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative reveal-right">
              <div className="vintage-frame rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1584048603508-4b31894439a9" 
                  alt="Classic butcher shop interior" 
                  className="w-full rounded-3xl hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer id="contact" className="bg-white/95 text-slate-800 py-16 border-t border-amber-100 wood-texture">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-4 rounded-3xl shadow-lg logo-glow">
                  <Drumstick className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent butcher-title">
                  Mulghai Point
                </h4>
              </div>
              <p className="text-slate-600 mb-6 text-lg premium-text">
                Your trusted partner for premium fresh meat delivery with guaranteed quality and hygiene.
              </p>
              <div className="flex items-center space-x-3 bg-amber-50 rounded-full px-6 py-3 border border-amber-100 hover-lift">
                <Phone className="w-5 h-5 text-amber-700" />
                <span className="text-amber-700 font-bold text-lg">6284307484</span>
              </div>
            </div>
            
            <div>
              <h5 className="text-xl font-bold mb-6 text-amber-800 butcher-title">Quick Links</h5>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('products')} 
                    className="text-slate-700 hover:text-amber-700 text-lg premium-text hover-lift inline-block"
                  >
                    🥩 Products
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="text-slate-700 hover:text-amber-700 text-lg premium-text hover-lift inline-block"
                  >
                    ℹ️ About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')} 
                    className="text-slate-700 hover:text-amber-700 text-lg premium-text hover-lift inline-block"
                  >
                    📞 Contact
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-xl font-bold mb-6 text-amber-800 butcher-title">Delivery Areas</h5>
              <ul className="space-y-3">
                <li className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 hover-lift">
                  📍 LPU Campus & Vicinity
                </li>
                <li className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 hover-lift">
                  🏘️ Phagwara City
                </li>
                <li className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 hover-lift">
                  🌾 Domeli & Surrounding Areas
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-100 mt-12 pt-8 text-center">
            <p className="text-slate-500 text-lg premium-text">
              © 2024 Mulghai Point. All rights reserved. 🥩 Fresh • Premium • Hygienic Quality 🐓
            </p>
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
            title: '🎉 Order Sent!', 
            description: "Your order has been sent via WhatsApp with emojis. We'll confirm shortly! 📱" 
          }); 
        }} 
      />

      {/* Enhanced WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          size="lg" 
          className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl p-6 hover-lift hover-glow" 
          onClick={() => window.open(`https://wa.me/916284307484?text=${encodeURIComponent(whatsappTemplates.quickOrder)}`, '_blank')}
        >
          <div className="flex items-center gap-2">
            <Phone className="w-6 h-6" />
            <span className="text-lg">💬</span>
          </div>
        </Button>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        cartItemCount={getCartItemCount()}
        onCartClick={() => setIsCartOpen(true)}
      />
    </div>
  );
};

export default HomePage;