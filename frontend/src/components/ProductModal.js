import React, { useState } from 'react';
import { X, Star, Award, Clock, Thermometer, Package, Shield, Leaf } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-amber-100 dark:border-slate-700 shadow-2xl">
        <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-amber-100 dark:border-slate-700 p-6 flex justify-between items-center rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 butcher-title">{product.name}</h2>
            <p className="text-amber-600 dark:text-amber-400 premium-text">Premium Quality • Fresh Daily</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-rose-50 dark:hover:bg-slate-800 rounded-full p-3"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
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
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-amber-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-amber-500 fill-current" />
                      <span className="font-bold text-lg text-slate-800 dark:text-slate-200">{product.rating}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-sm">rating</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 butcher-title">₹{product.pricePerKg}/kg</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
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
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-lg premium-text">
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover-lift px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Quality Indicators */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover-lift">
                    <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">100% Fresh</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover-lift">
                    <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Hygienic</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover-lift">
                    <Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-green-700 dark:text-green-400">Antibiotic-Free</p>
                  </div>
                </div>
              </div>

              {/* Weight Selection */}
              <Card className="mb-8 product-card border-2 border-amber-200 dark:border-slate-600">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-200 butcher-title flex items-center gap-2">
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
                            ? "btn-premium shadow-lg scale-105"
                            : "border-2 border-amber-200 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800"
                        }`}
                      >
                        <span className="font-bold text-lg">{weightOption.weight}</span>
                        <span className="text-sm opacity-90">₹{weightOption.price}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Selected:</span>
                      <span className="font-bold text-xl text-amber-700 dark:text-amber-400 butcher-title">
                        {selectedWeight.weight} - ₹{selectedWeight.price}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 premium-text">
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
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-amber-50 dark:bg-slate-800 rounded-2xl p-1">
              <TabsTrigger value="nutrition" className="rounded-xl font-semibold">Nutrition</TabsTrigger>
              <TabsTrigger value="benefits" className="rounded-xl font-semibold">Benefits</TabsTrigger>
              <TabsTrigger value="cooking" className="rounded-xl font-semibold">Cooking Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nutrition">
              <Card className="product-card border-2 border-emerald-200 dark:border-emerald-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl butcher-title">
                    <Award className="w-6 h-6 text-emerald-600" />
                    <span>Nutritional Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl hover-lift">
                      <div className="text-3xl font-bold text-emerald-600 mb-2 butcher-title">
                        {nutritionalInfo.protein}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Protein</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover-lift">
                      <div className="text-3xl font-bold text-blue-600 mb-2 butcher-title">
                        {nutritionalInfo.fat}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Fat</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl hover-lift">
                      <div className="text-3xl font-bold text-purple-600 mb-2 butcher-title">
                        {nutritionalInfo.calories}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Calories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="benefits">
              <Card className="product-card border-2 border-amber-200 dark:border-amber-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl butcher-title">
                    <Star className="w-6 h-6 text-amber-600" />
                    <span>Health Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover-lift">
                        <div className="bg-emerald-500 rounded-full p-2 mt-1 shadow-sm">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 premium-text font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cooking">
              <Card className="product-card border-2 border-rose-200 dark:border-rose-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl butcher-title">
                    <Thermometer className="w-6 h-6 text-rose-600" />
                    <span>Cooking Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cookingTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl hover-lift">
                        <div className="bg-rose-500 rounded-full p-2 mt-1 shadow-sm">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 premium-text font-medium">{tip}</span>
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