"use client";

import { useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { TextureLoader } from "three";
import { useEffect } from "react";
import * as THREE from "three";

interface TShirtModelProps {
  textureURL?: string;
  fabricColor?: string;
  onLoad?: () => void;
}

export default function TShirtModel({
  textureURL,
  fabricColor = "#ffffff",
  onLoad,
}: TShirtModelProps) {
  const gltf = useGLTF("/models/Tshirt.glb");
  const texture = textureURL ? useLoader(TextureLoader, textureURL) : null;

  useEffect(() => {
    // Apply texture and color to the shirt mesh
    gltf.scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        // Apply color
        if (child.material) {
          child.material.color = new THREE.Color(fabricColor);
        }

        // Apply texture to main fabric parts
        if (texture && child.material) {
          const meshName = child.name.toLowerCase();
          if (
            meshName.includes("shirt") ||
            meshName.includes("body") ||
            meshName.includes("fabric")
          ) {
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      }
    });

    onLoad?.();
  }, [texture, fabricColor, onLoad, gltf.scene]);

  return <primitive object={gltf.scene} scale={1.5} />;
}
