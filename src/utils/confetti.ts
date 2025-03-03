
/**
 * Creates and animates confetti on the screen
 */

const COLORS = [
  '#3498db', // Blue
  '#2980b9', // Dark Blue
  '#ffffff', // White
  '#f1c40f', // Yellow
  '#e74c3c', // Red
];

interface ConfettiOptions {
  /** Number of confetti pieces */
  count?: number;
  /** Base point where confetti should appear (usually the winner position) */
  origin?: { x: number, y: number };
}

/**
 * Launch confetti animation from a specific point
 */
export const launchConfetti = (options: ConfettiOptions = {}): void => {
  const {
    count = 150,
    origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  } = options;

  const container = document.body;

  // Create and animate confetti pieces
  for (let i = 0; i < count; i++) {
    createConfettiPiece(container, origin);
  }
};

/**
 * Create a single confetti piece
 */
function createConfettiPiece(container: HTMLElement, origin: { x: number, y: number }): void {
  // Create confetti element
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  
  // Random properties
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const shape = Math.random() > 0.5 ? 'circle' : 'square';
  const size = 5 + Math.random() * 10;
  
  // Random starting position (with small offset from origin)
  const offsetX = (Math.random() - 0.5) * 100;
  const offsetY = (Math.random() - 0.5) * 100;
  const startX = origin.x + offsetX;
  const startY = origin.y + offsetY;
  
  // Random velocity
  const vx = (Math.random() - 0.5) * 30;
  const vy = Math.random() * -15 - 5;
  
  // Random rotation
  const rotation = Math.random() * 360;
  const rotationSpeed = (Math.random() - 0.5) * 10;
  
  // Apply styles
  Object.assign(confetti.style, {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: shape === 'circle' ? '50%' : '0',
    left: `${startX}px`,
    top: `${startY}px`,
    transform: `rotate(${rotation}deg)`,
  });
  
  // Add to container
  container.appendChild(confetti);
  
  // Animate falling
  let currentY = startY;
  let currentX = startX;
  let currentRotation = rotation;
  
  let frame = 0;
  const gravity = 0.5;
  let vy2 = vy;
  
  const animate = () => {
    frame++;
    
    // Apply physics
    vy2 += gravity;
    currentX += vx;
    currentY += vy2;
    currentRotation += rotationSpeed;
    
    // Apply position
    confetti.style.top = `${currentY}px`;
    confetti.style.left = `${currentX}px`;
    confetti.style.transform = `rotate(${currentRotation}deg)`;
    
    // Calculate opacity (fade out near the end)
    const progress = Math.min(frame / 200, 1);
    const opacity = progress > 0.8 ? 1 - (progress - 0.8) * 5 : 1;
    confetti.style.opacity = opacity.toString();
    
    // Check if confetti should be removed
    if (progress >= 1 || currentY > window.innerHeight) {
      confetti.remove();
      return;
    }
    
    // Continue animation
    requestAnimationFrame(animate);
  };
  
  // Start animation
  requestAnimationFrame(animate);
}
