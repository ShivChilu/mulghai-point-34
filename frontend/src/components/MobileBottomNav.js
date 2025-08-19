import React from 'react';
import { Home, ShoppingBag, ShoppingCart, Info, Phone } from 'lucide-react';
import { Badge } from './ui/badge';

const MobileBottomNav = ({ activeSection, scrollToSection, cartItemCount, onCartClick }) => {
  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      action: () => scrollToSection('home')
    },
    {
      id: 'products',
      icon: ShoppingBag,
      label: 'Products',
      action: () => scrollToSection('products')
    },
    {
      id: 'cart',
      icon: ShoppingCart,
      label: 'Cart',
      action: onCartClick,
      showBadge: true,
      badgeCount: cartItemCount
    },
    {
      id: 'about',
      icon: Info,
      label: 'About',
      action: () => scrollToSection('about')
    },
    {
      id: 'contact',
      icon: Phone,
      label: 'Contact',
      action: () => scrollToSection('contact')
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-amber-200/50 dark:border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[60px] ${
                isActive 
                  ? 'bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-lg scale-105' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : ''}`} />
                {item.showBadge && item.badgeCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs min-w-[18px] h-4 flex items-center justify-center rounded-full animate-pulse">
                    {item.badgeCount}
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-medium ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Bottom safe area for iOS */}
      <div className="h-safe-bottom bg-white/95 dark:bg-slate-900/95"></div>
    </div>
  );
};

export default MobileBottomNav;