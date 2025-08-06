"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Working3DCanvasProps {
  modelPath: string;
  uploadedTexture?: string;
  fabricColor: string;
  onModelLoad?: () => void;
  texturePosition?: { x: number; y: number; z: number };
  textureScale?: { x: number; y: number; z: number };
  textureRotation?: { x: number; y: number; z: number };
}

export default function Working3DCanvas({
  modelPath,
  uploadedTexture,
  fabricColor,
  onModelLoad,
  texturePosition = { x: 0, y: 0, z: 1 },
  textureScale = { x: 2, y: 2, z: 1 },
  textureRotation = { x: 0, y: 0, z: 0 },
}: Working3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const textureRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const currentModelPathRef = useRef<string>("");

  // Clear all models from scene
  const clearAllModels = useCallback(() => {
    if (!sceneRef.current) return;

    console.log("Clearing all models from scene");

    // Remove all objects except lights, camera, and ground
    const objectsToRemove: THREE.Object3D[] = [];
    sceneRef.current.traverse((child) => {
      if (
        child !== sceneRef.current &&
        !(child instanceof THREE.Light) &&
        !(child instanceof THREE.Camera) &&
        child.name !== "ground"
      ) {
        objectsToRemove.push(child);
      }
    });

    // Remove and dispose objects
    objectsToRemove.forEach((obj) => {
      sceneRef.current!.remove(obj);
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((material) => {
              if (material.map) material.map.dispose();
              material.dispose();
            });
          } else {
            if (obj.material.map) obj.material.map.dispose();
            obj.material.dispose();
          }
        }
      }
    });

    // Clear references
    modelRef.current = null;
    textureRef.current = null;
    currentModelPathRef.current = "";

    // Force render
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  // Initialize the 3D scene (only once)
  const initializeScene = useCallback(() => {
    if (!canvasRef.current || isInitializedRef.current) return;

    console.log("Initializing 3D scene...");

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
    camera.position.set(0, 2, 8);
    cameraRef.current = camera;

    // Renderer with Shadow Support
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
    });
    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
    renderer.setClearColor(0xf0f0f0, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Enhanced Lighting for Realistic Shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-5, 5, -5);
    directionalLight2.castShadow = true;
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.set(0, 8, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Add a ground plane to receive shadows
    const groundGeometry = new THREE.PlaneGeometry(300, 300);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.9,
      metalness: 0.5,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -12;
    ground.receiveShadow = true;
    ground.name = "ground"; // Add name to identify it
    scene.add(ground);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current)
        return;

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    isInitializedRef.current = true;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Load model (only when modelPath changes)
  const loadModel = useCallback(() => {
    if (!sceneRef.current || !modelPath) return;

    // Only reload if the model path has actually changed
    if (currentModelPathRef.current === modelPath && modelRef.current) {
      console.log("Same model selected, skipping reload");
      return;
    }

    console.log("Loading new model:", modelPath);

    // Clear all existing models and textures
    clearAllModels();

    const loader = new GLTFLoader();
    console.log("Loading model from:", modelPath);

    loader.load(
      modelPath,
      (gltf) => {
        console.log("Model loaded successfully:", gltf);
        const model = gltf.scene;

        // Apply color-only materials to model
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const newMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color(fabricColor),
              side: THREE.DoubleSide,
              transparent: false,
              opacity: 1.0,
              roughness: 0.8,
              metalness: 0.1,
              envMapIntensity: 0.5,
            });

            // Dispose old material to prevent memory leaks
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => {
                  if (material.map) material.map.dispose();
                  material.dispose();
                });
              } else {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
              }
            }

            // Assign new material
            child.material = newMaterial;
            child.material.needsUpdate = true;

            // Enable shadows for the mesh
            child.castShadow = true;
            child.receiveShadow = true;

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

        // Scale model to fit - make it bigger
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 6 / maxDim;
        model.scale.setScalar(scale);

        if (sceneRef.current) {
          sceneRef.current.add(model);
          modelRef.current = model;
          currentModelPathRef.current = modelPath; // Track current model path
          console.log("New model added to scene:", modelPath);
        }

        console.log("Model added to scene");
        setIsLoaded(true);
        onModelLoad?.();
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        setError(
          `Failed to load model: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setIsLoaded(false);
      }
    );
  }, [modelPath, onModelLoad, clearAllModels]); // Added clearAllModels to dependencies

  // Update texture overlay (real-time updates)
  const updateTexture = useCallback(() => {
    if (!sceneRef.current || !uploadedTexture) {
      // Remove existing texture if no texture is provided
      if (textureRef.current && sceneRef.current) {
        sceneRef.current.remove(textureRef.current);
        textureRef.current.geometry.dispose();
        if (Array.isArray(textureRef.current.material)) {
          textureRef.current.material.forEach((material) => material.dispose());
        } else {
          textureRef.current.material.dispose();
        }
        textureRef.current = null;
      }
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(uploadedTexture, (texture) => {
      // Remove previous texture if exists
      if (textureRef.current && sceneRef.current) {
        sceneRef.current.remove(textureRef.current);
        textureRef.current.geometry.dispose();
        if (Array.isArray(textureRef.current.material)) {
          textureRef.current.material.forEach((material) => material.dispose());
        } else {
          textureRef.current.material.dispose();
        }
        textureRef.current = null;
      }

      // Create a plane for the texture that blends with the model
      const textureGeometry = new THREE.PlaneGeometry(1, 1);
      const textureMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true,
      });

      const textureMesh = new THREE.Mesh(textureGeometry, textureMaterial);

      // Position the texture slightly above the model surface
      textureMesh.position.set(
        texturePosition.x,
        texturePosition.y,
        texturePosition.z + 1
      );
      textureMesh.scale.set(textureScale.x, textureScale.y, textureScale.z);
      textureMesh.rotation.set(
        textureRotation.x,
        textureRotation.y,
        textureRotation.z
      );

      // Add to scene
      if (sceneRef.current) {
        sceneRef.current.add(textureMesh);
        textureRef.current = textureMesh;
      }

      console.log("Texture overlay applied:", {
        position: textureMesh.position,
        scale: textureMesh.scale,
        rotation: textureMesh.rotation,
      });
    });
  }, [uploadedTexture, texturePosition, textureScale, textureRotation]);

  // Update model color (real-time updates)
  const updateModelColor = useCallback(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            material.color = new THREE.Color(fabricColor);
            material.needsUpdate = true;
          });
        } else {
          child.material.color = new THREE.Color(fabricColor);
          child.material.needsUpdate = true;
        }
      }
    });
  }, [fabricColor]);

  // Initialize scene on mount
  useEffect(() => {
    const cleanup = initializeScene();
    return cleanup;
  }, [initializeScene]);

  // Load model when modelPath changes (only for different models)
  useEffect(() => {
    if (isInitializedRef.current) {
      loadModel();
    }
  }, [loadModel]);

  // Update texture in real-time
  useEffect(() => {
    if (isInitializedRef.current) {
      updateTexture();
    }
  }, [updateTexture]);

  // Update model color in real-time
  useEffect(() => {
    if (isInitializedRef.current && modelRef.current) {
      updateModelColor();
    }
  }, [updateModelColor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-white text-sm sm:text-base">
              Loading 3D Preview...
            </p>
            <button
              onClick={() => setIsLoaded(true)}
              className="mt-4 px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs sm:text-sm"
            >
              Force Load
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
