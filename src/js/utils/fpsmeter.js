export default class FPSMeter {
  constructor() {
    this.elapsed = this.now = Date.now();

    // Not sure if I should've done this with css, whatever
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.backgroundColor = '#fff';
    this.element.style.top = 0;
    this.element.style.padding = '10px';
    this.element.style.font = '12px monospace';

    document.body.appendChild(this.element);
  }

  update() {
    this.now = Date.now();

    const fps = (1000 / (this.now - this.elapsed)).toFixed(2);
    this.element.innerHTML = `FPS: ${fps}`;

    this.elapsed = this.now;
  }
}
