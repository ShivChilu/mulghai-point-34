import React, { useState } from 'react';
import { X, Star, Award, Clock, Thermometer } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                  New Arrival
                </Badge>
              )}
              {product.discount && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                  {product.discount}% OFF
                </Badge>
              )}
              
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white bg-opacity-90 backdrop-blur rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                    <div className="flex space-x-1">
                      {product.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-amber-200 text-amber-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Weight Selection */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Select Quantity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {product.weights.map((weightOption) => (
                      <Button
                        key={weightOption.weight}
                        variant={selectedWeight.weight === weightOption.weight ? "default" : "outline"}
                        onClick={() => setSelectedWeight(weightOption)}
                        className={`flex flex-col p-4 h-auto ${
                          selectedWeight.weight === weightOption.weight
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "border-amber-200 hover:bg-amber-50"
                        }`}
                      >
                        <span className="font-semibold">{weightOption.weight}</span>
                        <span className="text-sm">₹{weightOption.price}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Selected:</span>
                      <span className="font-semibold text-amber-700">
                        {selectedWeight.weight} - ₹{selectedWeight.price}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Price per kg: ₹{product.pricePerKg}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add to Cart Button */}
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-semibold"
                size="lg"
              >
                Add to Cart - ₹{selectedWeight.price}
              </Button>
            </div>
          </div>

          {/* Additional Information Tabs */}
          <Tabs defaultValue="nutrition" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="cooking">Cooking Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nutrition">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span>Nutritional Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {product.nutritionalInfo.protein}
                      </div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {product.nutritionalInfo.fat}
                      </div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {product.nutritionalInfo.calories}
                      </div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="benefits">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-600" />
                    <span>Health Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="bg-green-100 rounded-full p-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cooking">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-amber-600" />
                    <span>Cooking Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.cookingTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="bg-amber-100 rounded-full p-1 mt-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
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