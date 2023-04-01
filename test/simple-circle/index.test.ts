import fs from 'fs';
import path from 'path';

import { Circle, LocationMethod, PidfLo, Tuple, XMLCompat } from '../..';

const validCircle = fs.readFileSync(path.join(__dirname, 'valid-circle.xml'), 'utf-8');

describe('PidfLo SimpleLocation Circle', () => {
  it('generates valid xml for circle', () => {
    const pidf = PidfLo.fromSimpleLocation({
      latitude: 48.123,
      longitude: 14.456,
      radius: 24,
      method: LocationMethod.GPS,
    }, 'sip:user@domain.com');

    if (!pidf)
      throw 'Could not generate circle';

    const xml = XMLCompat.toXMLString(pidf.toXML());

    expect(xml).toEqual(validCircle);
  });

  it('parses valid xml circle', () => {
    const parsed = PidfLo.fromXML(validCircle);

    if (!parsed)
      throw 'Could not parse circle';

    const { simple } = parsed;

    expect(simple).toHaveProperty('latitude', 48.123);
    expect(simple).toHaveProperty('longitude', 14.456);
    expect(simple).toHaveProperty('radius', 24);
    expect(simple).toHaveProperty('method', LocationMethod.GPS);

    expect(parsed.entity).toBe('sip:user@domain.com');

    expect(parsed.locationTypes[0]).toBeInstanceOf(Tuple);
    expect(parsed.locationTypes[0].retransmissionAllowed).toBe(false);

    expect(parsed.locationTypes[0].locations[0]).toBeInstanceOf(Circle);
  });
});
