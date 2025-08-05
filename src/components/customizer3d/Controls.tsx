"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Palette, RotateCw, Download } from "lucide-react";

interface ControlsProps {
  onTextureUpload: (textureUrl: string) => void;
  onColorChange: (color: string) => void;
  onReset: () => void;
  onDownload?: () => void;
  onTexturePositionChange?: (position: {
    x: number;
    y: number;
    z: number;
  }) => void;
  onTextureScaleChange?: (scale: { x: number; y: number; z: number }) => void;
  onTextureRotationChange?: (rotation: {
    x: number;
    y: number;
    z: number;
  }) => void;
  fabricColor: string;
  uploadedTexture?: string;
  texturePosition?: { x: number; y: number; z: number };
  textureScale?: { x: number; y: number; z: number };
  textureRotation?: { x: number; y: number; z: number };
}

const PRESET_COLORS = [
  "#ffffff", // White
  "#000000", // Black
  "#ff0000", // Red
  "#00ff00", // Green
  "#0000ff", // Blue
  "#ffff00", // Yellow
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
  "#ffa500", // Orange
  "#800080", // Purple
  "#a52a2a", // Brown
  "#808080", // Gray
];

export default function Controls({
  onTextureUpload,
  onColorChange,
  onReset,
  onDownload,
  onTexturePositionChange,
  onTextureScaleChange,
  onTextureRotationChange,
  fabricColor,
  uploadedTexture,
  texturePosition = { x: 0, y: 0, z: 0 },
  textureScale = { x: 2, y: 2, z: 1 },
  textureRotation = { x: 0, y: 0, z: 0 },
}: ControlsProps) {
  const [selectedColor, setSelectedColor] = useState(fabricColor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onTextureUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handleReset = () => {
    setSelectedColor("#ffffff");
    onColorChange("#ffffff");
    onReset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    const newPosition = { ...texturePosition, [axis]: value };
    onTexturePositionChange?.(newPosition);
  };

  const handleScaleChange = (axis: "x" | "y" | "z", value: number) => {
    const newScale = { ...textureScale, [axis]: value };
    onTextureScaleChange?.(newScale);
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    const newRotation = { ...textureRotation, [axis]: value };
    onTextureRotationChange?.(newRotation);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
            Upload Design
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="texture-upload" className="text-sm">
              Upload Image
            </Label>
            <Input
              id="texture-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="cursor-pointer text-xs sm:text-sm"
            />
            <p className="text-xs text-gray-500">
              Upload PNG, JPG, or SVG files. Recommended size: 512x512px
            </p>
          </div>

          {uploadedTexture && (
            <div className="space-y-2">
              <Label className="text-sm">Preview</Label>
              <div className="w-full h-24 sm:h-32 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <img
                  src={uploadedTexture}
                  alt="Uploaded design"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Color Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
            Fabric Color
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color-picker" className="text-sm">
              Custom Color
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="color-picker"
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-8 sm:w-16 sm:h-10 p-1"
              />
              <Input
                type="text"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#ffffff"
                className="flex-1 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Preset Colors</Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedColor === color
                      ? "border-blue-500 scale-110"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full text-xs sm:text-sm"
          >
            <RotateCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Reset Design
          </Button>

          {onDownload && (
            <Button
              onClick={onDownload}
              variant="outline"
              className="w-full text-xs sm:text-sm"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Download Preview
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Texture Positioning Controls */}
      {uploadedTexture && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg">🎯</span>
              Texture Position
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Position Controls */}
            <div className="space-y-2">
              <Label className="text-sm">Position</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={texturePosition.x}
                    onChange={(e) =>
                      handlePositionChange("x", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={texturePosition.y}
                    onChange={(e) =>
                      handlePositionChange("y", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Z</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={texturePosition.z}
                    onChange={(e) =>
                      handlePositionChange("z", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Scale Controls */}
            <div className="space-y-2">
              <Label className="text-sm">Scale</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={textureScale.x}
                    onChange={(e) =>
                      handleScaleChange("x", parseFloat(e.target.value) || 1)
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={textureScale.y}
                    onChange={(e) =>
                      handleScaleChange("y", parseFloat(e.target.value) || 1)
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Z</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={textureScale.z}
                    onChange={(e) =>
                      handleScaleChange("z", parseFloat(e.target.value) || 1)
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="space-y-2">
              <Label className="text-sm">Rotation (Radians)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={textureRotation.x}
                    onChange={(e) =>
                      handleRotationChange("x", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={textureRotation.y}
                    onChange={(e) =>
                      handleRotationChange("y", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Z</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={textureRotation.z}
                    onChange={(e) =>
                      handleRotationChange("z", parseFloat(e.target.value) || 0)
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Quick Position Buttons */}
            <div className="space-y-2">
              <Label className="text-sm">Quick Positions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onTexturePositionChange?.({ x: 0, y: 0, z: 1 })
                  }
                  className="text-xs"
                >
                  Center
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTextureScaleChange?.({ x: 2, y: 2, z: 1 })}
                  className="text-xs"
                >
                  Reset Scale
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onTextureRotationChange?.({ x: 0, y: 0, z: 0 })
                  }
                  className="text-xs"
                >
                  Reset Rotation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onTexturePositionChange?.({ x: 0, y: 0, z: 1 });
                    onTextureScaleChange?.({ x: 2, y: 2, z: 1 });
                    onTextureRotationChange?.({ x: 0, y: 0, z: 0 });
                  }}
                  className="text-xs"
                >
                  Reset All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
