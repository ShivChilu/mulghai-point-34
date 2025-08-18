import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onCheckout, getCartTotal }) => {
  if (!isOpen) return null;

  const deliveryCharge = getCartTotal() < 500 ? 50 : 0;
  const totalWithDelivery = getCartTotal() + deliveryCharge;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            <span>Your Cart</span>
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-400">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="border-amber-100">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.weight}</p>
                        <p className="text-lg font-bold text-amber-600">₹{item.price}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, 0)}
                          className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-right">
                      <p className="text-sm text-gray-600">
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{getCartTotal()}</span>
              </div>
              
              {deliveryCharge > 0 && (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charge:</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    Add ₹{500 - getCartTotal()} more for free delivery!
                  </div>
                </>
              )}
              
              {deliveryCharge === 0 && getCartTotal() >= 500 && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded flex items-center space-x-1">
                  <Badge className="bg-green-500 text-white text-xs">FREE</Badge>
                  <span>Delivery is free on orders above ₹500!</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-amber-600">₹{totalWithDelivery}</span>
              </div>
            </div>
            
            <Button 
              onClick={onCheckout}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-semibold"
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;