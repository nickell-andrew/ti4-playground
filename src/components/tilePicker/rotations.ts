export const degOptions = {
    deg0: 0,
    deg60: 60,
    deg120: 120,
    deg180: 180,
    deg240: 240,
    deg300: 300,
} as const;
export type ALL_DEG_OPTIONS = (typeof degOptions)[keyof typeof degOptions]
export interface ROTATION {
    deg: ALL_DEG_OPTIONS
    next: ALL_DEG_OPTIONS
    prev: ALL_DEG_OPTIONS
}
export const allRotations: Record<ALL_DEG_OPTIONS, ROTATION> = {
    0: { deg: 0, next: 60, prev: 300 },
    60: { deg: 60, next: 120, prev: 0 },
    120: { deg: 120, next: 180, prev: 60 },
    180: { deg: 180, next: 240, prev: 120 },
    240: { deg: 240, next: 300, prev: 180 },
    300: { deg: 300, next: 0, prev: 240 },
} as const;