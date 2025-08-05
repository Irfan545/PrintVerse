"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Type,
  Image,
  Palette,
  Trash2,
  Download,
  ShoppingCart,
  RotateCw,
  Move,
  Layers,
  Settings,
  Eye,
  Lock,
  Square,
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { formatPrice } from "@/lib/utils";
import LayerPanel from "@/components/design/layer-panel";
import TextTools from "@/components/design/text-tools";
import ShapeTools from "@/components/design/shape-tools";
import Link from "next/link";

export default function DesignPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "Custom T-Shirt",
    price: 999,
    image: "/Images/tshirt.jpg",
  });

  const products = [
    { name: "Custom T-Shirt", price: 999, image: "/Images/tshirt.jpg" },
    { name: "Custom Hoodie", price: 1499, image: "/Images/Hoodie.jpg" }, // Placeholder
    { name: "Custom Mug", price: 499, image: "/Images/Mug.jpg" }, // Placeholder
  ];
  const [activeTool, setActiveTool] = useState<
    "text" | "shapes" | "layers" | "basic"
  >("basic");
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (canvasRef.current) {
      // Wait for the next tick to ensure canvas element is fully rendered
      const initCanvas = () => {
        try {
          // Dispose existing canvas if it exists
          if (canvas && canvas.dispose) {
            try {
              canvas.dispose();
            } catch (error) {
              console.log("Canvas already disposed or not found");
            }
          }
          setIsCanvasReady(false);

          const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
            width: 400,
            height: 500,
            backgroundColor: "#ffffff",
            selection: true,
            preserveObjectStacking: true,
          });

          setCanvas(fabricCanvas);
          setIsCanvasReady(true);

          // Add event listeners to prevent product template interference
          fabricCanvas.on("mouse:down", (e) => {
            if (e.target && e.target.name === "product-template") {
              return;
            }
          });

          // Ensure selected objects stay above product template
          fabricCanvas.on("selection:created", (e) => {
            if (e.selected && e.selected.length > 0) {
              e.selected.forEach((obj) => {
                if (obj.name !== "product-template") {
                  fabricCanvas.bringToFront(obj);
                }
              });
            }
          });

          fabricCanvas.on("selection:updated", (e) => {
            if (e.selected && e.selected.length > 0) {
              e.selected.forEach((obj) => {
                if (obj.name !== "product-template") {
                  fabricCanvas.bringToFront(obj);
                }
              });
            }
          });

          // Prevent deletion of product template via keyboard
          fabricCanvas.on("key:down", (e) => {
            const activeObject = fabricCanvas.getActiveObject();
            if (activeObject && activeObject.name === "product-template") {
              // Prevent deletion of product template
              return;
            }
          });

          // Prevent removal of product template
          fabricCanvas.on("object:removed", (e) => {
            if (e.target && e.target.name === "product-template") {
              // Re-add the product template if it was accidentally removed
              setTimeout(() => {
                loadProductImage();
              }, 100);
            }
          });

          // Load product template as a separate layer
          const loadProductImage = () => {
            // Create a fallback background first
            if (fabricCanvas) {
              fabricCanvas.setBackgroundColor(
                "#f3f4f6",
                fabricCanvas.renderAll.bind(fabricCanvas)
              );
            }

            try {
              fabric.Image.fromURL(
                selectedProduct.image,
                (img) => {
                  if (img && fabricCanvas) {
                    img.scaleToWidth(400);
                    img.set({
                      left: 0,
                      top: 0,
                      selectable: false,
                      hasControls: false,
                      hasBorders: false,
                      lockMovementX: true,
                      lockMovementY: true,
                      lockRotation: true,
                      lockScalingX: true,
                      lockScalingY: true,
                      name: "product-template",
                      evented: false,
                      excludeFromExport: false,
                      lockUniScaling: true,
                      lockScalingFlip: true,
                    });
                    fabricCanvas.add(img);
                    fabricCanvas.sendToBack(img);
                    fabricCanvas.renderAll();
                  }
                },
                { crossOrigin: "anonymous" }
              );
            } catch (error) {
              console.error("Error in loadProductImage:", error);
              // Background is already set as fallback
            }
          };

          // Delay loading to ensure canvas is ready
          setTimeout(loadProductImage, 200);
        } catch (error) {
          console.error("Error initializing canvas:", error);
        }
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(initCanvas);

      return () => {
        // Cleanup is handled in the next useEffect initialization
      };
    }
  }, [selectedProduct.image]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (canvas && canvas.dispose) {
        try {
          canvas.dispose();
        } catch (error) {
          console.log("Canvas cleanup error:", error);
        }
      }
    };
  }, [canvas]);

  const addText = () => {
    if (!canvas || !canvasRef.current || !isCanvasReady) return;

    const text = new fabric.IText("Add your text here", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#000000",
      editable: true,
      selectable: true,
      hasControls: true,
      hasBorders: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addImage = () => {
    if (!canvas || !canvasRef.current || !isCanvasReady) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fabric.Image.fromURL(event.target?.result as string, (img) => {
            img.scaleToWidth(100);
            img.set({
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addShape = (shapeType: "rect" | "circle") => {
    if (!canvas || !canvasRef.current || !isCanvasReady) return;

    let shape: fabric.Object;

    if (shapeType === "rect") {
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: "#ff0000",
        stroke: "#000000",
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });
    } else {
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: "#00ff00",
        stroke: "#000000",
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas || !canvasRef.current || !isCanvasReady) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.name !== "product-template") {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (!canvas || !canvasRef.current || !isCanvasReady) return;

    // Clear all objects except the product template
    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      if (obj.name !== "product-template") {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
  };

  const downloadDesign = () => {
    if (!canvas || !canvasRef.current || !isCanvasReady) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.download = "design.png";
    link.href = dataURL;
    link.click();
  };

  const addToCart = () => {
    if (!canvas || !canvasRef.current || !isCanvasReady) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    addItem({
      id: `custom-${Date.now()}`,
      productId: "custom",
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: 1,
      image: dataURL,
      customization: {
        design: dataURL,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with 3D Customizer Link */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              2D Design Studio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create custom designs with our powerful 2D editor
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/customizer3d">🎨 Try 3D Customizer</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/test-models">🧪 Test 3D Models</Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Design Tools */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tool Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeTool === "basic" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("basic")}
                  >
                    Basic
                  </Button>
                  <Button
                    variant={activeTool === "text" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("text")}
                  >
                    <Type className="h-4 w-4 mr-1" />
                    Text
                  </Button>
                  <Button
                    variant={activeTool === "shapes" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("shapes")}
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Shapes
                  </Button>
                  <Button
                    variant={activeTool === "layers" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTool("layers")}
                  >
                    <Layers className="h-4 w-4 mr-1" />
                    Layers
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Tool Panel */}
            {activeTool === "basic" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Basic Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={addText} variant="outline" size="sm">
                      <Type className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                    <Button onClick={addImage} variant="outline" size="sm">
                      <Image className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    <Button
                      onClick={() => addShape("rect")}
                      variant="outline"
                      size="sm"
                    >
                      Rectangle
                    </Button>
                    <Button
                      onClick={() => addShape("circle")}
                      variant="outline"
                      size="sm"
                    >
                      Circle
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={deleteSelected}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button onClick={clearCanvas} variant="outline" size="sm">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTool === "text" && <TextTools canvas={canvas} />}
            {activeTool === "shapes" && <ShapeTools canvas={canvas} />}
            {activeTool === "layers" && <LayerPanel canvas={canvas} />}

            {/* Product Selection */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Product Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <Button
                      key={product.name}
                      variant={
                        selectedProduct.name === product.name
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <span className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-2 inline-block"></span>
                      {product.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Product:
                    </span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Price:
                    </span>
                    <span className="font-medium">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button onClick={addToCart} className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={downloadDesign}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Design
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Design Canvas
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click and drag to move objects. Double-click text to edit. Use
                  corner handles to resize.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <canvas ref={canvasRef} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
