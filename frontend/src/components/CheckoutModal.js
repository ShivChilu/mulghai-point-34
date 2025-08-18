import React, { useState } from 'react';
import { X, MapPin, Phone, User, MessageCircle, Shield, Truck, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

const CheckoutModal = ({ isOpen, onClose, cart, cartTotal, serviceablePincodes, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    instructions: ''
  });
  const [pincodeStatus, setPincodeStatus] = useState({ valid: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const deliveryCharge = cartTotal < 500 ? 50 : 0;
  const totalWithDelivery = cartTotal + deliveryCharge;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'pincode' && value.length === 6) {
      checkPincode(value);
    }
  };

  const checkPincode = (pincode) => {
    if (serviceablePincodes[pincode]) {
      setPincodeStatus({
        valid: true,
        message: `✓ Delivery available to ${serviceablePincodes[pincode]}`
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: '✗ Sorry, we don\'t deliver to this area yet'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (!pincodeStatus.valid) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a serviceable pincode",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create WhatsApp message
    let message = `🛒 NEW ORDER 🛒\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    message += `Address: ${formData.address}\n`;
    message += `Pincode: ${formData.pincode} (${serviceablePincodes[formData.pincode]})\n`;
    
    if (formData.instructions.trim()) {
      message += `Special Instructions: ${formData.instructions}\n`;
    }
    
    message += `\n*Order Items:*\n`;
    cart.forEach(item => {
      message += `• ${item.name} (${item.weight}) × ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    
    message += `\n*Order Summary:*\n`;
    message += `Subtotal: ₹${cartTotal}\n`;
    if (deliveryCharge > 0) {
      message += `Delivery Charge: ₹${deliveryCharge}\n`;
    }
    message += `*Total Amount: ₹${totalWithDelivery}*\n`;
    message += `Payment: Cash on Delivery\n`;
    message += `\nPlease confirm this order. Thank you! 🙏`;

    // Open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917986955634?text=${encodedMessage}`, '_blank');
    
    setIsSubmitting(false);
    
    // Reset form and complete order
    setFormData({
      name: '',
      phone: '',
      address: '',
      pincode: '',
      instructions: ''
    });
    setPincodeStatus({ valid: null, message: '' });
    onOrderComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full h-full md:max-w-4xl md:max-h-[95vh] md:rounded-3xl overflow-hidden flex flex-col border-2 border-purple-500/20 shadow-2xl">
        
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-black/80 to-purple-900/80 backdrop-blur-md p-6 flex justify-between items-center border-b border-purple-500/20">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Secure Checkout
              </h2>
              <p className="text-gray-400 text-sm">Complete your order details</p>
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <Card className="bg-gradient-to-br from-black/60 to-purple-900/60 backdrop-blur-md border-2 border-purple-500/20 rounded-2xl mb-6">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-black/30 rounded-xl border border-purple-500/10">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                          <p className="text-gray-400 text-xs">{item.weight} × {item.quantity}</p>
                        </div>
                        <span className="text-orange-400 font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    
                    <div className="border-t border-purple-500/20 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal:</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      
                      {deliveryCharge > 0 && (
                        <div className="flex justify-between text-amber-400">
                          <span>Delivery Charge:</span>
                          <span>₹{deliveryCharge}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xl font-bold border-t border-purple-500/20 pt-2">
                        <span className="text-white">Total:</span>
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                          ₹{totalWithDelivery}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {deliveryCharge > 0 && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl border border-amber-500/20">
                      <p className="text-amber-200 text-sm flex items-center space-x-2">
                        <Truck className="w-4 h-4" />
                        <span>Add ₹{500 - cartTotal} more for free delivery!</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-md border-2 border-green-500/20 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">Delivery Information</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-200">Estimated delivery: 30-45 minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-200">Cash on delivery available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-200">Fresh guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Delivery Form */}
            <div className="order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2 text-orange-400" />
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-black/40 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm py-3"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-2 text-orange-400" />
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="bg-black/40 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm py-3"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2 text-orange-400" />
                    Delivery Address *
                  </label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your complete delivery address with landmarks"
                    rows={3}
                    className="bg-black/40 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2 text-orange-400" />
                    Pincode *
                  </label>
                  <Input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="bg-black/40 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm py-3"
                    required
                  />
                  {pincodeStatus.message && (
                    <div className={`mt-2 p-3 rounded-xl text-sm ${
                      pincodeStatus.valid 
                        ? 'bg-green-500/10 border border-green-500/20 text-green-300' 
                        : 'bg-red-500/10 border border-red-500/20 text-red-300'
                    }`}>
                      {pincodeStatus.message}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-2 text-orange-400" />
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Any special requests, preferred delivery time, or instructions for our delivery team..."
                    rows={2}
                    className="bg-black/40 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:bg-black/60 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Place Order via WhatsApp</span>
                    </div>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    By placing this order, you agree to our terms and conditions. 
                    Your order will be sent via WhatsApp for instant confirmation.
                  </p>
                  <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Secure</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Fast</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Guaranteed</span>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;