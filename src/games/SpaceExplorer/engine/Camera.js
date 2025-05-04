// src/games/SpaceExplorer/engine/Camera.js
import { Vector3D } from '../utils/Vector3D';

export class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.position = new Vector3D(0, 0, 0);
    this.rotation = new Vector3D(0, 0, 0);
    this.fov = 1000;
    this.distance = 200; // Distance behind ship
  }

  followShip(ship) {
    // Get ship's forward vector
    const forward = ship.getForwardVector();

    // Position camera behind and slightly above the ship
    this.position = ship.position.subtract(forward.multiply(this.distance));
    this.position.y -= 50; // Slightly above

    // Camera looks in same direction as ship
    this.rotation = ship.rotation.clone();
  }

  worldToScreen(worldPos) {
    // Transform world position to camera space
    let relativePos = worldPos.subtract(this.position);

    // Apply camera rotation (inverse of ship rotation)
    relativePos = relativePos.rotateY(-this.rotation.y);
    relativePos = relativePos.rotateX(-this.rotation.x);
    relativePos = relativePos.rotateZ(-this.rotation.z);

    // Check if behind camera
    if (relativePos.z <= 0) return null;

    // Project to screen
    const scale = this.fov / relativePos.z;
    const x = relativePos.x * scale + this.canvas.width / 2;
    const y = relativePos.y * scale + this.canvas.height / 2;

    return { x, y, scale, distance: relativePos.z };
  }
}