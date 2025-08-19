import React, { useState } from 'react';
import { X, Award, Clock, Thermometer, Package, Shield, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [selectedWeight, setSelectedWeight] = useState(product.weights[0]);

  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight.weight, selectedWeight.price);
    onClose();
  };

  // Default nutritional info for different meat types
  const getDefaultNutrition = (category) => {
    const nutritionData = {
      chicken: {
        protein: "31g per 100g",
        fat: "3.6g per 100g", 
        calories: "165 per 100g"
      },
      mutton: {
        protein: "25g per 100g",
        fat: "21g per 100g",
        calories: "294 per 100g"
      },
      fish: {
        protein: "20g per 100g",
        fat: "5g per 100g",
        calories: "206 per 100g"
      },
      processed: {
        protein: "18g per 100g",
        fat: "15g per 100g",
        calories: "250 per 100g"
      }
    };
    return nutritionData[category] || nutritionData.chicken;
  };

  const getDefaultBenefits = (category) => {
    const benefitsData = {
      chicken: [
        "High in protein for muscle building",
        "Low in fat and calories",
        "Rich in vitamins B6 and B12",
        "Good source of phosphorus and selenium"
      ],
      mutton: [
        "Excellent source of iron",
        "High in protein and zinc",
        "Rich in vitamin B12",
        "Contains conjugated linoleic acid (CLA)"
      ],
      fish: [
        "Rich in omega-3 fatty acids",
        "Good source of iodine",
        "High quality protein",
        "Contains vitamin D"
      ],
      processed: [
        "Convenient and ready to cook",
        "Blend of spices and herbs",
        "Good protein source",
        "Perfect for quick meals"
      ]
    };
    return benefitsData[category] || benefitsData.chicken;
  };

  const getDefaultCookingTips = (category, productName) => {
    const tipsData = {
      chicken: [
        "Marinate for 30 minutes for best flavor",
        "Cook at medium heat to retain tenderness",
        "Internal temperature should reach 75°C",
        "Let it rest for 5 minutes after cooking"
      ],
      mutton: [
        "Marinate for at least 2 hours",
        "Cook slowly on low heat for tenderness",
        "Internal temperature should reach 60-65°C",
        "Perfect for slow cooking and curries"
      ],
      fish: [
        "Don't overcook to maintain moisture",
        "Season well before cooking",
        "Cook until flesh flakes easily",
        "Best grilled, fried, or in curry"
      ],
      processed: [
        "Follow cooking instructions on package",
        "Can be grilled, fried, or baked",
        "Pre-seasoned, no extra spices needed",
        "Cook until heated through"
      ]
    };
    return tipsData[category] || tipsData.chicken;
  };

  const nutritionalInfo = product.nutritionalInfo || getDefaultNutrition(product.category);
  const benefits = product.benefits || getDefaultBenefits(product.category);  
  const cookingTips = product.cookingTips || getDefaultCookingTips(product.category, product.name);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full h-full md:max-w-5xl md:w-full md:max-h-[95vh] md:rounded-3xl overflow-hidden border-0 md:border border-amber-100 shadow-2xl flex flex-col">
        <div className="bg-white/95 backdrop-blur-md border-b border-amber-100 p-4 md:p-6 flex justify-between items-center md:rounded-t-3xl flex-shrink-0">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 butcher-title">{product.name}</h2>
            <p className="text-amber-600 premium-text text-sm md:text-base">Premium Quality • Fresh Daily</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-rose-50 rounded-full p-2 md:p-3"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-6 md:mb-10">
            {/* Product Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-96 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-emerald-500 text-white px-4 py-2 font-bold shadow-lg animate-pulse">
                  ✨ New Arrival
                </Badge>
              )}
              {product.discount && (
                <Badge className="absolute top-4 right-4 bg-rose-500 text-white px-4 py-2 font-bold shadow-lg">
                  🔥 {product.discount}% OFF
                </Badge>
              )}
              
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-amber-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-right w-full">
                      <p className="text-2xl font-bold text-amber-700 butcher-title">₹{product.pricePerKg}/kg</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-amber-100 text-amber-700 border border-amber-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-8">
                <p className="text-slate-600 mb-6 leading-relaxed text-lg premium-text">
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-amber-200 text-amber-700 hover-lift px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Quality Indicators */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl hover-lift">
                    <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-emerald-700">100% Fresh</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl hover-lift">
                    <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-blue-700">Hygienic</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl hover-lift">
                    <Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-green-700">Antibiotic-Free</p>
                  </div>
                </div>
              </div>

              {/* Weight Selection */}
              <Card className="mb-8 product-card border-2 border-amber-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-800 butcher-title flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    Select Quantity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {product.weights.map((weightOption) => (
                      <Button
                        key={weightOption.weight}
                        variant={selectedWeight.weight === weightOption.weight ? "default" : "outline"}
                        onClick={() => setSelectedWeight(weightOption)}
                        className={`flex flex-col p-6 h-auto transition-all duration-300 hover-lift ${
                          selectedWeight.weight === weightOption.weight
                            ? "btn-premium shadow-lg scale-105 text-white"
                            : "border-2 border-amber-200 hover:bg-amber-50 bg-white text-slate-800"
                        }`}
                      >
                        <span className={`font-bold text-lg ${
                          selectedWeight.weight === weightOption.weight 
                            ? "text-white" 
                            : "text-slate-800"
                        }`}>
                          {weightOption.weight}
                        </span>
                        <span className={`text-sm opacity-90 ${
                          selectedWeight.weight === weightOption.weight 
                            ? "text-white" 
                            : "text-amber-700"
                        }`}>
                          ₹{weightOption.price}
                        </span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-700 font-medium">Selected:</span>
                      <span className="font-bold text-xl text-amber-700 butcher-title">
                        {selectedWeight.weight} - ₹{selectedWeight.price}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 premium-text">
                      Price per kg: ₹{product.pricePerKg} • Category: {product.category}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add to Cart Button */}
              <Button 
                onClick={handleAddToCart}
                className="w-full btn-premium py-8 text-xl font-bold rounded-2xl shadow-xl hover-lift"
                size="lg"
              >
                🛒 Add to Cart - ₹{selectedWeight.price}
              </Button>
            </div>
          </div>

          {/* Additional Information Tabs */}
          <Tabs defaultValue="nutrition" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-amber-50 rounded-2xl p-1">
              <TabsTrigger value="nutrition" className="rounded-xl font-semibold text-slate-700">Nutrition</TabsTrigger>
              <TabsTrigger value="benefits" className="rounded-xl font-semibold text-slate-700">Benefits</TabsTrigger>
              <TabsTrigger value="cooking" className="rounded-xl font-semibold text-slate-700">Cooking Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nutrition">
              <Card className="product-card border-2 border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl butcher-title text-slate-800">
                    <Award className="w-6 h-6 text-emerald-600" />
                    <span>Nutritional Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-emerald-50 rounded-2xl hover-lift">
                      <div className="text-3xl font-bold text-emerald-600 mb-2 butcher-title">
                        {nutritionalInfo.protein}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">Protein</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-2xl hover-lift">
                      <div className="text-3xl font-bold text-blue-600 mb-2 butcher-title">
                        {nutritionalInfo.fat}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">Fat</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-2xl hover-lift">
                      <div className="text-3xl font-bold text-purple-600 mb-2 butcher-title">
                        {nutritionalInfo.calories}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">Calories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="benefits">
              <Card className="product-card border-2 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl butcher-title text-slate-800">
                    <Award className="w-6 h-6 text-amber-600" />
                    <span>Health Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-amber-50 rounded-xl hover-lift">
                        <div className="bg-emerald-500 rounded-full p-2 mt-1 shadow-sm">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-slate-700 premium-text font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cooking">
              <Card className="product-card border-2 border-rose-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl butcher-title text-slate-800">
                    <Thermometer className="w-6 h-6 text-rose-600" />
                    <span>Cooking Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cookingTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-rose-50 rounded-xl hover-lift">
                        <div className="bg-rose-500 rounded-full p-2 mt-1 shadow-sm">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-700 premium-text font-medium">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;