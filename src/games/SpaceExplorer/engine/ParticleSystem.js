// src/games/SpaceExplorer/engine/ParticleSystem.js
import { Vector3D } from '../utils/Vector3D';

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life -= deltaTime;

      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.z += particle.vz * deltaTime;

      particle.vx *= particle.drag;
      particle.vy *= particle.drag;
      particle.vz *= particle.drag;
    }
  }

  createExplosion(x, y, z) {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        vz: (Math.random() - 0.5) * 10,
        life: 1,
        maxLife: 1,
        color: '#ff8800',
        size: 3,
        drag: 0.95
      });
    }
  }

  createMuzzleFlash(x, y, z) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        vz: (Math.random() - 0.5) * 5,
        life: 0.2,
        maxLife: 0.2,
        color: '#ffff00',
        size: 2,
        drag: 0.9
      });
    }
  }

  createWarpEffect(x, y, z) {
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 20;
      this.particles.push({
        x, y, z,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (Math.random() - 0.5) * 10,
        life: 1,
        maxLife: 1,
        color: '#8800ff',
        size: 2,
        drag: 0.98
      });
    }
  }

  createCollectionEffect(x, y, z) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        vz: (Math.random() - 0.5) * 3,
        life: 0.5,
        maxLife: 0.5,
        color: '#00ffff',
        size: 2,
        drag: 0.9
      });
    }
  }

  createHitEffect(x, y, z) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        vz: (Math.random() - 0.5) * 8,
        life: 0.3,
        maxLife: 0.3,
        color: '#ff0000',
        size: 2,
        drag: 0.9
      });
    }
  }

  createDamageEffect(x, y, z) {
    // Sparks and debris - smaller, faster, longer-lasting
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200; // Random speed between 100-300
      const elevation = (Math.random() - 0.3) * Math.PI; // Bias upward
      const forwardBias = 50;

      this.particles.push({
        x, y, z,
        vx: Math.cos(angle) * Math.cos(elevation) * speed,
        vy: Math.sin(elevation) * speed + Math.random() * 50, // Bias upward
        vz: Math.sin(angle) * Math.cos(elevation) * speed + forwardBias, // Add forward bias
        life: 0.8 + Math.random() * 0.4,
        maxLife: 0.8 + Math.random() * 0.4,
        color: Math.random() > 0.5 ? '#ff8800' : '#ffff00',
        size: Math.random() * 1.5 + 0.5,
        drag: 0.97
      });

    }

    // Shield flicker effect
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 20;

      this.particles.push({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius * 0.5, // Flatter distribution
        z: z + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 50,
        vy: Math.random() * 30, // Mostly upward
        vz: Math.sin(angle) * 50 + 20, // Slight forward bias
        life: 0.4,
        maxLife: 0.4,
        color: '#00ffff',
        size: 2,
        drag: 0.95
      });
    }
  }

  render(ctx, camera) {
    this.particles.forEach(particle => {
      const screen = camera.worldToScreen({
        x: particle.x,
        y: particle.y,
        z: particle.z
      });

      if (!screen) return;

      const alpha = particle.life / particle.maxLife;
      const alphaHex = Math.floor(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0');

      ctx.fillStyle = particle.color + alphaHex;

      // Scale particle size with distance more naturally
      const scaledSize = particle.size * screen.scale * 0.5; // Reduced scale factor
      const minSize = 0.5;
      const renderSize = Math.max(minSize, scaledSize);

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, renderSize, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}