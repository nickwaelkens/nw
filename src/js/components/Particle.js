import PIXI from 'pixi.js';

class Particle extends PIXI.Sprite {
  constructor({ color }) {
    super();

    // Get number between 2 and 5.
    this.radius = Math.floor(Math.random() * 5) + 2;

    // Set scale to 0 so it feels like particles animate from nothingness
    this.scale = 0;
    this.blendMode = PIXI.BLEND_MODES.ADD;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(color, 1);
    this.graphics.drawCircle(0, 0, this.radius);
    this.addChild(this.graphics);
  }
}

export default Particle;
