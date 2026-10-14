export const YARN_ROUGHNESS = 0.9

export const INK = '#5f1d1d'
export const SKIN = '#f6d7c3'
export const CREAM = '#fffae7'
export const LEAF = '#73a141'
export const CHEEK = '#f48aa0'
export const PETAL_CENTER = '#ffe373'

export function yarnProps(color: string) {
  return { color, roughness: YARN_ROUGHNESS, metalness: 0 }
}
