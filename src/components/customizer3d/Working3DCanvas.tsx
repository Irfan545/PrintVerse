"use client";

import { useEffect, useState, useRef } from "react";
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
  texturePosition = { x: 0, y: 0, z: 0 },
  textureScale = { x: 1, y: 1, z: 1 },
  textureRotation = { x: 0, y: 0, z: 0 },
}: Working3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const textureRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup previous renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // Wait for canvas to be available
    let retryCount = 0;
    const maxRetries = 50; // 5 seconds max

    const initCanvas = () => {
      if (!canvasRef.current) {
        retryCount++;
        if (retryCount > maxRetries) {
          console.error("Canvas ref not available after max retries");
          setError("Failed to initialize 3D canvas");
          return;
        }
        console.log(
          `Canvas ref not available, retrying... (${retryCount}/${maxRetries})`
        );
        setTimeout(initCanvas, 100);
        return;
      }

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
      camera.position.set(0, 2, 8); // Moved back and up for better angle

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
      controls.enableZoom = false; // Disable zoom in/out
      controls.enablePan = false; // Disable panning for better control

      // Load GLB model
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
                  child.material.forEach((material) => material.dispose());
                } else {
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

          // Add texture overlay if uploaded texture exists
          if (uploadedTexture) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(uploadedTexture, (texture) => {
              // Remove previous texture if exists
              if (textureRef.current) {
                scene.remove(textureRef.current);
                textureRef.current.geometry.dispose();
                if (Array.isArray(textureRef.current.material)) {
                  textureRef.current.material.forEach((material) =>
                    material.dispose()
                  );
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
                opacity: 0.9, // Slightly transparent to blend
                side: THREE.DoubleSide,
                blending: THREE.NormalBlending,
                depthWrite: false, // Don't write to depth buffer to blend with surface
                depthTest: true,
              });

              const textureMesh = new THREE.Mesh(
                textureGeometry,
                textureMaterial
              );

              // Position the texture slightly above the model surface
              textureMesh.position.set(
                texturePosition.x,
                texturePosition.y,
                texturePosition.z + 1 // Position at z=1 to be on top
              );
              textureMesh.scale.set(
                textureScale.x,
                textureScale.y,
                textureScale.z
              );
              textureMesh.rotation.set(
                textureRotation.x,
                textureRotation.y,
                textureRotation.z
              );

              // Add to scene
              scene.add(textureMesh);
              textureRef.current = textureMesh;

              console.log("Texture overlay applied:", {
                position: textureMesh.position,
                scale: textureMesh.scale,
                rotation: textureMesh.rotation,
              });

              // Force a render to show the texture immediately
              renderer.render(scene, camera);
            });
          }

          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          // Scale model to fit - make it bigger
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 6 / maxDim; // Increased from 2 to 4 for bigger model
          model.scale.setScalar(scale);

          scene.add(model);
          modelRef.current = model;

          // Add a ground plane to receive shadows
          const groundGeometry = new THREE.PlaneGeometry(300, 300); // Bigger ground for bigger model
          const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            roughness: 0.9,
            metalness: 0.5,
          });
          const ground = new THREE.Mesh(groundGeometry, groundMaterial);
          ground.rotation.x = -Math.PI / 2;
          ground.position.y = -12; // Lower ground for bigger model
          ground.receiveShadow = true;
          scene.add(ground);

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

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
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
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        window.removeEventListener("resize", handleResize);

        if (renderer) {
          renderer.dispose();
        }
      };
    };

    // Start initialization
    initCanvas();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [
    modelPath,
    fabricColor,
    uploadedTexture,
    texturePosition,
    textureScale,
    textureRotation,
    onModelLoad,
  ]);

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
