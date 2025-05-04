// src/games/SpaceExplorer/engine/ParticleSystem.js
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

  render(ctx, camera) {
    this.particles.forEach(particle => {
      const screen = camera.worldToScreen({
        x: particle.x,
        y: particle.y,
        z: particle.z
      });

      if (!screen) return;

      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, particle.size * screen.scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}