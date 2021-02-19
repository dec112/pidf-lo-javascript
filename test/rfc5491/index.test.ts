import fs from 'fs';
import path from 'path';

import { Device, PidfLo, Point, XMLCompat } from '../../dist/node';

const validCircle = fs.readFileSync(path.join(__dirname, 'point-example.xml'), 'utf-8');

describe('PidfLo rfc5491 examples', () => {
  it('generates valid xml for point', () => {
    const pidf = new PidfLo('point2d@example.com');
    const device = new Device('point2d');
    device.timestamp = new Date('2007-06-22T20:57:29Z');

    pidf.locationTypes.push(device);

    const point = new Point(
      -34.407,
      150.883,
      //@ts-expect-error
      'Wiremap',
    );
    device.locations.push(point);

    const xml = XMLCompat.toXMLString(pidf.toXML());

    expect(xml).toEqual(validCircle);
  });

  it('parses valid xml for point', () => {
    const parsed = PidfLo.fromXML(validCircle);

    if (!parsed)
      throw 'Could not parse point';

    const simple = parsed.simple;

    expect(simple).toHaveProperty('latitude', -34.407);
    expect(simple).toHaveProperty('longitude', 150.883);
    expect(simple).toHaveProperty('timestamp', new Date('2007-06-22T20:57:29Z'));
    expect(simple).not.toHaveProperty('radius');
    expect(simple).toHaveProperty('method', 'Wiremap');

    expect(parsed.entity).toBe('pres:point2d@example.com');

    expect(parsed.locationTypes[0]).toBeInstanceOf(Device);
    expect(parsed.locationTypes[0].retransmissionAllowed).toBe(false);

    expect(parsed.locationTypes[0].locations[0]).toBeInstanceOf(Point);
  });
});
