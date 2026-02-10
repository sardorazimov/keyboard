export type Difficulty = "easy" | "medium" | "hard" | "ultra";

export const DIFFICULTY = {
  easy: {
    spawnInterval: 1200,
    speed: 4,
    lanes: 5,
  },
  medium: {
    spawnInterval: 900,
    speed: 6,
    lanes: 6,
  },
  hard: {
    spawnInterval: 650,
    speed: 8,
    lanes: 7,
  },
  ultra: {
    spawnInterval: 450,
    speed: 11,
    lanes: 8,
  },
};
