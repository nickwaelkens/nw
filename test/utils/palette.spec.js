import { expect } from 'chai';
import palette from '../../src/js/utils/palette';

describe('palette()', () => {
  it('verify not providing an array of base colors results in an error', () => {
    expect(palette.bind(palette, { colors: ['#ff0', '#aaa', '#000'] }))
      .to.throw('Base colors should be an array');
  });

  it('verify not providing at least 2 base colors results in an error', () => {
    expect(palette.bind(palette, ['#ff0']))
      .to.throw('At least 2 base colors are required to generate a palette');

    expect(palette.bind(palette))
      .to.throw('At least 2 base colors are required to generate a palette');
  });

  it('verify setting amount of colors to work', () => {
    expect(palette(['#fff', '#000']).length).to.equal(5);
    expect(palette(['#fff', '#000'], 15).length).to.equal(15);
  });

  it('verify getting an array of hex values to be used in PIXI', () => {
    expect(palette(['#fff', '#000'], 2)).to.deep.equal([0xffffff, 0x000000]);
  });
});
