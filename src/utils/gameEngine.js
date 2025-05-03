// Shared game engine utilities for all arcade games

export class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.fps = options.fps || 60;
    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.deltaTime = 1000 / this.fps;

    // Game state
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;

    // Callbacks
    this.onUpdate = options.onUpdate || (() => {});
    this.onRender = options.onRender || (() => {});
    this.onGameOver = options.onGameOver || (() => {});

    this.init();
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.setupInputHandlers();
  }

  setupInputHandlers() {
    this.keys = {};

    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  stop() {
    this.running = false;
  }

  gameLoop(currentTime = performance.now()) {
    if (!this.running) return;

    const frameTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += frameTime;

    while (this.accumulator >= this.deltaTime) {
      this.update(this.deltaTime / 1000);
      this.accumulator -= this.deltaTime;
    }

    this.render();
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  update(dt) {
    if (this.gameOver) return;
    this.onUpdate(dt);
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.onRender(this.ctx);
    this.renderUI();
  }

  renderUI() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px "Press Start 2P"';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 60);
    this.ctx.fillText(`Level: ${this.level}`, 10, 90);
  }

  addScore(points) {
    this.score += points;
  }

  loseLife() {
    this.lives--;
    if (this.lives <= 0) {
      this.endGame();
    }
  }

  nextLevel() {
    this.level++;
  }

  endGame() {
    this.gameOver = true;
    this.onGameOver(this.score);
  }
}

// Shared collision detection utilities
export const collision = {
  rectRect: (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  },

  circleCircle: (circle1, circle2) => {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
  },

  pointInRect: (point, rect) => {
    return point.x >= rect.x &&
           point.x <= rect.x + rect.width &&
           point.y >= rect.y &&
           point.y <= rect.y + rect.height;
  }
};

// Shared sprite animation system
export class Sprite {
  constructor(image, frameWidth, frameHeight, frameCount = 1) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameInterval = 100; // ms per frame
  }

  update(dt) {
    this.frameTimer += dt * 1000;
    if (this.frameTimer >= this.frameInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.frameTimer = 0;
    }
  }

  draw(ctx, x, y, scale = 1) {
    ctx.drawImage(
      this.image,
      this.currentFrame * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth * scale,
      this.frameHeight * scale
    );
  }
}

// Shared particle system
export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, options = {}) {
    const particle = {
      x,
      y,
      vx: options.vx || (Math.random() - 0.5) * 2,
      vy: options.vy || (Math.random() - 0.5) * 2,
      life: options.life || 1,
      maxLife: options.life || 1,
      color: options.color || 'white',
      size: options.size || 2
    };
    this.particles.push(particle);
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt * 100;
      p.y += p.vy * dt * 100;
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
  }
}