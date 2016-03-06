import PIXI from 'pixi.js';
import FPSMeter from './utils/fpsmeter';

const PARTICLE_COUNT = 10;
const particleColors = [0xFFFFFF, 0xFFFFFF, 0xFFFFFF];
let values = [];
const particles = [];

const calculatePositions = (screenWidth, screenHeight) => {
  const positions = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i] = {
      x: (screenWidth / 2) + i,
      y: (screenHeight / 2) + i,
    };
  }

  return positions;
};

class Particle extends PIXI.Sprite {
  constructor(...args) {
    super(...args);

    // Get number between 5 and 10.
    this.radius = Math.floor(Math.random() * 10) + 5;

    this.alpha = Math.random();

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(particleColors[Math.floor(Math.random() * particleColors.length)], 1);
    this.graphics.drawCircle(0, 0, this.radius);
    this.addChild(this.graphics);
  }
}

class Emitter extends PIXI.Sprite {
  render() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = new Particle();
      particle.anchor.x = particle.anchor.y = 0.5;
      particle.count = 0;

      particles[i] = particle;
      this.addChild(particles[i]);
    }
  }

  update() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = particles[i];
      const value = values[i];

      particle.x = value.x + Math.sin(50 * particle.count);
      particle.y = value.y + Math.cos(50 * particle.count);

      particle.count += 1;
    }
  }
}

class Main {
  constructor() {
    // Initialize renderer
    this.renderer = PIXI.autoDetectRenderer(this.w, this.h, {
      backgroundColor: 0x1d99a3,
    });
    document.body.appendChild(this.renderer.view);

    values = calculatePositions(this.w, this.h);
    setInterval(() => {
      values = calculatePositions(this.w * Math.random() * 1.5, this.h * Math.random() * 1.5);
    }, 5000);

    // Initialize Emitter
    this.emitter = new Emitter();

    // Initialize FPSMeter
    this.fpsMeter = new FPSMeter();

    // Initialize the stage
    this.stage = new PIXI.Container();

    // And finally add emitter to the stage
    this.stage.addChild(this.emitter);
  }

  render() {
    this.emitter.render();
    this.renderer.render(this.stage);
    this.animate();
  }

  animate() {
    if (this.fpsMeter) this.fpsMeter.update();
    this.emitter.update();
    this.renderer.render(this.stage);
    window.requestAnimationFrame(() => this.animate());
  }
}

Main.prototype.w = window.innerWidth;
Main.prototype.h = window.innerHeight;

const main = new Main();
main.render();
