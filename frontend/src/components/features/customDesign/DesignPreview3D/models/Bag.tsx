import { RoundedBox } from '@react-three/drei'
import { CREAM, yarnProps } from '../materials'

interface BagProps {
  main: string
  accent: string
}

function Bag({ main, accent }: BagProps) {
  return (
    <group>
      <mesh position={[0, 0.42, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.38, 0.045, 12, 32, Math.PI]} />
        <meshStandardMaterial {...yarnProps(accent)} />
      </mesh>

      <RoundedBox args={[1.15, 0.95, 0.45]} radius={0.12} smoothness={4} position={[0, -0.05, 0]}>
        <meshStandardMaterial {...yarnProps(main)} />
      </RoundedBox>

      <mesh position={[0, -0.05, 0.24]}>
        <boxGeometry args={[1.15, 0.12, 0.02]} />
        <meshStandardMaterial {...yarnProps(accent)} />
      </mesh>

      <mesh position={[0, -0.05, 0.26]}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial {...yarnProps(CREAM)} />
      </mesh>
    </group>
  )
}

export default Bag
