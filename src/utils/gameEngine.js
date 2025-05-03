// src/utils/gameEngine.js

export class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.lastTime = 0;
    this.animationFrame = null;

    // Game loop callbacks
    this.onUpdate = options.onUpdate || (() => {});
    this.onRender = options.onRender || (() => {});

    // Fixed time step for physics
    this.fixedTimeStep = 1000 / 60; // 60 FPS
    this.accumulator = 0;

    // Performance monitoring
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastFpsUpdate = this.lastTime;
    this.gameLoop(this.lastTime);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;

    this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update FPS
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }

    // Fixed time step update
    this.accumulator += deltaTime;

    while (this.accumulator >= this.fixedTimeStep) {
      this.onUpdate(this.fixedTimeStep / 1000); // Convert to seconds
      this.accumulator -= this.fixedTimeStep;
    }

    // Render
    this.onRender(this.ctx);

    // Draw FPS (optional)
    if (this.showFps) {
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '16px monospace';
      this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }
  }

  // Utility methods
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Collision detection utilities
  static rectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  static circleCollision(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
  }

  static circleRectCollision(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const dx = circle.x - closestX;
    const dy = circle.y - closestY;

    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
  }
}

// Particle system for visual effects
export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticle(x, y, options = {}) {
    const particle = {
      x,
      y,
      vx: options.vx || (Math.random() - 0.5) * 4,
      vy: options.vy || (Math.random() - 0.5) * 4,
      life: options.life || 1,
      maxLife: options.life || 1,
      color: options.color || '#fff',
      size: options.size || 2
    };

    this.particles.push(particle);
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;

      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(
        particle.x - particle.size / 2,
        particle.y - particle.size / 2,
        particle.size,
        particle.size
      );
    });
    ctx.globalAlpha = 1;
  }
}

// Sound manager for game audio
export class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
  }

  loadSound(name, url) {
    const audio = new Audio(url);
    this.sounds[name] = audio;
  }

  play(name) {
    if (this.muted || !this.sounds[name]) return;

    const sound = this.sounds[name].cloneNode();
    sound.play().catch(e => console.log('Audio play failed:', e));
  }

  toggleMute() {
    this.muted = !this.muted;
  }
}

// High score manager using localStorage
export class HighScoreManager {
  constructor(gameId) {
    this.gameId = gameId;
    this.storageKey = `highscores_${gameId}`;
  }

  getHighScores() {
    const scores = localStorage.getItem(this.storageKey);
    return scores ? JSON.parse(scores) : [];
  }

  addScore(name, score) {
    const scores = this.getHighScores();
    scores.push({ name, score, date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    scores.splice(10); // Keep only top 10
    localStorage.setItem(this.storageKey, JSON.stringify(scores));
  }

  isHighScore(score) {
    const scores = this.getHighScores();
    return scores.length < 10 || score > scores[scores.length - 1].score;
  }
}