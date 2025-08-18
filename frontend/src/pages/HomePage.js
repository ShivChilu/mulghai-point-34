import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Phone, Clock, Award, Truck, MapPin, Star, Menu, X, Home, Package, Info, Users, Sparkles } from 'lucide-react';
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
  const [showIntro, setShowIntro] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [titleText, setTitleText] = useState('');
  const searchWrapRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const onDocClick = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Continuous typewriter for the main heading
  useEffect(() => {
    const full = 'Premium Fresh Meat';
    let i = 0;
    let direction = 1; // 1 typing, -1 deleting
    let timer;
    const step = () => {
      setTitleText(full.slice(0, i));
      if (direction === 1) {
        i++;
        if (i > full.length) {
          direction = -1;
          timer = setTimeout(step, 900); // pause at full text
          return;
        }
      } else {
        i--;
        if (i < 0) {
          direction = 1;
          i = 0;
          timer = setTimeout(step, 400); // pause at empty
          return;
        }
      }
      timer = setTimeout(step, direction === 1 ? 90 : 45);
    };
    step();
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => { filterProducts(); }, [selectedCategory, searchQuery, products]);

  const buildSuggestions = (q) => {
    let items = products.map(p => ({ id: p.id, name: p.name, subtitle: p.category, image: p.image, tags: p.tags || [] }));
    if (q && q.trim()) {
      const term = q.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.subtitle || '').toLowerCase().includes(term) ||
        (p.tags && p.tags.some(t => (t || '').toLowerCase().includes(term)))
      );
    }
    return items.slice(0, 8);
  };

  useEffect(() => { setSuggestions(buildSuggestions(searchQuery)); }, [searchQuery, products]);

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
    const cartItem = { id: `${product.id}-${weight}`, productId: product.id, name: product.name, weight, price, quantity: 1, image: product.image };
    const existingItem = cart.find(item => item.id === cartItem.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, cartItem]);
    }
    toast({ title: 'Added to Cart', description: `${product.name} (${weight}) added successfully` });
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) setCart(cart.filter(item => item.id !== itemId));
    else setCart(cart.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestionSelect = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    scrollToSection('products');
  };

  const SearchBox = ({ mobile = false }) => (
    <div className="relative w-full" ref={searchWrapRef}>
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${mobile ? 'text-amber-600/70' : 'text-amber-600/70'} w-5 h-5 z-10`} />
      <Input
        type="text"
        placeholder="Search chicken, mutton, fish..."
        value={searchQuery}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => { setShowSuggestions(true); setSuggestions(buildSuggestions(searchQuery)); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && suggestions.length > 0) {
            e.preventDefault();
            handleSuggestionSelect(suggestions[0].name);
          }
        }}
        className="pl-12 pr-4 py-3 bg-white border border-amber-200 rounded-full text-slate-700 placeholder-slate-400 focus:border-amber-400 focus:ring-0"
      />
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-amber-100 rounded-xl shadow-lg max-h-64 overflow-auto z-40">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-slate-500 text-sm">No matches found</div>
          ) : (
            suggestions.map(s => (
              <button
                key={s.id}
                className="w-full text-left px-4 py-3 hover:bg-amber-50 flex items-center space-x-3"
                onMouseDown={() => handleSuggestionSelect(s.name)}
                onTouchStart={() => handleSuggestionSelect(s.name)}
              >
                <img src={s.image} alt={s.name} className="w-8 h-8 rounded object-cover" />
                <div className="min-w-0">
                  <div className="font-medium text-slate-800 truncate">{s.name}</div>
                  <div className="text-xs text-slate-500 truncate">{s.subtitle}</div>
                </div>
                <div className="ml-auto flex items-center space-x-1 text-amber-600 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>suggestion</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 text-slate-800 pb-[calc(env(safe-area-inset-bottom)+84px)]">
      {/* Intro splash - plays once on open then hides */}
      {showIntro && (
        <div className="fixed inset-0 z-[60] bg-white flex items-center justify-center">
          <div className="splash-enter text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-md">
              <Award className="w-9 h-9 text-white" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-amber-800">Mulghai Point</h1>
          </div>
        </div>
      )}

      {/* Header - Light Theme */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-amber-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-400 to-rose-400 p-3 rounded-2xl shadow-sm">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Mulghai Point</h1>
                <p className="text-xs text-amber-600/80">Premium Fresh Meat</p>
              </div>
            </div>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBox />
            </div>

            <div className="flex items-center space-x-2">
              <a href="tel:7986955634" className="hidden md:flex items-center space-x-2 text-amber-700 hover:text-amber-800 transition-colors px-3 py-2 rounded-full">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">7986955634</span>
              </a>

              {/* Top Cart Button */}
              <Button onClick={() => { setShowSuggestions(false); setIsCartOpen(true); }} className="relative bg-amber-600 hover:bg-amber-500 text-white rounded-full px-5 py-3 shadow-md transition-transform active:scale-95">
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => { setShowSuggestions(false); setIsMobileMenuOpen(!isMobileMenuOpen); }} className="md:hidden text-amber-700 hover:text-amber-900">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <SearchBox mobile />
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-amber-100">
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" onClick={() => scrollToSection('home')} className="justify-start text-amber-700 hover:bg-amber-50">
                  <Home className="w-4 h-4 mr-2" /> Home
                </Button>
                <Button variant="ghost" onClick={() => scrollToSection('products')} className="justify-start text-amber-700 hover:bg-amber-50">
                  <Package className="w-4 h-4 mr-2" /> Products
                </Button>
                <Button variant="ghost" onClick={() => { setShowSuggestions(false); setIsCartOpen(true); }} className="justify-start text-amber-700 hover:bg-amber-50">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Cart
                </Button>
                <Button variant="ghost" onClick={() => scrollToSection('about')} className="justify-start text-amber-700 hover:bg-amber-50">
                  <Info className="w-4 h-4 mr-2" /> About
                </Button>
                <Button variant="ghost" onClick={() => scrollToSection('contact')} className="justify-start text-amber-700 hover:bg-amber-50">
                  <Users className="w-4 h-4 mr-2" /> Contact
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Image visible, no overlay */}
      <section id="home" className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=2000&q=80" alt="Premium meat background" className="w-full h-full object-cover" />
        </div>

        {/* Subtle live animated elements (no image overlay) */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute top-10 left-8 w-20 h-20 bg-amber-300/25 rounded-full blur-2xl float-1"></span>
          <span className="absolute bottom-14 right-12 w-24 h-24 bg-rose-300/25 rounded-full blur-2xl float-2"></span>
          <span className="absolute top-1/3 right-1/4 text-amber-300/80 float-3"><Sparkles className="w-8 h-8" /></span>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="reveal-up text-4xl md:text-6xl font-extrabold mb-4 text-white" style={{textShadow:'0 3px 14px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.8)'}}>
              {titleText}<span className="caret">|</span>
            </h2>
            <p className="reveal-up mb-8" style={{animationDelay:'200ms'}}>
              <span className="inline-block bg-amber-100/95 text-amber-900 rounded-full px-4 py-2 shadow-sm ring-1 ring-amber-300">
                Farm-fresh quality delivered to your doorstep<span className="caret">|</span>
              </span>
            </p>

            <div className="reveal-up flex flex-col sm:flex-row justify-center gap-4 mb-12" style={{animationDelay:'350ms'}}>
              <Button size="lg" onClick={() => scrollToSection('products')} className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-4 rounded-full shadow-md transition-transform active:scale-95">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('https://wa.me/917986955634', '_blank')} className="border border-amber-300 text-amber-700 hover:bg-amber-50 bg-white px-8 py-4 rounded-full">
                Contact Us
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
                <Clock className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Fresh Daily</h3>
                <p className="text-slate-600 text-sm">Delivered fresh every day</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
                <Truck className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Fast Delivery</h3>
                <p className="text-slate-600 text-sm">Quick and reliable service</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
                <Award className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Premium Quality</h3>
                <p className="text-slate-600 text-sm">Hand-selected finest cuts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Light */}
      <section className="py-6 bg-white/70 backdrop-blur-md border-y border-amber-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <Button key={category.id} variant={selectedCategory === category.id ? 'default' : 'outline'} onClick={() => setSelectedCategory(category.id)} className={`${selectedCategory === category.id ? 'bg-amber-600 hover:bg-amber-500 text-white border-0 shadow-sm' : 'border border-amber-200 text-amber-700 hover:bg-amber-50 bg-white'} rounded-full px-5 py-2 transition-all`}>
                {category.name}
                <Badge variant="secondary" className={`ml-2 ${selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products - Light Cards */}
      <section id="products" className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">Our Fresh Products</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">Hand-picked premium quality meat, sourced from trusted farms and delivered fresh to your door</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-10 border border-amber-100">
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No products found matching your search.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="group bg-white border border-amber-100 hover:shadow-md transition-all rounded-2xl overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <div className="relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                    {product.isNew && (<Badge className="absolute top-3 left-3 bg-emerald-500 text-white font-semibold px-3 py-1 rounded-full">New</Badge>)}
                    {product.discount && (<Badge className="absolute top-3 right-3 bg-rose-500 text-white font-semibold px-3 py-1 rounded-full">{product.discount}% OFF</Badge>)}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">{product.name}</CardTitle>
                      <div className="flex items-center space-x-1 bg-amber-100 rounded-full px-2 py-1">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="text-sm text-amber-700 font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="text-sm text-slate-600 line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-amber-100 text-amber-700 border border-amber-200">{tag}</Badge>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-700">₹{product.pricePerKg}/kg</p>
                        <p className="text-xs text-slate-500">Starting from ₹{Math.round(product.pricePerKg * 0.25)}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-full py-3 font-semibold transition-transform active:scale-95" onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}>
                      Select Weight
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About - Light */}
      <section id="about" className="py-16 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">Why Choose Mulghai Point?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-amber-400 to-rose-400 p-3 rounded-2xl shadow-sm">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Premium Quality</h4>
                    <p className="text-slate-600">Hand-selected from trusted farms, ensuring the highest quality and freshness for every cut.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-amber-400 to-rose-400 p-3 rounded-2xl shadow-sm">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Fast Delivery</h4>
                    <p className="text-slate-600">Quick and reliable delivery to keep your meat fresh and your meals on schedule.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-amber-400 to-rose-400 p-3 rounded-2xl shadow-sm">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Local & Fresh</h4>
                    <p className="text-slate-600">Sourced from local farms, supporting our community while ensuring maximum freshness.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80" alt="Fresh meat display" className="relative rounded-3xl shadow-lg w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Light */}
      <footer id="contact" className="bg-white text-slate-800 py-12 border-t border-amber-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-amber-400 to-rose-400 p-3 rounded-2xl shadow-sm">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-rose-700 bg-clip-text text-transparent">Mulghai Point</h4>
              </div>
              <p className="text-slate-600 mb-4">Your trusted partner for premium fresh meat delivery.</p>
              <div className="flex items-center space-x-2 bg-amber-50 rounded-full px-4 py-2 border border-amber-100">
                <Phone className="w-4 h-4 text-amber-700" />
                <span className="text-amber-700 font-medium">7986955634</span>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4 text-amber-800">Quick Links</h5>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('products')} className="text-slate-700 hover:text-amber-700">Products</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-slate-700 hover:text-amber-700">About Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-slate-700 hover:text-amber-700">Contact</button></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4 text-amber-800">Delivery Areas</h5>
              <ul className="space-y-2 text-slate-700">
                <li className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">LPU Campus & Vicinity</li>
                <li className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">Phagwara City</li>
                <li className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">Domeli & Surrounding Areas</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-100 mt-8 pt-6 text-center">
            <p className="text-slate-500">© 2024 Mulghai Point. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - Light, with Cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-amber-100 z-30" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
        <div className="flex justify-around py-2">
          <button onClick={() => { scrollToSection('home'); }} className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-colors ${activeSection === 'home' ? 'text-amber-700' : 'text-slate-500'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[11px]">Home</span>
          </button>

          <button onClick={() => { scrollToSection('products'); }} className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-colors ${activeSection === 'products' ? 'text-amber-700' : 'text-slate-500'}`}>
            <Package className="w-5 h-5" />
            <span className="text-[11px]">Products</span>
          </button>

          <button onClick={() => { setShowSuggestions(false); setActiveSection('cart'); setIsCartOpen(true); }} className={`relative flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-colors ${activeSection === 'cart' ? 'text-amber-700' : 'text-slate-500'}`}>
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">{getCartItemCount()}</span>
              )}
            </div>
            <span className="text-[11px]">Cart</span>
          </button>

          <button onClick={() => { scrollToSection('about'); }} className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-colors ${activeSection === 'about' ? 'text-amber-700' : 'text-slate-500'}`}>
            <Info className="w-5 h-5" />
            <span className="text-[11px]">About</span>
          </button>

          <button onClick={() => { scrollToSection('contact'); }} className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-colors ${activeSection === 'contact' ? 'text-amber-700' : 'text-slate-500'}`}>
            <Users className="w-5 h-5" />
            <span className="text-[11px]">Contact</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      )}

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={updateCartQuantity} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} getCartTotal={getCartTotal} />

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} cartTotal={getCartTotal()} serviceablePincodes={serviceablePincodes} onOrderComplete={() => { setCart([]); setIsCheckoutOpen(false); toast({ title: 'Order Sent!', description: "Your order has been sent via WhatsApp. We'll confirm shortly." }); }} />

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-24 md:bottom-6 right-6 z-40">
        <Button size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-md p-4" onClick={() => window.open('https://wa.me/917986955634?text=Hi%20Mulghai%20Point,%20I%20need%20help%20with%20my%20order!', '_blank')}>
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;