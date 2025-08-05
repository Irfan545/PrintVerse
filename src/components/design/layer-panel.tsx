"use client";

import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoveUp,
  MoveDown,
  Trash2,
  Layers,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
} from "lucide-react";

interface LayerPanelProps {
  canvas: fabric.Canvas | null;
}

interface LayerItem {
  id: string;
  name: string;
  type: "text" | "image" | "shape" | "group";
  visible: boolean;
  locked: boolean;
  object: fabric.Object;
}

export default function LayerPanel({ canvas }: LayerPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  // Update layers when canvas objects change
  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects();
      const layerItems: LayerItem[] = objects.map((obj, index) => {
        let type: LayerItem["type"] = "shape";
        let name = `Object ${index + 1}`;

        if (obj instanceof fabric.IText || obj instanceof fabric.Text) {
          type = "text";
          name = (obj as fabric.Text).text || "Text";
        } else if (obj instanceof fabric.Image) {
          type = "image";
          name = "Image";
        } else if (obj instanceof fabric.Group) {
          type = "group";
          name = "Group";
        }

        return {
          id: (obj as any).id || `obj-${index}`,
          name,
          type,
          visible: obj.visible !== false,
          locked: obj.selectable !== true,
          object: obj,
        };
      });

      setLayers(layerItems.reverse()); // Show top objects first
    };

    updateLayers();

    // Listen for canvas changes
    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
    };
  }, [canvas]);

  const toggleVisibility = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer || !canvas) return;

    layer.object.visible = !layer.object.visible;
    layer.visible = layer.object.visible;
    canvas.renderAll();
    setLayers([...layers]);
  };

  const toggleLock = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer || !canvas) return;

    layer.object.selectable = !layer.object.selectable;
    layer.object.evented = layer.object.selectable;
    layer.locked = !layer.object.selectable;
    canvas.renderAll();
    setLayers([...layers]);
  };

  const moveLayer = (layerId: string, direction: "up" | "down") => {
    if (!canvas) return;

    const layerIndex = layers.findIndex((l) => l.id === layerId);
    if (layerIndex === -1) return;

    const object = layers[layerIndex].object;
    const objects = canvas.getObjects();
    const objectIndex = objects.indexOf(object);

    if (direction === "up" && objectIndex < objects.length - 1) {
      canvas.bringForward(object);
    } else if (direction === "down" && objectIndex > 0) {
      canvas.sendBackwards(object);
    }

    // Update layers after reordering
    setTimeout(() => {
      const newObjects = canvas.getObjects();
      const newLayers: LayerItem[] = newObjects.map((obj, index) => {
        const existingLayer = layers.find((l) => l.object === obj);
        return (
          existingLayer || {
            id: (obj as any).id || `obj-${index}`,
            name: `Object ${index + 1}`,
            type: "shape",
            visible: obj.visible !== false,
            locked: obj.selectable !== true,
            object: obj,
          }
        );
      });
      setLayers(newLayers.reverse());
    }, 10);
  };

  const deleteLayer = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer || !canvas) return;

    canvas.remove(layer.object);
    canvas.renderAll();
  };

  const selectLayer = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer || !canvas) return;

    canvas.setActiveObject(layer.object);
    canvas.renderAll();
    setSelectedLayer(layerId);
  };

  const getLayerIcon = (type: LayerItem["type"]) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "shape":
        return <Square className="h-4 w-4" />;
      case "group":
        return <Layers className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Layers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {layers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No objects on canvas
            </p>
          ) : (
            layers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                  selectedLayer === layer.id
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                    : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
                onClick={() => selectLayer(layer.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    {getLayerIcon(layer.type)}
                    <span
                      className={`text-sm truncate ${
                        layer.visible ? "" : "line-through opacity-50"
                      }`}
                    >
                      {layer.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(layer.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    {layer.visible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(layer.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    {layer.locked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(layer.id, "up");
                    }}
                    className="h-6 w-6 p-0"
                    disabled={layers.indexOf(layer) === 0}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(layer.id, "down");
                    }}
                    className="h-6 w-6 p-0"
                    disabled={layers.indexOf(layer) === layers.length - 1}
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLayer(layer.id);
                    }}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
