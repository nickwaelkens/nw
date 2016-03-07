import PIXI from 'pixi.js';
import { sample } from 'lodash';

import FPSMeter from './utils/fpsmeter';
import Particle from './components/particle';

const palette = [0xffffff, 0x000000];

let counter = 0;

const PARTICLE_COUNT = 2000;
let values = [];
const particles = [];

const calculatePositions = (screenWidth, screenHeight) => {
  const positions = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i] = {
      x: screenWidth * Math.random(),
      y: screenHeight * Math.random(),
    };
  }

  return positions;
};

class Emitter extends PIXI.Sprite {
  render() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = new Particle({ color: sample(palette) });
      particle.anchor.x = particle.anchor.y = 0.5;

      // Set each particle's initial position
      particle.x = values[i].x;
      particle.y = values[i].y;

      particle.period = Math.min(Math.random(), 0.5);
      particle.offset = Math.random() * 5;

      // Let particles rotate (counter-) clockwise
      particle.angle = sample([-1, 1]);

      // How far can every particle move around?
      particle.tolerance = 0.08 * Math.random();

      particles[i] = particle;
      this.addChild(particles[i]);
    }
  }

  update() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = particles[i];

      particle.x += particle.tolerance * Math.sin(counter * particle.angle + particle.offset);
      particle.y += particle.tolerance * Math.cos(counter * particle.angle + particle.offset);
      particle.alpha = Math.max(Math.sin(particle.period * counter + particle.offset), 0);
    }
  }
}

class Main {
  constructor() {
    // Initialize renderer
    this.renderer = PIXI.autoDetectRenderer(this.w, this.h, {
      backgroundColor: 0x1d99a3,
      antialias      : true,
    });
    document.body.appendChild(this.renderer.view);

    values = calculatePositions(this.w, this.h);

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

    counter += 0.05;

    window.requestAnimationFrame(() => this.animate());
  }
}

Main.prototype.w = window.innerWidth;
Main.prototype.h = window.innerHeight;

const main = new Main();
main.render();
