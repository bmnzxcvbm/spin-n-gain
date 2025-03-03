/**
 * Manages audio for the roulette application
 */

// Keep track of loaded audio elements
const audioElements: Record<string, HTMLAudioElement> = {};
let isMuted = false;

/**
 * Preload audio files
 */
export const preloadAudio = (name: string, src: string): void => {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audioElements[name] = audio;
};

/**
 * Play a specific sound
 */
export const playSound = (name: string): void => {
  if (isMuted || !audioElements[name]) return;
  
  // Reset audio to start
  const audio = audioElements[name];
  audio.currentTime = 0;
  
  // Play the sound
  audio.play().catch(err => {
    console.error(`Error playing sound: ${name}`, err);
  });
};

/**
 * Stop a specific sound
 */
export const stopSound = (name: string): void => {
  if (!audioElements[name]) return;
  
  const audio = audioElements[name];
  audio.pause();
  audio.currentTime = 0;
};

/**
 * Toggle mute state
 */
export const toggleMute = (): boolean => {
  isMuted = !isMuted;
  return isMuted;
};

/**
 * Get current mute state
 */
export const getMuteState = (): boolean => {
  return isMuted;
};

/**
 * Initialize audio by preloading sounds
 */
export const initAudio = (): void => {
  preloadAudio('spin', '/sounds/spin.mp3');
  preloadAudio('win', '/sounds/win.mp3');
};
