// src/games/SpaceExplorer/utils/Vector3D.js
export class Vector3D {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    return new Vector3D(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    );
  }

  subtract(other) {
    return new Vector3D(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    );
  }

  multiply(scalar) {
    return new Vector3D(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    );
  }

  divide(scalar) {
    return new Vector3D(
      this.x / scalar,
      this.y / scalar,
      this.z / scalar
    );
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector3D();
    return this.divide(mag);
  }

  distanceTo(other) {
    return this.subtract(other).magnitude();
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other) {
    return new Vector3D(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  rotateX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3D(
      this.x,
      this.y * cos - this.z * sin,
      this.y * sin + this.z * cos
    );
  }

  rotateY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3D(
      this.x * cos + this.z * sin,
      this.y,
      -this.x * sin + this.z * cos
    );
  }

  rotateZ(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
      this.z
    );
  }

  clone() {
    return new Vector3D(this.x, this.y, this.z);
  }
}