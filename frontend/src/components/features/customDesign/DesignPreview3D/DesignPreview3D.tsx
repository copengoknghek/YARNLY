import { ContactShadows, OrbitControls, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { CustomDesign } from '@/types/customDesign'
import { INK } from './materials'
import ProductModel from './models/ProductModel'

const STYLE_SCALE: Record<string, number> = { chibi: 1, realistic: 0.95, mini: 0.78 }
const LOCKED_POLAR = 1.2
const TEXT_FONT = 'https://cdn.jsdelivr.net/npm/@pmndrs/assets@1.0.0/fonts/inter-bold.woff'

interface SceneProps {
  design: CustomDesign
}

function Scene({ design }: SceneProps) {
  const scale = STYLE_SCALE[design.style] ?? 1
  const text = design.text?.trim()

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 2]} intensity={1.15} />
      <directionalLight position={[-2, 3, -1]} intensity={0.35} />

      <group scale={scale} position={[0, -0.15, 0]}>
        <ProductModel
          baseProduct={design.baseProduct}
          main={design.mainColor}
          accent={design.accentColor}
          accessory={design.accessory}
        />
        {text && (
          <Text
            position={[0, -1.15, 0.2]}
            fontSize={0.16}
            color={INK}
            font={TEXT_FONT}
            anchorX="center"
            anchorY="middle"
            maxWidth={2.2}
          >
            {text}
          </Text>
        )}
      </group>

      <ContactShadows position={[0, -0.95, 0]} opacity={0.35} scale={4.5} blur={2.2} far={2} />
      <OrbitControls
        enablePan={false}
        minPolarAngle={LOCKED_POLAR}
        maxPolarAngle={LOCKED_POLAR}
        minDistance={3.2}
        maxDistance={6.5}
        autoRotate
        autoRotateSpeed={1.5}
      />
    </>
  )
}

function DesignPreview3D({ design }: { design: CustomDesign }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 1.2, 5], fov: 45 }} gl={{ antialias: true }}>
      <Scene design={design} />
    </Canvas>
  )
}

export default DesignPreview3D
