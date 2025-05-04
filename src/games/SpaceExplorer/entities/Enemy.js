// src/games/SpaceExplorer/entities/Enemy.js
import { Vector3D } from '../utils/Vector3D';
import { Projectile } from './Projectile';

export class Enemy {
  constructor() {
    this.destroyed = false;
    this.reset();
  }

  reset() {
    // Spawn at random position
    const angle = Math.random() * Math.PI * 2;
    const distance = 500 + Math.random() * 1500;

    this.position = new Vector3D(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 500,
      Math.sin(angle) * distance
    );

    this.velocity = new Vector3D(0, 0, 0);
    this.rotation = new Vector3D(0, 0, 0);

    this.health = 50;
    this.maxHealth = 50;
    this.speed = 8;
    this.aggroRange = 800;
    this.attackRange = 400;
    this.fireRate = 1; // seconds between shots
    this.lastFireTime = 0;
    this.damage = 15;
    this.value = 100; // Points for destroying

    this.type = this.generateType();
    this.color = this.getColorForType();
  }

  generateType() {
    const types = ['fighter', 'bomber', 'interceptor'];
    return types[Math.floor(Math.random() * types.length)];
  }

  getColorForType() {
    const colors = {
      fighter: '#ff4444',
      bomber: '#ff8844',
      interceptor: '#ff44ff'
    };
    return colors[this.type];
  }

  update(ship, deltaTime) {
    if (this.destroyed) return;

    const toShip = ship.position.subtract(this.position);
    const distance = toShip.magnitude();

    if (distance < this.aggroRange) {
      // Move towards ship
      const direction = toShip.normalize();
      this.velocity = direction.multiply(this.speed);

      // Rotate to face ship
      this.rotation.y = Math.atan2(direction.x, direction.z);
      this.rotation.x = -Math.asin(direction.y);

      // Attack if in range
      if (distance < this.attackRange) {
        this.attack(ship, deltaTime);
      }
    } else {
      // Patrol behavior
      this.velocity = this.velocity.multiply(0.95);
    }

    this.position = this.position.add(this.velocity.multiply(deltaTime));
  }

  attack(ship, deltaTime) {
    this.lastFireTime += deltaTime;

    if (this.lastFireTime >= this.fireRate) {
      this.lastFireTime = 0;
      return this.fireProjectile(ship);
    }

    return null;
  }

  fireProjectile(ship) {
    const direction = ship.position.subtract(this.position).normalize();
    const projectileVelocity = direction.multiply(25);

    return new Projectile(
      this.position.clone(),
      projectileVelocity,
      this.damage,
      this.color
    );
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.destroyed = true;
  }

  render(ctx, camera) {
    if (this.destroyed) return;

    const screen = camera.worldToScreen(this.position);
    if (!screen) return;

    const scale = screen.scale;
    const size = 20 * scale;

    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.rotate(this.rotation.y);

    // Draw enemy ship
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (this.type === 'fighter') {
      // Triangle shape
      ctx.moveTo(0, -size);
      ctx.lineTo(-size * 0.7, size);
      ctx.lineTo(size * 0.7, size);
    } else if (this.type === 'bomber') {
      // Diamond shape
      ctx.moveTo(0, -size);
      ctx.lineTo(-size, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(size, 0);
    } else {
      // Arrow shape
      ctx.moveTo(0, -size);
      ctx.lineTo(-size * 0.5, size * 0.5);
      ctx.lineTo(0, size * 0.3);
      ctx.lineTo(size * 0.5, size * 0.5);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Health bar
    if (this.health < this.maxHealth) {
      const barWidth = size * 2;
      const barHeight = 4;
      const healthPercent = this.health / this.maxHealth;

      ctx.fillStyle = '#ff0000';
      ctx.fillRect(-barWidth/2, -size - 10, barWidth, barHeight);

      ctx.fillStyle = '#00ff00';
      ctx.fillRect(-barWidth/2, -size - 10, barWidth * healthPercent, barHeight);
    }

    ctx.restore();
  }
}