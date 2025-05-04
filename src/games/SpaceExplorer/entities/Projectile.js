// src/games/SpaceExplorer/entities/Projectile.js
import { Vector3D } from '../utils/Vector3D';

export class Projectile {
  constructor(position, velocity, damage, color = '#00ff00') {
    this.position = position;
    this.velocity = velocity;
    this.damage = damage;
    this.color = color;
    this.lifetime = 3; // seconds
    this.age = 0;
    this.destroyed = false;
    this.radius = 5;
  }

  update(deltaTime) {
    this.age += deltaTime;
    if (this.age >= this.lifetime) {
      this.destroy();
      return;
    }

    this.position = this.position.add(this.velocity.multiply(deltaTime));
  }

  destroy() {
    this.destroyed = true;
  }

  render(ctx, camera) {
    if (this.destroyed) return;

    const screen = camera.worldToScreen(this.position);
    if (!screen) return;

    const scale = screen.scale;
    const size = this.radius * scale;

    // Draw projectile with glow
    const gradient = ctx.createRadialGradient(
      screen.x, screen.y, 0,
      screen.x, screen.y, size * 2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color + '88');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw core
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}