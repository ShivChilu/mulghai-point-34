import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, Zap, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onCheckout, getCartTotal }) => {
  if (!isOpen) return null;

  const deliveryCharge = getCartTotal() < 150 ? 25 : 0;
  const totalWithDelivery = getCartTotal() + deliveryCharge;
  const savings = cart.reduce((total, item) => total + (item.originalPrice || 0) * item.quantity, 0) - getCartTotal();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0">
      {/* Amazon-style Cart - Everything scrolls together */}
      <div className="w-full h-full md:w-full md:max-w-2xl md:h-auto md:max-h-[95vh] bg-white dark:bg-gray-900 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Fixed Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6 flex items-center justify-between shrink-0 md:rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-2.5 rounded-xl shadow-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                Your Cart
              </h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} • ₹{getCartTotal()}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Single Scroll Area - Everything scrolls together like Amazon */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center text-center py-16 px-6 min-h-[60vh]">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                Your cart is empty
              </h3>
              <p className="text-slate-600 dark:text-gray-300 mb-8 max-w-md leading-relaxed">
                Looks like you haven't added any delicious items yet. Start exploring our premium meat selection!
              </p>
              <Button 
                onClick={onClose} 
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div>
              {/* Cart Content - All in single scroll area */}
              <div className="p-4 md:p-6">
                
                {/* Smart Delivery Tip */}
                {getCartTotal() < 150 && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="font-semibold text-amber-800 dark:text-amber-300">Smart Tip</span>
                    </div>
                    <p className="text-amber-700 dark:text-amber-200 text-sm leading-relaxed">
                      Add ₹{150 - getCartTotal()} more to unlock <span className="font-bold">FREE delivery</span> and save ₹25!
                    </p>
                  </div>
                )}

                {/* Cart Items - Each item in full card */}
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-6 shadow-sm"
                    >
                      {/* Item Layout */}
                      <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl shadow-md" 
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          {/* Product Name - Full Visibility */}
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-lg md:text-xl text-slate-800 dark:text-white leading-tight pr-2">
                              {item.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, 0)}
                              className="shrink-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full p-1.5 ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Weight Badge */}
                          <div className="flex items-center space-x-3 mb-3">
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-700 text-sm font-medium px-3 py-1">
                              {item.weight}
                            </Badge>
                            <span className="text-sm text-slate-500 dark:text-gray-400">per piece</span>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-baseline space-x-2 mb-4">
                            <span className="text-2xl md:text-3xl font-bold text-amber-700 dark:text-amber-400">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-base text-slate-400 dark:text-gray-500 line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls and Total */}
                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-10 h-10 p-0 rounded-full hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 text-slate-600 dark:text-gray-300"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-5 h-5" />
                              </Button>
                              <div className="w-16 text-center">
                                <span className="font-bold text-xl text-slate-800 dark:text-white">
                                  {item.quantity}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-10 h-10 p-0 rounded-full hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 text-slate-600 dark:text-gray-300"
                              >
                                <Plus className="w-5 h-5" />
                              </Button>
                            </div>
                            
                            {/* Item Total */}
                            <div className="text-right">
                              <div className="text-sm text-slate-500 dark:text-gray-400 mb-1">Item total</div>
                              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                                ₹{item.price * item.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary - Part of scroll area */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 md:p-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-base">
                      <span className="text-slate-700 dark:text-gray-300">Subtotal:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">₹{getCartTotal()}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
                        <span className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>You saved:</span>
                        </span>
                        <span className="font-semibold">₹{savings}</span>
                      </div>
                    )}
                    
                    {deliveryCharge > 0 ? (
                      <div className="flex justify-between items-center text-amber-700 dark:text-amber-400">
                        <span>Delivery Charge:</span>
                        <span className="font-semibold">₹{deliveryCharge}</span>
                      </div>
                    ) : getCartTotal() >= 150 && (
                      <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
                        <span className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Delivery:</span>
                        </span>
                        <span className="font-semibold">FREE</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">Total:</span>
                        <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">₹{totalWithDelivery}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method - Part of scroll area */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-4 md:p-6 border border-emerald-200 dark:border-emerald-700/50 mb-6">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                    <div>
                      <div className="font-bold text-lg text-emerald-800 dark:text-emerald-300">Cash on Delivery</div>
                      <div className="text-emerald-700 dark:text-emerald-400">Pay when you receive your fresh order</div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button - Part of scroll area */}
                <Button 
                  onClick={onCheckout} 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-5 md:py-6 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all mb-4" 
                  size="lg"
                >
                  <ShoppingBag className="w-6 h-6 mr-3" /> 
                  Proceed to Checkout
                </Button>
                
                <p className="text-center text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  Secure checkout • Fresh guarantee • Free cancellation
                </p>

                {/* Bottom padding for mobile navigation */}
                <div className="h-24 md:h-8"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;