import PIXI from 'pixi.js';
import { sample, sampleSize, fill } from 'lodash';

import Particle from './components/particle';
import palette from './utils/palette';

const _palette = palette(['#d06e76', '#fdddd7', '#20bfd2']);

let counter = 0;

const PARTICLE_COUNT = 1000;
let coordinates = [];
const particles = [];
const mousePosition = { x: 0, y: 0 };

class Emitter extends PIXI.Sprite {
  render() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = new Particle({ color: sample(_palette) });
      particle.anchor.x = particle.anchor.y = 0.5;

      // Some random values to play around with
      particle.period = Math.min(Math.random(), 0.6);
      particle.offset = Math.random() * 5;

      // Let particles rotate (counter-) clockwise
      particle.angle = sample([-1, 1]);

      // How far can every particle move around?
      particle.tolerance = 0.2 * Math.random();

      // Radius
      particle.oldRadius = particle.radius;
      particle.radius = 50;

      particles[i] = particle;
      this.addChild(particles[i]);
    }
  }

  update() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = particles[i];

      particle.x = coordinates[i][0] + mousePosition.x +
        particle.tolerance * Math.sin(counter * particle.angle + particle.offset);
      particle.y = coordinates[i][1] + mousePosition.y +
        particle.tolerance * Math.cos(counter * particle.angle + particle.offset);

      particle.alpha = Math.max(Math.sin(particle.period * counter + particle.offset), 0);
      particle.radius += (particle.oldRadius - particle.radius);
      particle.scale = new PIXI.Point(particle.radius / 10, particle.radius / 10);
    }
  }
}

let isTweeningValues = false;

const animateValues = (from, to) => {
  if (isTweeningValues) return;
  isTweeningValues = true;

  const duration = 2.5;
  const animatingValue = { val: 0 };
  let newCoordinates = [];

  TweenMax.to(animatingValue, duration, {
    val       : '+=100',
    roundProps: 'val',
    ease      : Power4.easeOut,
    onUpdate  : () => {
      newCoordinates = [];
      const step = (animatingValue.val / 100).toFixed(2);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const dX = to[i][0] - from[i][0];
        const dY = to[i][1] - from[i][1];
        const x = from[i][0] + (dX * step);
        const y = from[i][1] + (dY * step);
        newCoordinates.push([x, y]);
      }
      coordinates = newCoordinates;
    },
    onComplete: () => {
      isTweeningValues = false;
    },
  });
};

const onMouseMove = (event) => {
  const isTouch = event.type.indexOf('touch') !== -1;
  const isPointer = event.type.indexOf('pointer') !== -1;

  if (isPointer) {
    event = event.originalEvent; // eslint-disable-line no-param-reassign
  } else {
    if (isTouch) {
      event = event.originalEvent.touches[0] // eslint-disable-line no-param-reassign
        || event.originalEvent.changedTouches[0];
    }
  }

  const relativeX = event.pageX / (window.innerWidth / 2);
  const relativeY = event.pageY / (window.innerHeight / 2);

  mousePosition.x = (relativeX - 1) * 20;
  mousePosition.y = (relativeY - 1) * 20;
};

class Main {
  constructor({ images }) {
    // Initialize renderer
    this.renderer = PIXI.autoDetectRenderer(this.w, this.h, {
      transparent: true,
      antialias  : true,
    });

    this.images = images;

    coordinates = this.images[0].coordinates;

    setTimeout(() => {
      animateValues(images[0].coordinates, images[1].coordinates);
    }, 5000);

    // Initialize Emitter
    this.emitter = new Emitter();
    this.emitter.x = this.w / 2 - 200; // helft image w/h
    this.emitter.y = this.h / 2 - 118;

    // Initialize the stage
    this.stage = new PIXI.Container();

    // And finally add emitter to the stage
    this.stage.addChild(this.emitter);

    document.body.appendChild(this.renderer.view);
    document.addEventListener('mousemove', onMouseMove);
  }

  render() {
    this.emitter.render();
    this.renderer.render(this.stage);
    this.animate();
  }

  animate() {
    this.emitter.update();
    this.renderer.render(this.stage);

    counter += 0.05;

    window.requestAnimationFrame(() => this.animate());
  }
}

Main.prototype.w = window.innerWidth;
Main.prototype.h = window.innerHeight;

fetch('images.json').then((response) => {
  if (response.status === 200) {
    return response.json();
  }
  return null;
}).then((images) => {
  images.forEach((image) => {
    let newCoordinates = [];
    // When there are enough coordinates to work with, return PARTICLE_COUNT amount of random values
    if (image.coordinates.length > PARTICLE_COUNT) {
      newCoordinates = sampleSize(image.coordinates, PARTICLE_COUNT);
    } else { // Calculate missing particles
      const missingParticlesAmount = PARTICLE_COUNT - image.coordinates.length;
      const randomCoordinates = fill(Array(missingParticlesAmount), sample(image.coordinates));

      newCoordinates = image.coordinates.concat(randomCoordinates);
    }

    image.coordinates = newCoordinates;
    return image;
  });

  const main = new Main({ images });
  main.render();
});
