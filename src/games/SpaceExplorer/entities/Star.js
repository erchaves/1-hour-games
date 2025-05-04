// src/games/SpaceExplorer/entities/Star.js
import { Vector3D } from '../utils/Vector3D';

export class Star {
  constructor() {
    this.reset();
  }

  reset() {
    // Create stars in a sphere around the origin
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 1000 + Math.random() * 5000;

    this.position = new Vector3D(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );

    this.size = Math.random() * 2 + 0.5;
    this.brightness = Math.random() * 0.5 + 0.5;
    this.color = this.getStarColor();
  }

  getStarColor() {
    const colors = [
      '#FFFFFF', // White
      '#FFE5B4', // Yellow-white
      '#FFD700', // Yellow
      '#B4D4FF', // Blue-white
      '#FFB4B4', // Red-white
      '#FFFFB4'  // Yellow-white
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(ship) {
    // Stars are mostly static, but we can add a subtle parallax effect
    // or respawn far stars
    const dx = this.position.x - ship.position.x;
    const dy = this.position.y - ship.position.y;
    const dz = this.position.z - ship.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // If star is too far from ship, respawn it
    if (distance > 8000) {
      this.reset();
    }
  }

  render(ctx, camera) {
    const screen = camera.worldToScreen(this.position);
    if (!screen) return;

    // Don't render stars that are too close (they would be huge)
    if (screen.distance < 50) return;

    // Scale size based on distance
    const size = (this.size * screen.scale * this.brightness);

    // Minimum size so distant stars are still visible
    const renderSize = Math.max(0.5, size);

    // Skip stars that would be invisibly small
    if (renderSize < 0.1) return;

    // Draw star with glow effect
    const gradient = ctx.createRadialGradient(
      screen.x, screen.y, 0,
      screen.x, screen.y, renderSize * 2
    );

    const alpha = this.brightness * Math.min(1, renderSize);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color + Math.floor(alpha * 128).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, renderSize * 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw star core
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, Math.max(0.5, renderSize), 0, Math.PI * 2);
    ctx.fill();
  }
}