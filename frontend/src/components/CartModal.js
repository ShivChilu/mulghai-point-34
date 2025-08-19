import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, Zap, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onCheckout, getCartTotal }) => {
  if (!isOpen) return null;

  const deliveryCharge = getCartTotal() < 150 ? 25 : 0;
  const totalWithDelivery = getCartTotal() + deliveryCharge;
  const savings = cart.reduce((total, item) => total + (item.originalPrice || 0) * item.quantity, 0) - getCartTotal();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      {/* Mobile: Full Screen, Desktop: Centered Modal */}
      <div className="h-full w-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:mx-auto md:my-4 md:rounded-3xl bg-white flex flex-col md:relative md:top-[5vh] shadow-2xl">
        
        {/* Fixed Header */}
        <div className="bg-white border-b border-amber-100 p-4 flex justify-between items-center shrink-0 md:rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-amber-400 to-rose-400 p-2.5 rounded-2xl shadow-sm">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Your Cart</h2>
              <p className="text-slate-500 text-xs">{cart.length} {cart.length === 1 ? 'item' : 'items'} in cart</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 hover:bg-rose-50 rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 min-h-[40vh]">
                <div className="bg-amber-50 rounded-full p-6 mb-4 border border-amber-100">
                  <ShoppingBag className="w-16 h-16 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Your cart is empty</h3>
                <p className="text-slate-500 mb-6 max-w-md">Looks like you haven't added any delicious items yet. Start exploring our premium meat selection!</p>
                <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-full">Start Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Smart Suggestions */}
                {getCartTotal() < 150 && (
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-700 text-sm font-medium">Smart Tip</span>
                    </div>
                    <p className="text-amber-700 text-sm">Add ₹{150 - getCartTotal()} more to unlock FREE delivery and save ₹25!</p>
                  </div>
                )}

                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <Card key={item.id} className="bg-white border border-amber-100 rounded-2xl overflow-hidden group">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-base truncate">{item.name}</h3>
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[11px]">{item.weight}</Badge>
                              <span className="text-slate-500 text-xs">per piece</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-amber-700">₹{item.price}</span>
                              {item.originalPrice && (
                                <span className="text-slate-400 line-through text-xs">₹{item.originalPrice}</span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 border border-amber-200">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 p-0 rounded-full hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-6 text-center font-semibold text-slate-800 text-sm">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0 rounded-full hover:bg-emerald-50 hover:text-emerald-600"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, 0)}
                              className="w-9 h-9 p-0 rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="mt-3 pt-3 border-t border-amber-100">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Item total:</span>
                            <span className="text-lg font-bold text-amber-700">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Add some padding at bottom to ensure last item is visible */}
                <div className="h-4"></div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Summary & Checkout - Always Visible */}
        {cart.length > 0 && (
          <div className="bg-white border-t border-amber-100 shrink-0 md:rounded-b-3xl pb-20 md:pb-0">
            <div className="p-4 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Subtotal:</span>
                  <span className="text-slate-900 font-semibold">₹{getCartTotal()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="flex items-center space-x-1"><Sparkles className="w-4 h-4" /><span>You saved:</span></span>
                    <span className="font-semibold">₹{savings}</span>
                  </div>
                )}
                {deliveryCharge > 0 && (
                  <div className="flex justify-between items-center text-amber-700">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold">₹{deliveryCharge}</span>
                  </div>
                )}
                {deliveryCharge === 0 && getCartTotal() >= 150 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="flex items-center space-x-1"><Sparkles className="w-4 h-4" /><span>Delivery:</span></span>
                    <span className="font-semibold">FREE</span>
                  </div>
                )}
                <div className="border-t border-amber-100 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Total:</span>
                    <span className="text-2xl font-bold text-amber-700">₹{totalWithDelivery}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-emerald-800 text-sm font-semibold">Cash on Delivery</span>
                    <p className="text-emerald-700 text-xs">Pay when you receive your fresh order</p>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                onClick={onCheckout} 
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 text-base font-semibold rounded-xl shadow-md" 
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" /> Proceed to Checkout
              </Button>
              
              <p className="text-center text-slate-500 text-xs">Secure checkout • Fresh guarantee • Free cancellation</p>
            </div>
            
            {/* Safe area for iOS and mobile nav */}
            <div className="h-4 md:h-0 bg-white mobile-bottom-spacer"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;