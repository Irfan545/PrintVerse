"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Controls from "@/components/customizer3d/Controls";
import Working3DCanvas from "@/components/customizer3d/Working3DCanvas";
import { ArrowLeft, ShoppingCart, Download } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/use-cart-store";
import { formatPrice } from "@/lib/utils";

const PRODUCT_MODELS = [
  {
    id: "tshirt",
    name: "T-Shirt",
    path: "/models/Tshirt.glb",
    price: 999,
    image: "/Images/tshirt.jpg",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    path: "/models/Hoodie.glb",
    price: 1499,
    image: "/Images/tshirt.jpg", // Placeholder
  },
  {
    id: "mug",
    name: "Coffee Mug",
    path: "/models/Mug.glb",
    price: 499,
    image: "/Images/tshirt.jpg", // Placeholder
  },
];

export default function Customizer3DPage() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_MODELS[0]);
  const [uploadedTexture, setUploadedTexture] = useState<string | undefined>();
  const [fabricColor, setFabricColor] = useState("#ffffff");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [texturePosition, setTexturePosition] = useState({ x: 0, y: 0, z: 1 });
  const [textureScale, setTextureScale] = useState({ x: 2, y: 2, z: 1 });
  const [textureRotation, setTextureRotation] = useState({ x: 0, y: 0, z: 0 });

  const { addItem } = useCartStore();

  const handleTextureUpload = (textureUrl: string) => {
    setUploadedTexture(textureUrl);
  };

  const handleColorChange = (color: string) => {
    setFabricColor(color);
  };

  const handleReset = () => {
    setUploadedTexture(undefined);
    setFabricColor("#ffffff");
    setTexturePosition({ x: 0, y: 0, z: 1 });
    setTextureScale({ x: 2, y: 2, z: 1 });
    setTextureRotation({ x: 0, y: 0, z: 0 });
  };

  const handleAddToCart = () => {
    addItem({
      id: `custom-3d-${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      name: `Custom ${selectedProduct.name}`,
      price: selectedProduct.price,
      quantity: 1,
      image: selectedProduct.image,
      customization: {
        design: uploadedTexture,
        color: fabricColor,
        modelPath: selectedProduct.path,
      },
    });
  };

  const handleDownload = () => {
    // In a real implementation, you'd capture the canvas and download it
    console.log("Download functionality would be implemented here");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button variant="outline" size="sm" asChild className="w-fit">
              <Link href="/design">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to 2D Designer
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                3D Product Customizer
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Design your products in 3D with real-time preview
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Badge variant="secondary" className="w-fit">
              {isModelLoaded ? "Ready" : "Loading..."}
            </Badge>
            <Button
              onClick={handleAddToCart}
              disabled={!isModelLoaded}
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add to Cart - </span>
              {formatPrice(selectedProduct.price)}
            </Button>
          </div>
        </div>

        {/* Product Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {PRODUCT_MODELS.map((product) => (
                <Button
                  key={product.id}
                  variant={
                    selectedProduct.id === product.id ? "default" : "outline"
                  }
                  className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-lg sm:text-2xl">🎨</span>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm sm:text-base">
                      {product.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Controls */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <Controls
              onTextureUpload={handleTextureUpload}
              onColorChange={handleColorChange}
              onReset={handleReset}
              onDownload={handleDownload}
              onTexturePositionChange={setTexturePosition}
              onTextureScaleChange={setTextureScale}
              onTextureRotationChange={setTextureRotation}
              fabricColor={fabricColor}
              uploadedTexture={uploadedTexture}
              texturePosition={texturePosition}
              textureScale={textureScale}
              textureRotation={textureRotation}
            />
          </div>

          {/* 3D Canvas */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🎨</span>
                  <span className="text-base sm:text-lg">
                    3D Preview - {selectedProduct.name}
                  </span>
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Drag to rotate, scroll to zoom, right-click to pan
                </p>
              </CardHeader>
              <CardContent>
                <Working3DCanvas
                  modelPath={selectedProduct.path}
                  uploadedTexture={uploadedTexture}
                  fabricColor={fabricColor}
                  texturePosition={texturePosition}
                  textureScale={textureScale}
                  textureRotation={textureRotation}
                  onModelLoad={() => setIsModelLoaded(true)}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use the 3D Customizer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm sm:text-base">
                  1. Upload Design
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Upload your custom design or logo. Supported formats: PNG,
                  JPG, SVG. Recommended size: 512x512 pixels for best quality.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm sm:text-base">
                  2. Choose Color
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Select from preset colors or use the color picker to choose
                  your perfect fabric color. Changes apply in real-time.
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <h4 className="font-medium text-sm sm:text-base">
                  3. Position & Preview
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Use the position controls to move, scale, and rotate your
                  uploaded design on the 3D model. The design appears as a
                  movable square that you can position anywhere on the model
                  surface.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
