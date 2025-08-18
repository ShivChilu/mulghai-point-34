import React, { useState } from 'react';
import { X, MapPin, Phone, User, MessageCircle } from 'lucide-react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    if (!pincodeStatus.valid) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a serviceable pincode",
        variant: "destructive"
      });
      return;
    }

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <Card className="mb-6 border-amber-100">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} ({item.weight}) × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  
                  {deliveryCharge > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Charge:</span>
                      <span>₹{deliveryCharge}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span className="text-amber-600">₹{totalWithDelivery}</span>
                  </div>
                </div>
              </div>
              
              {deliveryCharge > 0 && (
                <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  Add ₹{500 - cartTotal} more for free delivery!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="border-amber-200 focus:border-amber-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="border-amber-200 focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Delivery Address *
              </label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your complete delivery address"
                rows={3}
                className="border-amber-200 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Pincode *
              </label>
              <Input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="6-digit pincode"
                maxLength={6}
                className="border-amber-200 focus:border-amber-500"
                required
              />
              {pincodeStatus.message && (
                <p className={`text-sm mt-1 ${pincodeStatus.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Special Instructions (Optional)
              </label>
              <Textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Any special requests or delivery instructions..."
                rows={2}
                className="border-amber-200 focus:border-amber-500"
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Payment Method</h4>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500 text-white">Cash on Delivery</Badge>
                <span className="text-sm text-green-700">Pay when you receive your order</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-semibold"
              size="lg"
            >
              Place Order via WhatsApp
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              By placing this order, you agree to our terms and conditions. 
              Your order will be sent via WhatsApp for confirmation.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;