// src/games/SpaceExplorer/components/Radar.jsx
export class Radar {
  constructor() {
    this.size = 150;
    this.range = 2000;
  }

  render(ctx, ship, entities) {
    const radarX = ctx.canvas.width - this.size - 20;
    const radarY = ctx.canvas.height - this.size - 20;
    const centerX = radarX + this.size / 2;
    const centerY = radarY + this.size / 2;

    // Draw radar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw radar rings
    ctx.strokeStyle = '#00ff0044';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (this.size / 2) * (i / 3), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw radar sweep
    const sweepAngle = (Date.now() / 1000) % (Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, this.size / 2, sweepAngle, sweepAngle + Math.PI / 4);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Draw ship in center
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw entities on radar
    const allEntities = {
      asteroids: entities.asteroids || [],
      enemies: entities.enemies || [],
      crystals: entities.crystals || [],
      planets: entities.planets || [],
      wormholes: entities.wormholes || []
    };

    // Draw each type of entity
    this.drawEntitiesOnRadar(ctx, ship, centerX, centerY, allEntities.asteroids, '#ff6600', 2);
    this.drawEntitiesOnRadar(ctx, ship, centerX, centerY, allEntities.enemies, '#ff0000', 3);
    this.drawEntitiesOnRadar(ctx, ship, centerX, centerY, allEntities.crystals, '#00ffff', 2);
    this.drawEntitiesOnRadar(ctx, ship, centerX, centerY, allEntities.planets, '#4444ff', 4);
    this.drawEntitiesOnRadar(ctx, ship, centerX, centerY, allEntities.wormholes, '#ff00ff', 3);
  }

  drawEntitiesOnRadar(ctx, ship, centerX, centerY, entities, color, size) {
    ctx.fillStyle = color;

    entities.forEach(entity => {
      const dx = entity.position.x - ship.position.x;
      const dz = entity.position.z - ship.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < this.range) {
        // Rotate based on ship's heading
        const angle = Math.atan2(dz, dx) - ship.rotation.y;
        const radarDistance = (distance / this.range) * (this.size / 2);

        const blipX = centerX + Math.cos(angle) * radarDistance;
        const blipY = centerY + Math.sin(angle) * radarDistance;

        ctx.beginPath();
        ctx.arc(blipX, blipY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}