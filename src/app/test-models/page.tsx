"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const MODELS = [
  { name: "T-Shirt", path: "/models/Tshirt.glb" },
  { name: "Hoodie", path: "/models/Hoodie.glb" },
  { name: "Mug", path: "/models/Mug.glb" },
];

export default function TestModelsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
    renderer.setClearColor(0xf0f0f0, 1);
    rendererRef.current = renderer;

    // Lighting - More aggressive setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight3.position.set(0, 10, 0);
    scene.add(directionalLight3);

    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.8);
    pointLight2.position.set(5, 0, 0);
    scene.add(pointLight2);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !renderer) return;

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    setIsLoading(true);
    setError(null);

    // Remove existing model completely
    if (modelRef.current) {
      // Remove all children and dispose of geometries and materials
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });

      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }

    // Clear any remaining objects from the scene (except lights and camera)
    const objectsToRemove = sceneRef.current.children.filter(
      (child) => child.type !== "Light" && child.type !== "Camera"
    );
    objectsToRemove.forEach((obj) => {
      sceneRef.current?.remove(obj);
    });

    // Load new model
    const loader = new GLTFLoader();
    loader.load(
      selectedModel.path,
      (gltf) => {
        const model = gltf.scene;

        // Force replace all materials with visible ones
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Use MeshBasicMaterial which doesn't require lighting
            const newMaterial = new THREE.MeshBasicMaterial({
              color: 0x888888, // Medium gray color
              side: THREE.DoubleSide,
              transparent: false,
              opacity: 1.0,
            });

            // Dispose old material to prevent memory leaks
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
              } else {
                child.material.dispose();
              }
            }

            // Assign new material
            child.material = newMaterial;

            // Ensure geometry is properly configured
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
          }
        });

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Scale model to fit
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.setScalar(scale);

        sceneRef.current?.add(model);
        modelRef.current = model;
        setIsLoading(false);

        // Add a test cube to verify lighting
        const testCube = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.5, 0.5),
          new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        testCube.position.set(2, 0, 0);
        sceneRef.current?.add(testCube);

        // Debug: Log model info
        console.log(`Loaded model: ${selectedModel.name}`);
        console.log("Model children:", model.children.length);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            console.log("Mesh found:", child.name || "unnamed");
            console.log("Material:", child.material);
            console.log("Geometry:", child.geometry);
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        setError(
          `Failed to load ${selectedModel.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setIsLoading(false);
      }
    );
  }, [selectedModel]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              3D Model Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Testing your GLB models with Three.js
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/design">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Designer
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Model Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Model Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MODELS.map((model) => (
                    <Button
                      key={model.name}
                      variant={
                        selectedModel.name === model.name
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedModel(model)}
                    >
                      {model.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Model Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Current Model:
                    </span>
                    <span className="font-medium">{selectedModel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      File Path:
                    </span>
                    <span className="font-medium text-xs">
                      {selectedModel.path}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span className="font-medium">
                      {isLoading ? "Loading..." : error ? "Error" : "Loaded"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Left click + drag to rotate</p>
                  <p>• Right click + drag to pan</p>
                  <p>• Scroll to zoom</p>
                  <p>• Click model buttons to switch</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3D Viewer */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>3D Model Viewer - {selectedModel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-[600px]"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "600px",
                      }}
                    />
                  </div>
                </div>

                {isLoading && (
                  <div className="mt-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Loading {selectedModel.name}...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="text-red-600 dark:text-red-400">
                      <strong>Error:</strong> {error}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
