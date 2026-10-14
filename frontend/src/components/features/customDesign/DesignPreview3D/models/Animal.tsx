import { CHEEK, CREAM, INK, yarnProps } from '../materials'

interface AnimalProps {
  main: string
  accent: string
}

function Animal({ main, accent }: AnimalProps) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshStandardMaterial {...yarnProps(main)} />
      </mesh>

      <mesh position={[-0.42, 0.78, 0.05]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial {...yarnProps(main)} />
      </mesh>
      <mesh position={[0.42, 0.78, 0.05]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial {...yarnProps(main)} />
      </mesh>
      <mesh position={[-0.42, 0.78, 0.12]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial {...yarnProps(accent)} />
      </mesh>
      <mesh position={[0.42, 0.78, 0.12]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial {...yarnProps(accent)} />
      </mesh>

      <mesh position={[0, 0.02, 0.52]} scale={[1, 0.85, 0.75]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial {...yarnProps(CREAM)} />
      </mesh>

      <mesh position={[-0.2, 0.22, 0.58]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={INK} roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.22, 0.58]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={INK} roughness={0.5} />
      </mesh>

      <mesh position={[-0.32, 0.08, 0.5]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial {...yarnProps(CHEEK)} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.32, 0.08, 0.5]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial {...yarnProps(CHEEK)} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

export default Animal
