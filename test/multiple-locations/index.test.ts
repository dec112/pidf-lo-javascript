import fs from 'fs';
import path from 'path';

import { Circle, LocationMethod, PidfLo, Tuple, XMLCompat } from '../../dist/main';

const valid = fs.readFileSync(path.join(__dirname, 'valid.xml'), 'utf-8');

describe('PidfLo multiple locations', () => {
  it('parses valid xml circle', () => {
    const parsed = PidfLo.fromXML(valid);

    if (!parsed)
      throw 'Could not parse PIDF-LO';

    const {
      simple,
      simpleArray,
    } = parsed;

    expect(simple).toHaveProperty('latitude', 12.345);
    expect(simple).toHaveProperty('longitude', 67.89);
    expect(simple).toHaveProperty('altitude', 36.7);
    expect(simple).not.toHaveProperty('radius');
    expect(simple).toHaveProperty('method', LocationMethod.GPS);

    expect(simpleArray[0]).toHaveProperty('latitude', 12.345);
    expect(simpleArray[0]).toHaveProperty('longitude', 67.89);
    expect(simpleArray[0]).toHaveProperty('altitude', 36.7);
    expect(simpleArray[0]).not.toHaveProperty('radius');
    expect(simpleArray[0]).toHaveProperty('method', LocationMethod.GPS);

    expect(simpleArray[1]).toHaveProperty('latitude', 48.123);
    expect(simpleArray[1]).toHaveProperty('longitude', 14.456);
    expect(simpleArray[1]).toHaveProperty('altitude', undefined);
    expect(simpleArray[1]).toHaveProperty('radius', 24);
    expect(simpleArray[1]).toHaveProperty('method', LocationMethod.GPS);
  });
});
