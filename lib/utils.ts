import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function playCorrect() {
  const audio = new Audio("/sounds/click.mp3");
  audio.volume = 0.25;
  audio.play().catch(() => {});
}

export function playWrong() {
  const audio = new Audio("/sounds/error.mp3");
  audio.volume = 0.4;
  audio.play().catch(() => {});
}



let soundEnabled = true;

export function initSound() {
  const saved = localStorage.getItem("sound");
  soundEnabled = saved !== "off";
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("sound", soundEnabled ? "on" : "off");
  return soundEnabled;
}

export function isSoundOn() {
  return soundEnabled;
}

