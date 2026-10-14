import { CHEEK, INK, SKIN, yarnProps } from '../materials'

interface DollProps {
  main: string
  accent: string
}

function Doll({ main, accent }: DollProps) {
  return (
    <group>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.55, 0.72, 1.05, 32]} />
        <meshStandardMaterial {...yarnProps(accent)} />
      </mesh>

      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial {...yarnProps(SKIN)} />
      </mesh>

      <mesh position={[0, 0.78, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...yarnProps(main)} />
      </mesh>

      <mesh position={[-0.12, 0.62, 0.32]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color={INK} roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 0.62, 0.32]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color={INK} roughness={0.5} />
      </mesh>

      <mesh position={[-0.2, 0.52, 0.28]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial {...yarnProps(CHEEK)} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.2, 0.52, 0.28]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial {...yarnProps(CHEEK)} transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

export default Doll
