export type Vector3Tuple = [number, number, number]

export interface AccessoryAnchor {
  position: Vector3Tuple
  rotation?: Vector3Tuple
  scale?: number
}

export type AccessoryAnchors = Record<string, AccessoryAnchor>

export const ACCESSORY_ANCHORS: Record<string, AccessoryAnchors> = {
  animal: {
    bow: { position: [0.85, 1.05, 0.25], rotation: [0, -0.4, 0.2], scale: 0.75 },
    hat: { position: [0, 1.25, 0], rotation: [0, 0, 0], scale: 1 },
    scarf: { position: [0, 0.35, 0.52], rotation: [0, 0, 0], scale: 1.05 },
    flower: { position: [-0.65, 0.15, 0.48], rotation: [0, 0.5, 0], scale: 0.65 },
  },
  doll: {
    bow: { position: [0.55, 1.05, 0.2], rotation: [0, -0.5, 0.15], scale: 0.7 },
    hat: { position: [0, 1.2, 0], rotation: [0, 0, 0], scale: 0.95 },
    scarf: { position: [0, 0.55, 0.38], rotation: [0, 0, 0], scale: 0.95 },
    flower: { position: [-0.35, 0.05, 0.42], rotation: [0, 0.4, 0], scale: 0.6 },
  },
  bag: {
    bow: { position: [0.55, 0.55, 0.35], rotation: [0, -0.6, 0.1], scale: 0.65 },
    hat: { position: [0, 0.75, 0], rotation: [0, 0, 0], scale: 0.85 },
    scarf: { position: [0, 0.05, 0.38], rotation: [0, 0, 0], scale: 1.1 },
    flower: { position: [-0.45, -0.05, 0.38], rotation: [0, 0.3, 0], scale: 0.55 },
  },
  bouquet: {
    bow: { position: [0.35, 0.15, 0.42], rotation: [0, -0.8, 0], scale: 0.7 },
    hat: { position: [0, 0.95, 0], rotation: [0, 0, 0], scale: 0.75 },
    scarf: { position: [0, -0.35, 0.35], rotation: [0, 0, 0], scale: 0.9 },
    flower: { position: [-0.55, 0.45, 0.35], rotation: [0, 0.5, 0], scale: 0.55 },
  },
}
