// src/games/SpaceExplorer/entities/Wormhole.js
import { Vector3D } from '../utils/Vector3D';

export class Wormhole {
  constructor() {
    this.position = this.generatePosition();
    this.exitPosition = this.generatePosition();
    this.radius = 100;
    this.rotation = 0;
    this.rotationSpeed = 0.01;
    this.active = true;
    this.swirls = this.generateSwirls();
  }

  generatePosition() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 1000 + Math.random() * 3000;

    return new Vector3D(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 1000,
      Math.sin(angle) * distance
    );
  }

  generateSwirls() {
    const swirls = [];
    for (let i = 0; i < 5; i++) {
      swirls.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        radius: 0.3 + Math.random() * 0.7
      });
    }
    return swirls;
  }

  update(deltaTime) {
    this.rotation += this.rotationSpeed;

    this.swirls.forEach(swirl => {
      swirl.angle += swirl.speed;
    });
  }

  distanceTo(object) {
    return this.position.distanceTo(object.position);
  }

  getExitPosition() {
    return this.exitPosition.clone();
  }

  render(ctx, camera) {
    const screen = camera.worldToScreen(this.position);
    if (!screen) return;

    const scale = screen.scale;
    const size = this.radius * scale;

    ctx.save();
    ctx.translate(screen.x, screen.y);

    // Draw outer glow
    const glowGradient = ctx.createRadialGradient(0, 0, size * 0.5, 0, 0, size * 2);
    glowGradient.addColorStop(0, 'rgba(128, 0, 255, 0.8)');
    glowGradient.addColorStop(0.5, 'rgba(64, 0, 255, 0.4)');
    glowGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw swirling portal
    ctx.save();
    ctx.rotate(this.rotation);

    this.swirls.forEach((swirl, i) => {
      ctx.save();
      ctx.rotate(swirl.angle);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(0.5, `rgba(${128 + i * 25}, 0, 255, 0.6)`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size * swirl.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();

    // Draw event horizon
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}