# 3D Product Customizer

A comprehensive 3D product customizer built with React Three Fiber for the PrintVerse application.

## Components

### `CustomizerCanvas.tsx`

The main 3D scene container that provides:

- Three.js Canvas setup with proper lighting
- OrbitControls for camera manipulation
- Environment lighting for realistic reflections
- Loading states and error handling

### `ProductModel.tsx`

Handles GLB model loading and material application:

- Loads GLB models from `/public/models/`
- Applies uploaded textures to model materials
- Changes fabric colors dynamically
- Falls back to placeholder geometry if models aren't available
- Supports multiple product types (t-shirt, hoodie, mug)

### `Controls.tsx`

User interface for customization:

- File upload for design textures
- Color picker with preset colors
- Reset functionality
- Download preview (placeholder)

### `PlaceholderModel.tsx`

Simple 3D geometry when GLB models aren't available:

- Basic t-shirt shape using Three.js primitives
- Supports color and texture changes
- Animated rotation for demo purposes

## Usage

### Basic Setup

```tsx
import CustomizerCanvas from "@/components/customizer3d/CustomizerCanvas";
import Controls from "@/components/customizer3d/Controls";

function MyCustomizer() {
  const [texture, setTexture] = useState();
  const [color, setColor] = useState("#ffffff");

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <Controls
        onTextureUpload={setTexture}
        onColorChange={setColor}
        fabricColor={color}
        uploadedTexture={texture}
      />
      <CustomizerCanvas
        modelPath="/models/tshirt.glb"
        uploadedTexture={texture}
        fabricColor={color}
      />
    </div>
  );
}
```

### Adding New Models

1. Place GLB files in `/public/models/`
2. Update `PRODUCT_MODELS` array in the customizer page
3. Add preload calls in `ProductModel.tsx`

### Features

- ✅ Real-time 3D preview
- ✅ Texture upload and mapping
- ✅ Dynamic color changes
- ✅ Orbit controls (rotate, zoom, pan)
- ✅ Multiple product support
- ✅ Fallback placeholder models
- ✅ Loading states
- ✅ Error handling
- ✅ Cart integration

### Requirements

- React 18+
- Three.js
- @react-three/fiber
- @react-three/drei

### File Structure

```
src/components/customizer3d/
├── CustomizerCanvas.tsx    # Main 3D scene
├── ProductModel.tsx        # Model loader & material handler
├── Controls.tsx           # UI controls
├── PlaceholderModel.tsx   # Fallback geometry
└── README.md             # This file
```

### Model Requirements

- GLB format
- Proper UV mapping for texture application
- Optimized geometry (< 10k triangles recommended)
- PBR materials for best results

### Performance Tips

- Use compressed textures (WebP, AVIF)
- Optimize GLB files (remove unused materials/animations)
- Implement texture streaming for large files
- Use LOD (Level of Detail) for complex models
