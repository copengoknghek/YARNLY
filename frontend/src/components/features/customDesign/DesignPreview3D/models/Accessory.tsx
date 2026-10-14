import { CREAM, PETAL_CENTER, yarnProps } from '../materials'

interface AccessoryProps {
  type: string
  accent: string
}

function FlowerCluster({ accent, scale = 1 }: { accent: string; scale?: number }) {
  const petals = [0, 72, 144, 216, 288]

  return (
    <group scale={scale}>
      {petals.map((angle) => {
        const rad = (angle * Math.PI) / 180
        return (
          <mesh key={angle} position={[Math.cos(rad) * 0.14, Math.sin(rad) * 0.14, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial {...yarnProps(accent)} />
          </mesh>
        )
      })}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial {...yarnProps(PETAL_CENTER)} />
      </mesh>
    </group>
  )
}

function Accessory({ type, accent }: AccessoryProps) {
  switch (type) {
    case 'bow':
      return (
        <group>
          <mesh position={[-0.14, 0, 0]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.22, 0.14, 0.06]} />
            <meshStandardMaterial {...yarnProps(accent)} />
          </mesh>
          <mesh position={[0.14, 0, 0]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.22, 0.14, 0.06]} />
            <meshStandardMaterial {...yarnProps(accent)} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial {...yarnProps(accent)} />
          </mesh>
        </group>
      )
    case 'hat':
      return (
        <group>
          <mesh position={[0, -0.08, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.28, 0.38, 24]} />
            <meshStandardMaterial {...yarnProps(accent)} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial {...yarnProps(CREAM)} />
          </mesh>
        </group>
      )
    case 'scarf':
      return (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.07, 12, 32]} />
            <meshStandardMaterial {...yarnProps(accent)} />
          </mesh>
          <mesh position={[0.32, -0.18, 0.05]} rotation={[0.2, 0, -0.35]}>
            <boxGeometry args={[0.1, 0.28, 0.06]} />
            <meshStandardMaterial {...yarnProps(accent)} />
          </mesh>
        </group>
      )
    case 'flower':
      return <FlowerCluster accent={accent} />
    default:
      return null
  }
}

export default Accessory
