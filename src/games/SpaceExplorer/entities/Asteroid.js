// src/games/SpaceExplorer/entities/Asteroid.js
import { Vector3D } from '../utils/Vector3D';

export class Asteroid {
  constructor() {
    this.destroyed = false;
    this.reset();
  }

  reset() {
    // Spawn asteroids more evenly distributed in 3D space
    const phi = Math.acos(2 * Math.random() - 1); // 0 to PI for spherical distribution
    const theta = Math.random() * Math.PI * 2; // 0 to 2*PI
    const distance = 1000 + Math.random() * 3000; // Vary the distance more

    this.position = new Vector3D(
      Math.sin(phi) * Math.cos(theta) * distance,
      Math.cos(phi) * distance,
      Math.sin(phi) * Math.sin(theta) * distance
    );

    // Random velocity in any direction
    const velPhi = Math.acos(2 * Math.random() - 1);
    const velTheta = Math.random() * Math.PI * 2;
    const speed = Math.random() * 50;

    this.velocity = new Vector3D(
      Math.sin(velPhi) * Math.cos(velTheta) * speed,
      Math.cos(velPhi) * speed,
      Math.sin(velPhi) * Math.sin(velTheta) * speed
    );

    // Rest of the reset code stays the same...
    this.rotation = new Vector3D(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    this.rotationSpeed = new Vector3D(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    );

    this.radius = 20 + Math.random() * 40;
    this.health = this.radius;
    this.vertices = this.generateVertices();
  }

  generateVertices() {
    const vertices = [];
    const segments = 8 + Math.floor(Math.random() * 8);

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const radiusVariation = 0.7 + Math.random() * 0.6;

      vertices.push({
        x: Math.cos(angle) * this.radius * radiusVariation,
        y: Math.sin(angle) * this.radius * radiusVariation
      });
    }

    return vertices;
  }

  update(deltaTime) {
    // Update position
    this.position = this.position.add(this.velocity.multiply(deltaTime));

    // Update rotation
    this.rotation = this.rotation.add(this.rotationSpeed);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.destroyed = true;
    // Could spawn smaller asteroids here for a breakup effect
  }

  render(ctx, camera) {
    if (this.destroyed) return;

    const screen = camera.worldToScreen(this.position);
    if (!screen) return;

    const scale = screen.scale;

    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.rotate(this.rotation.z);

    // Draw asteroid
    ctx.fillStyle = '#8B4513';
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.vertices[0].x * scale, this.vertices[0].y * scale);

    for (let i = 1; i < this.vertices.length; i++) {
      ctx.lineTo(this.vertices[i].x * scale, this.vertices[i].y * scale);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}