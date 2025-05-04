// src/games/SpaceExplorer/entities/Crystal.js
import { Vector3D } from '../utils/Vector3D';

export class Crystal {
  constructor() {
    this.collected = false;
    this.reset();
  }

  reset() {
    // Random position in space
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 2000;

    this.position = new Vector3D(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 1000,
      Math.sin(angle) * distance
    );

    this.rotation = 0;
    this.rotationSpeed = 0.02;
    this.value = 50;
    this.radius = 15;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.bobPhase = Math.random() * Math.PI * 2;

    // Crystal color
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(deltaTime) {
    if (this.collected) return;

    this.rotation += this.rotationSpeed;
    this.pulsePhase += deltaTime * 2;
    this.bobPhase += deltaTime;

    // Bob up and down
    this.position.y += Math.sin(this.bobPhase) * 0.2;
  }

  collect() {
    this.collected = true;
  }

  render(ctx, camera) {
    if (this.collected) return;

    const screen = camera.worldToScreen(this.position);
    if (!screen) return;

    const scale = screen.scale;
    const size = this.radius * scale;
    const pulse = 0.8 + Math.sin(this.pulsePhase) * 0.2;

    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.rotate(this.rotation);

    // Draw crystal with glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color + '88');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw crystal shape
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = size * pulse;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Add shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(-size * 0.3, -size * 0.3, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}