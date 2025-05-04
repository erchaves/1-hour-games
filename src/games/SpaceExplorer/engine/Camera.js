// src/games/SpaceExplorer/engine/Camera.js
import { Vector3D } from '../utils/Vector3D';

export class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.position = new Vector3D(0, 0, -200);
    this.rotation = new Vector3D(0, 0, 0);
    this.fov = 1000;
    this.distance = 200; // Distance behind ship
  }

  followShip(ship) {
    // Calculate camera position behind ship
    const forward = ship.getForwardVector();
    this.position = ship.position.subtract(forward.multiply(this.distance));

    // Match ship rotation
    this.rotation = ship.rotation.clone();
  }

  worldToScreen(position) {
    // Transform to camera space
    let pos = position.subtract(this.position);

    // Apply camera rotation (inverse of ship rotation)
    pos = pos.rotateY(-this.rotation.y);
    pos = pos.rotateX(-this.rotation.x);
    pos = pos.rotateZ(-this.rotation.z);

    // Project to 2D
    if (pos.z <= 0) return null; // Behind camera

    const scale = this.fov / pos.z;
    const x2d = pos.x * scale + this.canvas.width / 2;
    const y2d = pos.y * scale + this.canvas.height / 2;

    return { x: x2d, y: y2d, scale: scale, distance: pos.z };
  }

  isInView(position, margin = 100) {
    const screen = this.worldToScreen(position);
    if (!screen) return false;

    return screen.x > -margin && screen.x < this.canvas.width + margin &&
           screen.y > -margin && screen.y < this.canvas.height + margin;
  }
}