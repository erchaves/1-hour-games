// src/games/SpaceExplorer/engine/CollisionSystem.js
export class CollisionSystem {
  checkCollision(obj1, obj2) {
    const dx = obj1.position.x - obj2.position.x;
    const dy = obj1.position.y - obj2.position.y;
    const dz = obj1.position.z - obj2.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return distance < (obj1.radius + obj2.radius);
  }

  checkSphereCollision(pos1, radius1, pos2, radius2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return distance < (radius1 + radius2);
  }
}