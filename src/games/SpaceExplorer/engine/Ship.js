// src/games/SpaceExplorer/engine/Ship.js
import { Vector3D } from '../utils/Vector3D';
import { Projectile } from '../entities/Projectile';

export class Ship {
  constructor() {
    this.position = new Vector3D(0, 0, 0);
    this.velocity = new Vector3D(0, 0, 0);
    this.rotation = new Vector3D(0, 0, 0); // pitch, yaw, roll

    // Ship properties
    this.health = 100;
    this.shields = 100;
    this.fuel = 100;
    this.maxSpeed = 15;
    this.minSpeed = 2;
    this.acceleration = 5;
    this.turnSpeed = 0.05;

    // Weapon properties
    this.weaponCooldown = 0;
    this.weaponFireRate = 0.2; // seconds between shots
    this.weaponDamage = 10;

    // Warp properties
    this.warpCooldown = 0;
    this.warpCooldownTime = 5;
    this.warpFuelCost = 20;
  }

  update(input, deltaTime) {
    // Handle rotation
    if (input.left) {
      this.rotation.y -= this.turnSpeed;
      this.rotation.z = Math.max(this.rotation.z - this.turnSpeed, -0.5);
    } else if (input.right) {
      this.rotation.y += this.turnSpeed;
      this.rotation.z = Math.min(this.rotation.z + this.turnSpeed, 0.5);
    } else {
      this.rotation.z *= 0.9; // Auto-level
    }

    if (input.up) {
      this.rotation.x -= this.turnSpeed;
    } else if (input.down) {
      this.rotation.x += this.turnSpeed;
    }

    // Calculate forward vector
    const forward = this.getForwardVector();

    // Handle thrust
    let speed = this.velocity.magnitude();

    if (input.boost && this.fuel > 0) {
      speed = Math.min(speed + this.acceleration * deltaTime, this.maxSpeed);
      this.fuel = Math.max(0, this.fuel - 10 * deltaTime);
    } else if (input.brake) {
      speed = Math.max(speed - this.acceleration * deltaTime, this.minSpeed);
    } else {
      // Maintain current speed with slight decay
      speed = Math.max(speed * 0.99, this.minSpeed);
    }

    // Update velocity
    this.velocity = forward.multiply(speed);

    // Update position
    this.position = this.position.add(this.velocity.multiply(deltaTime));

    // Update cooldowns
    this.weaponCooldown = Math.max(0, this.weaponCooldown - deltaTime);
    this.warpCooldown = Math.max(0, this.warpCooldown - deltaTime);

    // Regenerate shields slowly
    this.shields = Math.min(100, this.shields + 5 * deltaTime);
  }

  getForwardVector() {
    return new Vector3D(0, 0, 1)
      .rotateX(this.rotation.x)
      .rotateY(this.rotation.y);
  }

  canFire() {
    return this.weaponCooldown <= 0;
  }

  fireWeapon() {
    if (!this.canFire()) return null;

    this.weaponCooldown = this.weaponFireRate;

    const forward = this.getForwardVector();
    const projectilePos = this.position.add(forward.multiply(50)); // Spawn ahead of ship
    const projectileVel = forward.multiply(30).add(this.velocity); // Inherit ship velocity

    return new Projectile(projectilePos, projectileVel, this.weaponDamage);
  }

  canWarp() {
    return this.warpCooldown <= 0 && this.fuel >= this.warpFuelCost;
  }

  enterWormhole(wormhole) {
    this.fuel -= this.warpFuelCost;
    this.warpCooldown = this.warpCooldownTime;

    // Teleport to wormhole exit
    const exitPosition = wormhole.getExitPosition();
    this.position = exitPosition;

    // Add some random velocity at exit
    this.velocity = new Vector3D(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
  }

  takeDamage(amount) {
    if (this.shields > 0) {
      const shieldDamage = Math.min(amount, this.shields);
      this.shields -= shieldDamage;
      amount -= shieldDamage;
    }

    this.health -= amount;
  }

  respawn() {
    this.position = new Vector3D(0, 0, 0);
    this.velocity = new Vector3D(0, 0, 5);
    this.rotation = new Vector3D(0, 0, 0);
    this.health = 100;
    this.shields = 100;
    this.fuel = 100;
  }

  get x() { return this.position.x; }
  get y() { return this.position.y; }
  get z() { return this.position.z; }
}