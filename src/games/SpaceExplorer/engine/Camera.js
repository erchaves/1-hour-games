// src/games/SpaceExplorer/engine/Camera.js
import { Vector3D } from '../utils/Vector3D';

export class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.position = new Vector3D(0, 0, 0);
    this.rotation = new Vector3D(0, 0, 0);
    this.fov = 1000;
    this.distance = 100; // Distance behind ship
    this.shakeAmount = 0;
    this.shakeDuration = 0;
    this.shakeOffset = new Vector3D(0, 0, 0);
  }

  followShip(ship) {
    // Get ship's forward vector
    const forward = ship.getForwardVector();

    // Always maintain world up direction
    const worldUp = new Vector3D(0, 1, 0);

    // Calculate right vector
    const right = forward.cross(worldUp).normalize();

    // Calculate actual up vector perpendicular to forward and right
    const up = right.cross(forward).normalize();

    // Position camera behind and slightly above the ship
    const distance = 250;
    const heightOffset = 40;

    // Calculate target camera position
    const targetPosition = ship.position
      .subtract(forward.multiply(distance))
      .add(up.multiply(heightOffset));

    // Smoothly interpolate camera position to reduce jitter
    const smoothFactor = 0.1;
    this.position = this.position.add(
      targetPosition.subtract(this.position).multiply(smoothFactor)
    );

    // Look at the ship
    const lookDirection = ship.position.subtract(this.position).normalize();

    // Calculate target camera rotation
    const targetRotationY = Math.atan2(lookDirection.x, lookDirection.z);
    const targetRotationX = -Math.asin(lookDirection.y);

    // Smoothly interpolate camera rotation
    this.rotation.y += (targetRotationY - this.rotation.y) * smoothFactor;
    this.rotation.x += (targetRotationX - this.rotation.x) * smoothFactor;
    this.rotation.z = 0; // Always keep camera level
  }

  shake(amount, duration) {
    this.shakeAmount = amount;
    this.shakeDuration = duration;
  }

  update(deltaTime) {
    if (this.shakeDuration > 0) {
      this.shakeDuration -= deltaTime;
      this.shakeOffset = new Vector3D(
        (Math.random() - 0.5) * this.shakeAmount,
        (Math.random() - 0.5) * this.shakeAmount,
        0
      );
    } else {
      this.shakeOffset = new Vector3D(0, 0, 0);
    }
  }


  worldToScreen(worldPos) {
    // Ensure worldPos is a Vector3D
    let pos;
    if (worldPos instanceof Vector3D) {
      pos = worldPos;
    } else {
      pos = new Vector3D(worldPos.x || 0, worldPos.y || 0, worldPos.z || 0);
    }

    // Transform world position to camera space
    let relativePos = pos.subtract(this.position);

    // Apply camera rotation
    relativePos = relativePos.rotateY(-this.rotation.y);
    relativePos = relativePos.rotateX(-this.rotation.x);
    relativePos = relativePos.rotateZ(-this.rotation.z);

    // Check if behind camera
    if (relativePos.z <= 0.1) return null;

    // Project to screen with proper centering
    const scale = this.fov / relativePos.z;

    // Calculate screen position with offset to center the ship
    const screenCenterX = this.canvas.width / 2;
    const screenCenterY = this.canvas.height / 2;

    // Offset to place ship in center-lower part of screen
    const shipScreenOffsetY = 100; // Adjust this to move ship up/down on screen

    const x = relativePos.x * scale + screenCenterX + this.shakeOffset.x;
    const y = relativePos.y * scale + screenCenterY - shipScreenOffsetY + this.shakeOffset.y;

    return { x, y, scale, distance: relativePos.z };
  }
}