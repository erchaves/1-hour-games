// src/games/SpaceExplorer/engine/Ship.js
import { Vector3D } from '../utils/Vector3D';

export class Ship {
  constructor() {
    this.position = new Vector3D(0, 0, 0);
    this.rotation = new Vector3D(0, 0, 0); // pitch, yaw, roll
    this.velocity = new Vector3D(0, 0, 0);

    // Ship properties
    this.speed = 400; // Base forward speed
    this.turnSpeed = 0.02;
    this.radius = 20;

    // Visual ship rotation for banking effect
    this.visualRotation = new Vector3D(0, 0, 0);
    this.maxVisualTilt = Math.PI / 4; // 45 degrees

    // Health/shields
    this.health = 100;
    this.shields = 100;
    this.fuel = 100;
  }

  update(input, deltaTime) {
    // Handle rotation based on input
    let targetVisualRoll = 0;
    let targetVisualPitch = 0;

    if (input.left) {
      this.rotation.y -= this.turnSpeed;
      targetVisualRoll = -this.maxVisualTilt * 0.5;
    }
    if (input.right) {
      this.rotation.y += this.turnSpeed;
      targetVisualRoll = this.maxVisualTilt * 0.5;
    }
    if (input.up) {
      this.rotation.x -= this.turnSpeed;
      targetVisualPitch = -this.maxVisualTilt * 0.3;
    }
    if (input.down) {
      this.rotation.x += this.turnSpeed;
      targetVisualPitch = this.maxVisualTilt * 0.3;
    }

    // Smooth visual rotation
    this.visualRotation.z += (targetVisualRoll - this.visualRotation.z) * 0.1;
    this.visualRotation.x += (targetVisualPitch - this.visualRotation.x) * 0.1;

    // Calculate forward vector
    const forward = this.getForwardVector();

    // Update velocity
    this.velocity = forward.multiply(this.speed);

    // Update position
    this.position = this.position.add(this.velocity.multiply(deltaTime));

    // Regenerate shields
    this.shields = Math.min(100, this.shields + 5 * deltaTime);
  }

  getForwardVector() {
    // Start with forward direction (0, 0, 1)
    let forward = new Vector3D(0, 0, 1);

    // Apply rotations
    forward = forward.rotateX(this.rotation.x);
    forward = forward.rotateY(this.rotation.y);

    return forward;
  }

  render(ctx, camera) {
    // Ship vertices for rendering
    const vertices = [
      new Vector3D(0, 0, 25),         // Front
      new Vector3D(-20, 0, -25),      // Back left
      new Vector3D(20, 0, -25),       // Back right
      new Vector3D(0, -10, 0)         // Top center
    ];

    // Transform vertices with visual rotation
    const transformedVertices = vertices.map(v => {
      let transformed = v.rotateX(this.rotation.x + this.visualRotation.x)
                        .rotateY(this.rotation.y)
                        .rotateZ(this.rotation.z + this.visualRotation.z);
      return transformed.add(this.position);
    });

    // Project vertices to screen
    const screenVertices = transformedVertices.map(v => camera.worldToScreen(v));

    // Skip rendering if behind camera
    if (screenVertices.some(v => v === null)) return;

    ctx.save();

    // Draw ship body
    ctx.fillStyle = '#4488ff';
    ctx.strokeStyle = '#88ccff';
    ctx.lineWidth = 2;

    // Main triangle
    ctx.beginPath();
    ctx.moveTo(screenVertices[0].x, screenVertices[0].y);
    ctx.lineTo(screenVertices[1].x, screenVertices[1].y);
    ctx.lineTo(screenVertices[2].x, screenVertices[2].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cockpit
    ctx.fillStyle = '#66aaff';
    ctx.beginPath();
    ctx.moveTo(screenVertices[0].x, screenVertices[0].y);
    ctx.lineTo(screenVertices[3].x, screenVertices[3].y);
    ctx.lineTo(screenVertices[1].x, screenVertices[1].y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(screenVertices[0].x, screenVertices[0].y);
    ctx.lineTo(screenVertices[3].x, screenVertices[3].y);
    ctx.lineTo(screenVertices[2].x, screenVertices[2].y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  get x() { return this.position.x; }
  get y() { return this.position.y; }
  get z() { return this.position.z; }
}