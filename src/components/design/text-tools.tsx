"use client";

import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  RotateCw,
} from "lucide-react";

interface TextToolsProps {
  canvas: fabric.Canvas | null;
}

const FONT_FAMILIES = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Courier New",
  "Impact",
  "Comic Sans MS",
  "Trebuchet MS",
  "Arial Black",
  "Lucida Console",
  "Tahoma",
  "Garamond",
  "Bookman",
  "Avant Garde",
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96];

export default function TextTools({ canvas }: TextToolsProps) {
  const [selectedText, setSelectedText] = useState<fabric.IText | null>(null);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<
    "left" | "center" | "right" | "justify"
  >("left");
  const [kerning, setKerning] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.2);

  // Update tools when text object is selected
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      if (
        activeObject instanceof fabric.IText ||
        activeObject instanceof fabric.Text
      ) {
        const textObj = activeObject as fabric.IText;
        setSelectedText(textObj);
        setFontFamily(textObj.fontFamily || "Arial");
        setFontSize(textObj.fontSize || 20);
        setFontColor(textObj.fill?.toString() || "#000000");
        setIsBold(textObj.fontWeight === "bold");
        setIsItalic(textObj.fontStyle === "italic");
        setIsUnderline(textObj.underline || false);
        setTextAlign(
          (textObj.textAlign as "left" | "center" | "right" | "justify") ||
            "left"
        );
        setKerning(textObj.charSpacing || 0);
        setLineHeight(textObj.lineHeight || 1.2);
      } else {
        setSelectedText(null);
      }
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedText(null));

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", () => setSelectedText(null));
    };
  }, [canvas]);

  const updateTextProperty = (property: keyof fabric.IText, value: any) => {
    if (!selectedText || !canvas) return;

    selectedText.set(property, value);
    canvas.renderAll();
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    updateTextProperty("fontFamily", family);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    updateTextProperty("fontSize", size);
  };

  const handleFontColorChange = (color: string) => {
    setFontColor(color);
    updateTextProperty("fill", color);
  };

  const toggleBold = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    updateTextProperty("fontWeight", newBold ? "bold" : "normal");
  };

  const toggleItalic = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    updateTextProperty("fontStyle", newItalic ? "italic" : "normal");
  };

  const toggleUnderline = () => {
    const newUnderline = !isUnderline;
    setIsUnderline(newUnderline);
    updateTextProperty("underline", newUnderline);
  };

  const handleTextAlign = (align: "left" | "center" | "right" | "justify") => {
    setTextAlign(align);
    updateTextProperty("textAlign", align);
  };

  const handleKerningChange = (value: number) => {
    setKerning(value);
    updateTextProperty("charSpacing", value);
  };

  const handleLineHeightChange = (value: number) => {
    setLineHeight(value);
    updateTextProperty("lineHeight", value);
  };

  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText("Add your text here", {
      left: 100,
      top: 100,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fill: fontColor,
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      underline: isUnderline,
      textAlign: textAlign,
      charSpacing: kerning,
      lineHeight: lineHeight,
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  if (!selectedText) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Text Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={addText} className="w-full">
            <Type className="h-4 w-4 mr-2" />
            Add Text
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Text Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Font Family */}
        <div className="space-y-2">
          <Label htmlFor="font-family">Font Family</Label>
          <select
            id="font-family"
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size</Label>
          <select
            id="font-size"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-full p-2 border rounded-md bg-background"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Font Color */}
        <div className="space-y-2">
          <Label htmlFor="font-color">Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="font-color"
              type="color"
              value={fontColor}
              onChange={(e) => handleFontColorChange(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={fontColor}
              onChange={(e) => handleFontColorChange(e.target.value)}
              className="flex-1"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Text Style Buttons */}
        <div className="space-y-2">
          <Label>Style</Label>
          <div className="flex gap-1">
            <Button
              variant={isBold ? "default" : "outline"}
              size="sm"
              onClick={toggleBold}
              className="flex-1"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={isItalic ? "default" : "outline"}
              size="sm"
              onClick={toggleItalic}
              className="flex-1"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={isUnderline ? "default" : "outline"}
              size="sm"
              onClick={toggleUnderline}
              className="flex-1"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Text Alignment */}
        <div className="space-y-2">
          <Label>Alignment</Label>
          <div className="flex gap-1">
            <Button
              variant={textAlign === "left" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTextAlign("left")}
              className="flex-1"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={textAlign === "center" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTextAlign("center")}
              className="flex-1"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={textAlign === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTextAlign("right")}
              className="flex-1"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={textAlign === "justify" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTextAlign("justify")}
              className="flex-1"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Kerning */}
        <div className="space-y-2">
          <Label htmlFor="kerning">Letter Spacing</Label>
          <Input
            id="kerning"
            type="range"
            min="-10"
            max="20"
            step="1"
            value={kerning}
            onChange={(e) => handleKerningChange(Number(e.target.value))}
          />
          <div className="text-xs text-gray-500">{kerning}px</div>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <Label htmlFor="line-height">Line Height</Label>
          <Input
            id="line-height"
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={lineHeight}
            onChange={(e) => handleLineHeightChange(Number(e.target.value))}
          />
          <div className="text-xs text-gray-500">{lineHeight}</div>
        </div>
      </CardContent>
    </Card>
  );
}
