import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, Zap, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onCheckout, getCartTotal }) => {
  if (!isOpen) return null;

  const deliveryCharge = getCartTotal() < 500 ? 50 : 0;
  const totalWithDelivery = getCartTotal() + deliveryCharge;
  const savings = cart.reduce((total, item) => total + (item.originalPrice || 0) * item.quantity, 0) - getCartTotal();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
      {/* Full Screen Cart for Mobile, Modal for Desktop */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full h-full md:max-w-4xl md:max-h-[90vh] md:rounded-3xl overflow-hidden flex flex-col border-2 border-purple-500/20 shadow-2xl">
        
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-black/80 to-purple-900/80 backdrop-blur-md p-6 flex justify-between items-center border-b border-purple-500/20">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Your Cart
              </h2>
              <p className="text-gray-400 text-sm">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-red-500/20 rounded-full p-3 transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-full p-8 mb-6 backdrop-blur-sm border border-purple-500/20">
                <ShoppingBag className="w-20 h-20 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Your cart is empty</h3>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Looks like you haven't added any delicious items yet. Start exploring our premium meat selection!
              </p>
              <Button 
                onClick={onClose}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Smart Suggestions */}
              {getCartTotal() < 500 && (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-md rounded-2xl p-4 border border-amber-500/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-300 font-semibold">Smart Tip</span>
                  </div>
                  <p className="text-amber-200 text-sm">
                    Add ₹{500 - getCartTotal()} more to unlock FREE delivery and save ₹50!
                  </p>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <Card key={item.id} className="bg-gradient-to-r from-black/60 to-purple-900/60 backdrop-blur-md border-2 border-purple-500/20 hover:border-orange-500/50 transition-all duration-300 rounded-2xl overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-lg mb-1 truncate">{item.name}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs">
                              {item.weight}
                            </Badge>
                            <span className="text-gray-400 text-sm">per piece</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-gray-500 line-through text-sm">₹{item.originalPrice}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/20">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="w-8 text-center font-bold text-white text-lg">{item.quantity}</span>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0 rounded-full hover:bg-green-500/20 hover:text-green-400 transition-all duration-300"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, 0)}
                            className="w-10 h-10 p-0 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Item Total */}
                      <div className="mt-4 pt-4 border-t border-purple-500/20">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Item total:</span>
                          <span className="text-xl font-bold text-orange-400">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Summary & Checkout */}
        {cart.length > 0 && (
          <div className="bg-gradient-to-r from-black/90 to-purple-900/90 backdrop-blur-md p-6 border-t border-purple-500/20">
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Subtotal:</span>
                <span className="text-white font-semibold">₹{getCartTotal()}</span>
              </div>
              
              {savings > 0 && (
                <div className="flex justify-between items-center text-green-400">
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>You saved:</span>
                  </span>
                  <span className="font-semibold">₹{savings}</span>
                </div>
              )}
              
              {deliveryCharge > 0 && (
                <div className="flex justify-between items-center text-amber-400">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold">₹{deliveryCharge}</span>
                </div>
              )}
              
              {deliveryCharge === 0 && getCartTotal() >= 500 && (
                <div className="flex justify-between items-center text-green-400">
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Delivery:</span>
                  </span>
                  <span className="font-semibold">FREE</span>
                </div>
              )}
              
              <div className="border-t border-purple-500/20 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    ₹{totalWithDelivery}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Info */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-green-400" />
                <div>
                  <span className="text-green-300 font-semibold">Cash on Delivery</span>
                  <p className="text-green-200 text-sm mt-1">Pay when you receive your fresh order</p>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <Button 
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 border-0"
              size="lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>

            <p className="text-center text-gray-400 text-xs mt-4">
              Secure checkout • Fresh guarantee • Free cancellation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;