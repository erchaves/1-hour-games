// src/games/SpaceExplorer/engine/SpaceGame.js
import { Ship } from './Ship';
import { Star } from '../entities/Star';
import { Planet } from '../entities/Planet';
import { Asteroid } from '../entities/Asteroid';
import { Crystal } from '../entities/Crystal';
import { Enemy } from '../entities/Enemy';
import { Wormhole } from '../entities/Wormhole';
import { Projectile } from '../entities/Projectile';
import { ParticleSystem } from './ParticleSystem';
import { CollisionSystem } from './CollisionSystem';
import { Camera } from './Camera';
import { Radar } from '../components/Radar';

export class SpaceGame {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = options;

    // Game state
    this.running = false;
    this.paused = false;
    this.score = 0;
    this.lives = 3;
    this.fuel = 100;
    this.shields = 100;

    // Initialize systems
    this.ship = new Ship();
    this.camera = new Camera(canvas);
    this.particleSystem = new ParticleSystem();
    this.collisionSystem = new CollisionSystem();
    this.radar = new Radar();

    // Entity collections
    this.stars = [];
    this.planets = [];
    this.asteroids = [];
    this.crystals = [];
    this.enemies = [];
    this.wormholes = [];
    this.projectiles = [];

    // Input state
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      boost: false,
      brake: false,
      fire: false,
      warp: false,
      map: false
    };

    this.setupInputHandlers();
    this.initializeEntities();
  }

  initializeEntities() {
    // Create starfield
    for (let i = 0; i < 30000; i++) {
      this.stars.push(new Star());
    }

    // Make sure ship has initial forward velocity
    this.ship.velocity = this.ship.getForwardVector().multiply(this.ship.speed);

    // Create planets
    for (let i = 0; i < 50; i++) {
      this.planets.push(new Planet());
    }

    // Create initial asteroids
    for (let i = 0; i < 200; i++) {
      this.asteroids.push(new Asteroid());
    }

    // Create crystals
    for (let i = 0; i < 1000; i++) {
      this.crystals.push(new Crystal());
    }

    // Create wormholes
    for (let i = 0; i < 3; i++) {
      this.wormholes.push(new Wormhole());
    }

    // Create initial enemies
    for (let i = 0; i < 5; i++) {
      this.enemies.push(new Enemy());
    }
  }

  setupInputHandlers() {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft': this.input.left = true; break;
        case 'ArrowRight': this.input.right = true; break;
        case 'ArrowUp': this.input.up = true; break;
        case 'ArrowDown': this.input.down = true; break;
        case 'Shift': this.input.boost = true; break;
        case 'Control': this.input.brake = true; break;
        case ' ':
          e.preventDefault();
          this.input.fire = true;
          break;
        case 'e':
        case 'E':
          this.input.warp = true;
          break;
        case 'Tab':
          e.preventDefault();
          this.input.map = !this.input.map;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch(e.key) {
        case 'ArrowLeft': this.input.left = false; break;
        case 'ArrowRight': this.input.right = false; break;
        case 'ArrowUp': this.input.up = false; break;
        case 'ArrowDown': this.input.down = false; break;
        case 'Shift': this.input.boost = false; break;
        case 'Control': this.input.brake = false; break;
        case ' ': this.input.fire = false; break;
        case 'e':
        case 'E':
          this.input.warp = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Store handlers for cleanup
    this.keyDownHandler = handleKeyDown;
    this.keyUpHandler = handleKeyUp;
  }

  update(deltaTime) {
    if (this.paused) return;

    // Update ship
    this.ship.update(this.input, deltaTime);

    // Update camera to follow ship
    this.camera.followShip(this.ship);

    // Force ship to stay centered (debug)
    const shipScreen = this.camera.worldToScreen(this.ship.position);
    if (shipScreen) {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2 + 100; // Offset down slightly

      // If ship drifts too far from center, adjust camera
      const driftThreshold = 50;
      if (Math.abs(shipScreen.x - centerX) > driftThreshold ||
          Math.abs(shipScreen.y - centerY) > driftThreshold) {
        // Camera needs adjustment
        this.camera.followShip(this.ship);
      }
    }

    // Update all entities
    this.stars.forEach(star => star.update(this.ship));
    this.planets.forEach(planet => planet.update(this.ship));
    this.asteroids.forEach(asteroid => asteroid.update(deltaTime));
    this.crystals.forEach(crystal => crystal.update(deltaTime));
    this.enemies.forEach(enemy => enemy.update(this.ship, deltaTime));
    this.wormholes.forEach(wormhole => wormhole.update(deltaTime));
    this.projectiles.forEach(projectile => projectile.update(deltaTime));

    // Update particle system
    this.particleSystem.update(deltaTime);

    // Handle collisions
    this.handleCollisions();
    this.camera.update(deltaTime);

    // Handle ship actions
    if (this.input.fire && this.ship.canFire()) {
      this.fireWeapon();
    }

    if (this.input.warp && this.ship.canWarp()) {
      this.activateWarp();
    }

    // Remove dead entities
    this.cleanup();

    // Update game state
    this.updateGameState();
  }

  fireWeapon() {
    const projectileData = this.ship.fireWeapon();
    if (projectileData) {
      // Create a proper Projectile instance from the data
      const projectile = new Projectile(
        projectileData.position,
        projectileData.velocity,
        projectileData.damage,
        projectileData.color
      );
      this.projectiles.push(projectile);

      // Add muzzle flash effect
      this.particleSystem.createMuzzleFlash(this.ship.x, this.ship.y, this.ship.z);
    }
  }

  activateWarp() {
    const nearestWormhole = this.findNearestWormhole();
    if (nearestWormhole && nearestWormhole.distanceTo(this.ship) < 500) {
      this.ship.enterWormhole(nearestWormhole);
      this.particleSystem.createWarpEffect(this.ship.x, this.ship.y, this.ship.z);
    }
  }

  findNearestWormhole() {
    let nearest = null;
    let minDistance = Infinity;

    this.wormholes.forEach(wormhole => {
      const distance = wormhole.distanceTo(this.ship);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = wormhole;
      }
    });

    return nearest;
  }

  handleCollisions() {
    // Ship vs Crystals
    this.crystals.forEach(crystal => {
      if (this.collisionSystem.checkCollision(this.ship, crystal)) {
        this.score += crystal.value;
        crystal.collect();
        this.particleSystem.createCollectionEffect(crystal.x, crystal.y, crystal.z);
      }
    });


    // Ship vs Planets (gravitational collision)
    this.planets.forEach(planet => {
      if (this.collisionSystem.checkCollision(this.ship, planet)) {
        this.ship.takeDamage(100); // Instant death
        this.particleSystem.createDamageEffect(this.ship.x, this.ship.y, this.ship.z);
        this.particleSystem.createExplosion(this.ship.x, this.ship.y, this.ship.z);

        // Bigger screen shake for planet collision
        this.camera.shake(20, 0.5);
      }
    });

    // Ship vs Asteroids
    this.asteroids.forEach(asteroid => {
      if (this.collisionSystem.checkCollision(this.ship, asteroid)) {
        this.ship.takeDamage(20);

        this.particleSystem.createDamageEffect(this.ship.x, this.ship.y, this.ship.z);
        this.particleSystem.createExplosion(this.ship.x, this.ship.y, this.ship.z);

        // Screen shake effect
        this.camera.shake(10, 0.3);
        asteroid.destroy();
      }
    });

    // Projectiles vs Enemies
    this.projectiles.forEach(projectile => {
      this.enemies.forEach(enemy => {
        if (this.collisionSystem.checkCollision(projectile, enemy)) {
          enemy.takeDamage(projectile.damage);
          projectile.destroy();
          this.particleSystem.createHitEffect(enemy.x, enemy.y, enemy.z);

          if (enemy.health <= 0) {
            this.score += enemy.value;
            this.particleSystem.createExplosion(enemy.x, enemy.y, enemy.z);
          }
        }
      });
    });

    // Additional collision checks...
  }

  cleanup() {
    this.projectiles = this.projectiles.filter(p => !p.destroyed);
    this.asteroids = this.asteroids.filter(a => !a.destroyed);
    this.enemies = this.enemies.filter(e => !e.destroyed);
    this.crystals = this.crystals.filter(c => !c.collected);

    // Respawn entities if needed
    while (this.asteroids.length < 20) {
      this.asteroids.push(new Asteroid());
    }

    while (this.enemies.length < 5) {
      this.enemies.push(new Enemy());
    }

    while (this.crystals.length < 10) {
      this.crystals.push(new Crystal());
    }
  }

  updateGameState() {
    this.shields = this.ship.shields;
    this.fuel = this.ship.fuel;

    if (this.ship.health <= 0) {
      this.lives--;
      if (this.lives <= 0) {
        this.gameOver();
      } else {
        this.ship.respawn();
      }
    }

    // Notify UI of state changes
    if (this.options.onStateUpdate) {
      this.options.onStateUpdate({
        score: this.score,
        lives: this.lives,
        fuel: this.fuel,
        shields: this.shields
      });
    }
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = '#000011';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render stars (background layer)
    this.stars.forEach(star => star.render(this.ctx, this.camera));

    // Render distant objects
    this.planets.forEach(planet => planet.render(this.ctx, this.camera));
    this.wormholes.forEach(wormhole => wormhole.render(this.ctx, this.camera));

    // Render game objects
    this.asteroids.forEach(asteroid => asteroid.render(this.ctx, this.camera));
    this.crystals.forEach(crystal => crystal.render(this.ctx, this.camera));
    this.enemies.forEach(enemy => enemy.render(this.ctx, this.camera));
    this.projectiles.forEach(projectile => projectile.render(this.ctx, this.camera));

    // Render ship (if not in first-person view)
    this.ship.render(this.ctx, this.camera);

    // Render particle effects
    this.particleSystem.render(this.ctx, this.camera);

    // Render HUD elements
    this.renderHUD();
  }

  renderHUD() {
    // Crosshair
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;

    // Draw crosshair
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - 20, centerY);
    this.ctx.lineTo(centerX + 20, centerY);
    this.ctx.moveTo(centerX, centerY - 20);
    this.ctx.lineTo(centerX, centerY + 20);
    this.ctx.stroke();

    // Render radar/minimap if enabled
    if (this.input.map) {
      this.radar.render(this.ctx, this.ship, {
        asteroids: this.asteroids,
        enemies: this.enemies,
        crystals: this.crystals,
        planets: this.planets,
        wormholes: this.wormholes
      });
    }
  }

  gameLoop() {
    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(deltaTime);
    this.render();

    if (this.running) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  stop() {
    this.running = false;
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
  }

  restart() {
    this.score = 0;
    this.lives = 3;
    this.ship.respawn();
    this.initializeEntities();
  }

  setPaused(paused) {
    this.paused = paused;
  }

  gameOver() {
    if (this.options.onGameOver) {
      this.options.onGameOver(this.score);
    }
  }

  // Add getter for entities to fix radar
  get entities() {
    return {
      asteroids: this.asteroids,
      enemies: this.enemies,
      crystals: this.crystals,
      planets: this.planets,
      wormholes: this.wormholes
    };
  }
}