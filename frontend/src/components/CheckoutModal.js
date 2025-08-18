import React, { useState } from 'react';
import { X, MapPin, Phone, User, MessageCircle, Shield, Truck, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

const CheckoutModal = ({ isOpen, onClose, cart, cartTotal, serviceablePincodes, onOrderComplete }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', pincode: '', instructions: '' });
  const [pincodeStatus, setPincodeStatus] = useState({ valid: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const deliveryCharge = cartTotal < 500 ? 50 : 0;
  const totalWithDelivery = cartTotal + deliveryCharge;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'pincode' && value.length === 6) checkPincode(value);
  };

  const checkPincode = (pincode) => {
    if (serviceablePincodes[pincode]) {
      setPincodeStatus({ valid: true, message: `✓ Delivery available to ${serviceablePincodes[pincode]}` });
    } else {
      setPincodeStatus({ valid: false, message: "✗ Sorry, we don't deliver to this area yet" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast({ title: 'Invalid Phone', description: 'Please enter a valid 10-digit phone number', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
    if (!pincodeStatus.valid) {
      toast({ title: 'Invalid Pincode', description: 'Please enter a serviceable pincode', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1200));

    let message = `🛒 NEW ORDER 🛒\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    message += `Address: ${formData.address}\n`;
    message += `Pincode: ${formData.pincode} (${serviceablePincodes[formData.pincode]})\n`;
    if (formData.instructions.trim()) message += `Special Instructions: ${formData.instructions}\n`;

    message += `\n*Order Items:*\n`;
    cart.forEach(item => { message += `• ${item.name} (${item.weight}) × ${item.quantity} = ₹${item.price * item.quantity}\n`; });

    message += `\n*Order Summary:*\n`;
    message += `Subtotal: ₹${cartTotal}\n`;
    if (deliveryCharge > 0) message += `Delivery Charge: ₹${deliveryCharge}\n`;
    message += `*Total Amount: ₹${totalWithDelivery}*\n`;
    message += `Payment: Cash on Delivery\n`;
    message += `\nPlease confirm this order. Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917986955634?text=${encodedMessage}`, '_blank');

    setIsSubmitting(false);
    setFormData({ name: '', phone: '', address: '', pincode: '', instructions: '' });
    setPincodeStatus({ valid: null, message: '' });
    onOrderComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full h-full md:max-w-4xl md:max-h-[95vh] md:rounded-3xl overflow-hidden flex flex-col border border-amber-100 shadow-2xl">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur p-4 flex justify-between items-center border-b border-amber-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 p-2.5 rounded-2xl shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Secure Checkout</h2>
              <p className="text-slate-500 text-xs">Complete your order details</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-700 hover:bg-rose-50 rounded-full p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <Card className="bg-white border border-amber-100 rounded-2xl mb-4">
                <CardHeader>
                  <CardTitle className="text-base text-slate-900 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                          <p className="text-slate-600 text-xs">{item.weight} × {item.quantity}</p>
                        </div>
                        <span className="text-amber-700 font-semibold text-sm">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-amber-100 pt-3 space-y-1">
                      <div className="flex justify-between text-slate-700"><span>Subtotal:</span><span>₹{cartTotal}</span></div>
                      {deliveryCharge > 0 && (
                        <div className="flex justify-between text-amber-700"><span>Delivery Charge:</span><span>₹{deliveryCharge}</span></div>
                      )}
                      <div className="flex justify-between text-lg font-semibold border-t border-amber-100 pt-2">
                        <span className="text-slate-900">Total:</span>
                        <span className="text-amber-700">₹{totalWithDelivery}</span>
                      </div>
                    </div>
                  </div>
                  {deliveryCharge > 0 && (
                    <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-amber-700 text-sm flex items-center space-x-2">
                        <Truck className="w-4 h-4" />
                        <span>Add ₹{500 - cartTotal} more for free delivery!</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="bg-emerald-50 border border-emerald-100 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-800 text-sm font-semibold">Delivery Information</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" /><span className="text-emerald-800">Estimated delivery: 30-45 minutes</span></div>
                    <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" /><span className="text-emerald-800">Cash on delivery available</span></div>
                    <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" /><span className="text-emerald-800">Fresh guarantee</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Delivery Form */}
            <div className="order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1"><User className="w-3.5 h-3.5 inline mr-1 text-amber-700" /> Full Name *</label>
                    <Input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter your full name" className="bg-white border border-amber-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-amber-400" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1"><Phone className="w-3.5 h-3.5 inline mr-1 text-amber-700" /> Phone Number *</label>
                    <Input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="10-digit mobile number" maxLength={10} className="bg-white border border-amber-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-amber-400" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1"><MapPin className="w-3.5 h-3.5 inline mr-1 text-amber-700" /> Delivery Address *</label>
                  <Textarea value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Enter your complete delivery address with landmarks" rows={3} className="bg-white border border-amber-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-amber-400" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1"><MapPin className="w-3.5 h-3.5 inline mr-1 text-amber-700" /> Pincode *</label>
                  <Input type="text" value={formData.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} placeholder="6-digit pincode" maxLength={6} className="bg-white border border-amber-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-amber-400" required />
                  {pincodeStatus.message &amp;&amp; (
                    <div className={`mt-2 p-2.5 rounded-xl text-xs ${pincodeStatus.valid ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'bg-rose-50 border border-rose-100 text-rose-800'}`}>
                      {pincodeStatus.message}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1"><MessageCircle className="w-3.5 h-3.5 inline mr-1 text-amber-700" /> Special Instructions (Optional)</label>
                  <Textarea value={formData.instructions} onChange={(e) =&gt; handleInputChange('instructions', e.target.value)} placeholder="Any special requests, preferred delivery time, or instructions for our delivery team..." rows={2} className="bg-white border border-amber-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-amber-400" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 text-base font-semibold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed" size="lg">
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Processing Order...</span></div>
                  ) : (
                    <div className="flex items-center space-x-2"><Shield className="w-4 h-4" /><span>Place Order via WhatsApp</span></div>
                  )}
                </Button>
                <div className="text-center">
                  <p className="text-[11px] text-slate-500">By placing this order, you agree to our terms and conditions. Your order will be sent via WhatsApp for instant confirmation.</p>
                  <div className="flex items-center justify-center space-x-4 mt-2 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1"><Shield className="w-3 h-3" /><span>Secure</span></span>
                    <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Fast</span></span>
                    <span className="flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Guaranteed</span></span>
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