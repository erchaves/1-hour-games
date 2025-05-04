// src/games/SpaceExplorer/entities/Planet.js
import { Vector3D } from '../utils/Vector3D';

export class Planet {
  constructor() {
    this.reset();
  }

  reset() {
    // Random position in space
    const angle = Math.random() * Math.PI * 2;
    const distance = 2000 + Math.random() * 3000;

    this.position = new Vector3D(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 1000,
      Math.sin(angle) * distance
    );

    this.radius = 100 + Math.random() * 200;
    this.rotationSpeed = (Math.random() - 0.5) * 0.001;
    this.rotation = Math.random() * Math.PI * 2;

    // Planet properties
    this.type = this.generateType();
    this.color = this.generateColor();
    this.atmosphere = Math.random() > 0.5;
    this.rings = Math.random() > 0.7;
  }

  generateType() {
    const types = ['rocky', 'gas', 'ice', 'lava', 'earth'];
    return types[Math.floor(Math.random() * types.length)];
  }

  generateColor() {
    const colors = {
      rocky: ['#8B4513', '#A0522D', '#CD853F'],
      gas: ['#FFE4B5', '#FFA07A', '#FF8C00'],
      ice: ['#B0E0E6', '#87CEEB', '#4682B4'],
      lava: ['#FF4500', '#FF6347', '#DC143C'],
      earth: ['#228B22', '#32CD32', '#3CB371']
    };

    const typeColors = colors[this.type];
    return typeColors[Math.floor(Math.random() * typeColors.length)];
  }

  update(ship) {
    this.rotation += this.rotationSpeed;

    // Apply gravitational effect on ship
    const distance = this.position.distanceTo(ship.position);
    if (distance < this.radius * 10) {
      const force = (this.radius * 50) / (distance * distance);
      const direction = this.position.subtract(ship.position).normalize();
      ship.velocity = ship.velocity.add(direction.multiply(Math.min(force, 0.5)));
    }
  }

  render(ctx, camera) {
    const screen = camera.worldToScreen(this.position);
    if (!screen) return;

    const screenRadius = this.radius * screen.scale;
    if (screenRadius < 1) return;

    // Draw planet
    ctx.save();
    ctx.translate(screen.x, screen.y);

    // Planet body
    const gradient = ctx.createRadialGradient(
      -screenRadius * 0.3, -screenRadius * 0.3, 0,
      0, 0, screenRadius
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, this.adjustColor(this.color, -50));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, screenRadius, 0, Math.PI * 2);
    ctx.fill();

    // Atmosphere
    if (this.atmosphere) {
      const atmGradient = ctx.createRadialGradient(
        0, 0, screenRadius,
        0, 0, screenRadius * 1.2
      );
      atmGradient.addColorStop(0, 'transparent');
      atmGradient.addColorStop(1, this.adjustColor(this.color, 0, 0.3));

      ctx.fillStyle = atmGradient;
      ctx.beginPath();
      ctx.arc(0, 0, screenRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rings
    if (this.rings) {
      ctx.strokeStyle = this.adjustColor(this.color, 20, 0.5);
      ctx.lineWidth = screenRadius * 0.1;
      ctx.beginPath();
      ctx.ellipse(0, 0, screenRadius * 1.5, screenRadius * 0.3, this.rotation, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  adjustColor(color, brightness = 0, alpha = 1) {
   // Simple color adjustment function
   const r = parseInt(color.substr(1, 2), 16) + brightness;
   const g = parseInt(color.substr(3, 2), 16) + brightness;
   const b = parseInt(color.substr(5, 2), 16) + brightness;

   const clamp = (val) => Math.max(0, Math.min(255, val));

   if (alpha < 1) {
     return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${alpha})`;
   }

   const toHex = (val) => clamp(val).toString(16).padStart(2, '0');
   return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
 }
}