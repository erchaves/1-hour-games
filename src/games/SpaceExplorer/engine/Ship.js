// src/games/SpaceExplorer/engine/Ship.js
import { Vector3D } from '../utils/Vector3D';

export class Ship {
  constructor() {
    this.position = new Vector3D(0, 0, 0);
    this.rotation = new Vector3D(0, 0, 0); // pitch, yaw, roll
    this.velocity = new Vector3D(0, 0, 0);

    // Ship properties
    this.speed = 600; // Base forward speed
    this.turnSpeed = 0.015;
    this.radius = 20;

    // Visual ship rotation for banking effect
    this.visualRotation = new Vector3D(0, 0, 0);
    this.maxVisualTilt = Math.PI / 4; // 45 degrees

    // Health/shields
    this.health = 100;
    this.shields = 100;
    this.fuel = 100;

    // Weapon properties
    this.lastFireTime = 0;
    this.fireRate = 0.25; // 4 shots per second
    this.hitFlashTime = 0;
  }

  update(input, deltaTime) {
    // Handle rotation based on input
    let targetVisualRoll = 0;
    let targetVisualPitch = 0;

    // Apply yaw (left/right turning)
    if (input.left) {
      this.rotation.y -= this.turnSpeed;
      targetVisualRoll = -this.maxVisualTilt * 0.5;
    }
    if (input.right) {
      this.rotation.y += this.turnSpeed;
      targetVisualRoll = this.maxVisualTilt * 0.5;
    }

    // Apply pitch (up/down) with strict limits
    if (input.up) {
      this.rotation.x = Math.max(this.rotation.x - this.turnSpeed, -Math.PI / 3); // Limit to 60 degrees up
      targetVisualPitch = -this.maxVisualTilt * 0.3;
    }
    if (input.down) {
      this.rotation.x = Math.min(this.rotation.x + this.turnSpeed, Math.PI / 3); // Limit to 60 degrees down
      targetVisualPitch = this.maxVisualTilt * 0.3;
    }

    // Keep yaw normalized
    this.rotation.y = this.rotation.y % (Math.PI * 2);

    // Never allow roll to accumulate
    this.rotation.z = 0;

    // Smooth visual rotation
    this.visualRotation.z += (targetVisualRoll - this.visualRotation.z) * 0.1;
    this.visualRotation.x += (targetVisualPitch - this.visualRotation.x) * 0.1;

    // Calculate forward vector
    const forward = this.getForwardVector();

    // Update velocity
    let currentSpeed = this.speed;

    if (input.boost) {
      currentSpeed *= 1.5;
    } else if (input.brake) {
      currentSpeed *= 0.5;
    }

    this.velocity = forward.multiply(currentSpeed);

    // Update position
    this.position = this.position.add(this.velocity.multiply(deltaTime));

    // Regenerate shields
    this.shields = Math.min(100, this.shields + 5 * deltaTime);

    // Update fire cooldown
    this.lastFireTime += deltaTime;
  }

  getForwardVector() {
    // Start with forward direction (0, 0, 1)
    let forward = new Vector3D(0, 0, 1);

    // Apply rotations in the correct order: yaw first, then pitch
    forward = forward.rotateY(this.rotation.y);
    forward = forward.rotateX(this.rotation.x);

    return forward.normalize(); // Ensure it's normalized
  }

  takeDamage(amount) {
    // First, damage is absorbed by shields
    if (this.shields > 0) {
      const shieldDamage = Math.min(this.shields, amount);
      this.shields -= shieldDamage;
      amount -= shieldDamage;
    }

    // Remaining damage affects health
    if (amount > 0) {
      this.health -= amount;
    }

    // Ensure values don't go below 0
    this.shields = Math.max(0, this.shields);
    this.health = Math.max(0, this.health);
    this.hitFlashTime = 0.2; // Flash for 0.2 seconds
  }

  respawn() {
    this.position = new Vector3D(0, 0, 0);
    this.rotation = new Vector3D(0, 0, 0);
    this.velocity = new Vector3D(0, 0, 0);
    this.health = 100;
    this.shields = 100;
    this.fuel = 100;
    this.lastFireTime = 0;
  }

  canFire() {
    return this.lastFireTime >= this.fireRate;
  }

  fireWeapon() {
    if (!this.canFire()) return null;

    this.lastFireTime = 0;

    // Create projectile moving in ship's forward direction
    const projectileSpeed = 800;
    const forward = this.getForwardVector();
    const projectileVelocity = forward.multiply(projectileSpeed);

    // Import is not working since they're in same directory, so return data for projectile
    return {
      position: this.position.clone(),
      velocity: projectileVelocity,
      damage: 20,
      color: '#00ff00'
    };
  }

  canWarp() {
    return this.fuel >= 20; // Requires at least 20% fuel
  }

  enterWormhole(wormhole) {
    if (this.canWarp()) {
      this.fuel -= 20;
      this.position = wormhole.getExitPosition();
      // Could add more warp effects here
    }
  }

  render(ctx, camera) {
    // Ship design - now properly oriented forward
    const vertices = {
      // Main body - ship faces forward (positive Z)
      nose: new Vector3D(0, 0, 30),

      // Wing tips
      leftWingTip: new Vector3D(-25, 2, -15),
      rightWingTip: new Vector3D(25, 2, -15),

      // Wing inner points (closer to body)
      leftWingInner: new Vector3D(-8, 0, 15),
      rightWingInner: new Vector3D(8, 0, 15),

      // Rear center
      rearCenter: new Vector3D(0, 0, -20),

      // Engine positions (moved back)
      engineLeft: new Vector3D(-10, 2, -25),
      engineRight: new Vector3D(10, 2, -25)
    };

    // Transform all vertices
    const transformedVertices = {};
    for (const [key, vertex] of Object.entries(vertices)) {
      let transformed = vertex.rotateY(this.rotation.y)
                            .rotateX(this.rotation.x);
      // Apply visual tilt for banking effects only
      transformed = transformed.rotateZ(this.visualRotation.z)
                            .rotateX(this.visualRotation.x);
      transformedVertices[key] = transformed.add(this.position);
    }

    // Project vertices to screen
    const screenVertices = {};
    for (const [key, vertex] of Object.entries(transformedVertices)) {
      screenVertices[key] = camera.worldToScreen(vertex);
    }

    // Skip if behind camera
    if (!screenVertices.nose || !screenVertices.rearCenter) return;

    ctx.save();

    // Engine glow effect (behind ship)
    if (this.velocity.magnitude() > 0) {
      ctx.fillStyle = 'rgba(0, 150, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(screenVertices.engineLeft.x, screenVertices.engineLeft.y,
              8 * screenVertices.engineLeft.scale, 0, Math.PI * 2);
      ctx.arc(screenVertices.engineRight.x, screenVertices.engineRight.y,
              8 * screenVertices.engineRight.scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ship colors
    const mainColor = this.hitFlashTime > 0 ? '#ff4444' : '#4488ff';
    const darkColor = this.hitFlashTime > 0 ? '#cc0000' : '#2266dd';

    // Main body (delta wing shape)
    ctx.fillStyle = mainColor;
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 2;

    // Draw main delta wing
    ctx.beginPath();
    ctx.moveTo(screenVertices.nose.x, screenVertices.nose.y);
    ctx.lineTo(screenVertices.leftWingTip.x, screenVertices.leftWingTip.y);
    ctx.lineTo(screenVertices.rearCenter.x, screenVertices.rearCenter.y);
    ctx.lineTo(screenVertices.rightWingTip.x, screenVertices.rightWingTip.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw center section (darker)
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.moveTo(screenVertices.nose.x, screenVertices.nose.y);
    ctx.lineTo(screenVertices.leftWingInner.x, screenVertices.leftWingInner.y);
    ctx.lineTo(screenVertices.rearCenter.x, screenVertices.rearCenter.y);
    ctx.lineTo(screenVertices.rightWingInner.x, screenVertices.rightWingInner.y);
    ctx.closePath();
    ctx.fill();

    // Draw engines
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(screenVertices.engineLeft.x, screenVertices.engineLeft.y,
            6 * screenVertices.engineLeft.scale, 0, Math.PI * 2);
    ctx.arc(screenVertices.engineRight.x, screenVertices.engineRight.y,
            6 * screenVertices.engineRight.scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  get x() { return this.position.x; }
  get y() { return this.position.y; }
  get z() { return this.position.z; }
}