"use client";

import { useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Square,
  Circle,
  Triangle,
  Star,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Hexagon,
  Pentagon,
  Octagon,
  Heart,
  Diamond,
  Cross,
  Plus,
  Minus,
  Palette,
} from "lucide-react";

interface ShapeToolsProps {
  canvas: fabric.Canvas | null;
}

const SHAPES = [
  { name: "Rectangle", icon: Square, type: "rect" },
  { name: "Circle", icon: Circle, type: "circle" },
  { name: "Triangle", icon: Triangle, type: "triangle" },
  { name: "Star", icon: Star, type: "star" },
  { name: "Arrow Right", icon: ArrowRight, type: "arrow-right" },
  { name: "Arrow Up", icon: ArrowUp, type: "arrow-up" },
  { name: "Arrow Down", icon: ArrowDown, type: "arrow-down" },
  { name: "Arrow Left", icon: ArrowLeft, type: "arrow-left" },
  { name: "Hexagon", icon: Hexagon, type: "hexagon" },
  { name: "Pentagon", icon: Pentagon, type: "pentagon" },
  { name: "Octagon", icon: Octagon, type: "octagon" },
  { name: "Diamond", icon: Diamond, type: "diamond" },
  { name: "Cross", icon: Cross, type: "cross" },
  { name: "Plus", icon: Plus, type: "plus" },
  { name: "Minus", icon: Minus, type: "minus" },
];

export default function ShapeTools({ canvas }: ShapeToolsProps) {
  const [fillColor, setFillColor] = useState("#ff0000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [shapeSize, setShapeSize] = useState(50);

  const createShape = (shapeType: string) => {
    if (!canvas) return;

    let shape: fabric.Object;

    const commonProps = {
      left: 100,
      top: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
    };

    switch (shapeType) {
      case "rect":
        shape = new fabric.Rect({
          ...commonProps,
          width: shapeSize,
          height: shapeSize,
        });
        break;

      case "circle":
        shape = new fabric.Circle({
          ...commonProps,
          radius: shapeSize / 2,
        });
        break;

      case "triangle":
        shape = new fabric.Triangle({
          ...commonProps,
          width: shapeSize,
          height: shapeSize,
        });
        break;

      case "star":
        shape = new fabric.Polygon(
          generateStarPoints(5, shapeSize / 2, shapeSize / 4),
          {
            ...commonProps,
            originX: "center",
            originY: "center",
          }
        );
        break;

      case "arrow-right":
        shape = new fabric.Polygon(
          [
            { x: 0, y: -shapeSize / 4 },
            { x: shapeSize / 2, y: -shapeSize / 4 },
            { x: shapeSize / 2, y: -shapeSize / 2 },
            { x: shapeSize, y: 0 },
            { x: shapeSize / 2, y: shapeSize / 2 },
            { x: shapeSize / 2, y: shapeSize / 4 },
            { x: 0, y: shapeSize / 4 },
          ],
          {
            ...commonProps,
            originX: "center",
            originY: "center",
          }
        );
        break;

      case "arrow-up":
        shape = new fabric.Polygon(
          [
            { x: -shapeSize / 4, y: 0 },
            { x: -shapeSize / 4, y: shapeSize / 2 },
            { x: -shapeSize / 2, y: shapeSize / 2 },
            { x: 0, y: shapeSize },
            { x: shapeSize / 2, y: shapeSize / 2 },
            { x: shapeSize / 4, y: shapeSize / 2 },
            { x: shapeSize / 4, y: 0 },
          ],
          {
            ...commonProps,
            originX: "center",
            originY: "center",
          }
        );
        break;

      case "arrow-down":
        shape = new fabric.Polygon(
          [
            { x: -shapeSize / 4, y: 0 },
            { x: -shapeSize / 4, y: -shapeSize / 2 },
            { x: -shapeSize / 2, y: -shapeSize / 2 },
            { x: 0, y: -shapeSize },
            { x: shapeSize / 2, y: -shapeSize / 2 },
            { x: shapeSize / 4, y: -shapeSize / 2 },
            { x: shapeSize / 4, y: 0 },
          ],
          {
            ...commonProps,
            originX: "center",
            originY: "center",
          }
        );
        break;

      case "arrow-left":
        shape = new fabric.Polygon(
          [
            { x: 0, y: -shapeSize / 4 },
            { x: -shapeSize / 2, y: -shapeSize / 4 },
            { x: -shapeSize / 2, y: -shapeSize / 2 },
            { x: -shapeSize, y: 0 },
            { x: -shapeSize / 2, y: shapeSize / 2 },
            { x: -shapeSize / 2, y: shapeSize / 4 },
            { x: 0, y: shapeSize / 4 },
          ],
          {
            ...commonProps,
            originX: "center",
            originY: "center",
          }
        );
        break;

      case "hexagon":
        shape = new fabric.Polygon(generatePolygonPoints(6, shapeSize / 2), {
          ...commonProps,
          originX: "center",
          originY: "center",
        });
        break;

      case "pentagon":
        shape = new fabric.Polygon(generatePolygonPoints(5, shapeSize / 2), {
          ...commonProps,
          originX: "center",
          originY: "center",
        });
        break;

      case "octagon":
        shape = new fabric.Polygon(generatePolygonPoints(8, shapeSize / 2), {
          ...commonProps,
          originX: "center",
          originY: "center",
        });
        break;

      case "diamond":
        shape = new fabric.Polygon(
          [
            { x: 0, y: -shapeSize / 2 },
            { x: shapeSize / 2, y: 0 },
            { x: 0, y: shapeSize / 2 },
            { x: -shapeSize / 2, y: 0 },
          ],
          {
            ...commonProps,
            originX: "center",
            originY: "center",
          }
        );
        break;

      case "cross":
        shape = new fabric.Group(
          [
            new fabric.Rect({
              left: -shapeSize / 6,
              top: -shapeSize / 2,
              width: shapeSize / 3,
              height: shapeSize,
              fill: fillColor,
              stroke: strokeColor,
              strokeWidth: strokeWidth,
            }),
            new fabric.Rect({
              left: -shapeSize / 2,
              top: -shapeSize / 6,
              width: shapeSize,
              height: shapeSize / 3,
              fill: fillColor,
              stroke: strokeColor,
              strokeWidth: strokeWidth,
            }),
          ],
          {
            left: 100,
            top: 100,
          }
        );
        break;

      case "plus":
        shape = new fabric.Group(
          [
            new fabric.Rect({
              left: -shapeSize / 6,
              top: -shapeSize / 2,
              width: shapeSize / 3,
              height: shapeSize,
              fill: fillColor,
              stroke: strokeColor,
              strokeWidth: strokeWidth,
            }),
            new fabric.Rect({
              left: -shapeSize / 2,
              top: -shapeSize / 6,
              width: shapeSize,
              height: shapeSize / 3,
              fill: fillColor,
              stroke: strokeColor,
              strokeWidth: strokeWidth,
            }),
          ],
          {
            left: 100,
            top: 100,
          }
        );
        break;

      case "minus":
        shape = new fabric.Rect({
          ...commonProps,
          width: shapeSize,
          height: shapeSize / 3,
        });
        break;

      default:
        shape = new fabric.Rect({
          ...commonProps,
          width: shapeSize,
          height: shapeSize,
        });
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const generatePolygonPoints = (sides: number, radius: number) => {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }
    return points;
  };

  const generateStarPoints = (
    points: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    const starPoints = [];
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      starPoints.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }
    return starPoints;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Square className="h-5 w-5" />
          Shape Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shape Grid */}
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map((shape) => (
            <Button
              key={shape.type}
              variant="outline"
              size="sm"
              onClick={() => createShape(shape.type)}
              className="flex flex-col items-center gap-1 h-16"
            >
              <shape.icon className="h-4 w-4" />
              <span className="text-xs">{shape.name}</span>
            </Button>
          ))}
        </div>

        {/* Shape Properties */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="shape-size">Size</Label>
            <Input
              id="shape-size"
              type="range"
              min="20"
              max="200"
              step="10"
              value={shapeSize}
              onChange={(e) => setShapeSize(Number(e.target.value))}
            />
            <div className="text-xs text-gray-500">{shapeSize}px</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fill-color">Fill Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="fill-color"
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="flex-1"
                placeholder="#ff0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stroke-color">Stroke Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="stroke-color"
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stroke-width">Stroke Width</Label>
            <Input
              id="stroke-width"
              type="range"
              min="0"
              max="10"
              step="1"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
            />
            <div className="text-xs text-gray-500">{strokeWidth}px</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
