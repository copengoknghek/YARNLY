import { DoubleSide } from 'three'
import { CREAM, LEAF, yarnProps } from '../materials'

interface BouquetProps {
  main: string
  accent: string
}

const FLOWER_POSITIONS: [number, number, number][] = [
  [-0.35, 0.55, 0.05],
  [0, 0.75, 0.1],
  [0.35, 0.55, 0.05],
  [0, 0.45, -0.1],
]

function FlowerHead({ main, accent, position }: { main: string; accent: string; position: [number, number, number] }) {
  const petals = [0, 72, 144, 216, 288]

  return (
    <group position={position}>
      {petals.map((angle) => {
        const rad = (angle * Math.PI) / 180
        return (
          <mesh key={angle} position={[Math.cos(rad) * 0.16, Math.sin(rad) * 0.16, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial {...yarnProps(main)} />
          </mesh>
        )
      })}
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial {...yarnProps(accent)} />
      </mesh>
    </group>
  )
}

function Bouquet({ main, accent }: BouquetProps) {
  return (
    <group>
      <mesh position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.75, 1.1, 32, 1, true]} />
        <meshStandardMaterial {...yarnProps(CREAM)} side={DoubleSide} />
      </mesh>

      {FLOWER_POSITIONS.map((position) => (
        <FlowerHead key={position.join('-')} main={main} accent={accent} position={position} />
      ))}

      <mesh position={[-0.42, 0.05, 0.15]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.35, 0.06, 0.02]} />
        <meshStandardMaterial {...yarnProps(LEAF)} />
      </mesh>
      <mesh position={[0.42, 0.05, 0.15]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.35, 0.06, 0.02]} />
        <meshStandardMaterial {...yarnProps(LEAF)} />
      </mesh>
    </group>
  )
}

export default Bouquet
