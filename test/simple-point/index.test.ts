import fs from 'fs';
import path from 'path';

import { LocationMethod, PidfLo, Point, Tuple, XMLCompat } from '../../dist/node';

const validPoint = fs.readFileSync(path.join(__dirname, 'valid-point.xml'), 'utf-8');

describe('PidfLo SimpleLocation Point', () => {

  it('generates valid xml for point', () => {
    const pidf = PidfLo.fromSimpleLocation({
      latitude: 12.345,
      longitude: 67.890,
      altitude: 36.7,
      method: LocationMethod.Cell,
    }, 'domain.com');

    if (!pidf)
      throw 'Could not generate point';

    pidf.locationTypes[0].retransmissionAllowed = true;
    const xml = XMLCompat.toXMLString(pidf.toXML());

    expect(xml).toEqual(validPoint);
  });

  it('parses valid xml point', () => {
    const parsed = PidfLo.fromXML(validPoint);

    if (!parsed)
      throw 'Could not parse point';

    const { simple } = parsed;

    expect(simple).toHaveProperty('latitude', 12.345);
    expect(simple).toHaveProperty('longitude', 67.89);
    expect(simple).toHaveProperty('altitude', 36.7);
    expect(simple).not.toHaveProperty('radius');
    expect(simple).toHaveProperty('method', LocationMethod.Cell);

    expect(parsed.entity).toBe('pres:domain.com');

    expect(parsed.locationTypes[0]).toBeInstanceOf(Tuple);
    expect(parsed.locationTypes[0].retransmissionAllowed).toBe(true);

    expect(parsed.locationTypes[0].locations[0]).toBeInstanceOf(Point);
  });
});
