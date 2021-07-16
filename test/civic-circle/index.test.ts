import fs from 'fs';
import path from 'path';

import { Circle, LocationMethod, PidfLo, Tuple, XMLCompat } from '../../dist/node';

const validCircle = fs.readFileSync(path.join(__dirname, 'location.xml'), 'utf-8');

describe('PidfLo mixed Austrian civic and circle', () => {
  it('generates valid xml', () => {
    const pidf = PidfLo.fromSimpleLocation({
      latitude: 48.123,
      longitude: 14.456,
      radius: 24,
      method: LocationMethod.GPS,
      civic: {
        country: 'AT',
        PC: '1120',
        A1: 'Wien',
        A4: 'Meidling',
        RD: 'Fockygasse',
        HNO: '51A',
      }
    }, 'sip:user@domain.com');

    if (!pidf)
      throw 'Could not generate location';

    const xml = XMLCompat.toXMLString(pidf.toXML());

    expect(xml).toEqual(validCircle);
  });

  it('parses valid xml', () => {
    const parsed = PidfLo.fromXML(validCircle);

    if (!parsed)
      throw 'Could not parse circle';

    const { simple } = parsed;

    expect(simple).toHaveProperty('latitude', 48.123);
    expect(simple).toHaveProperty('longitude', 14.456);
    expect(simple).toHaveProperty('radius', 24);
    expect(simple).toHaveProperty('method', LocationMethod.GPS);

    if (!simple || !simple.civic)
      throw 'No civic object';

    const { civic } = simple;

    expect(civic).toHaveProperty('country', 'AT');
    expect(civic).toHaveProperty('PC', '1120');
    expect(civic).toHaveProperty('A1', 'Wien');
    expect(civic).toHaveProperty('A4', 'Meidling');
    expect(civic).toHaveProperty('RD', 'Fockygasse');
    expect(civic).toHaveProperty('HNO', '51A');

    expect(parsed.entity).toBe('sip:user@domain.com');

    expect(parsed.locationTypes[0]).toBeInstanceOf(Tuple);
    expect(parsed.locationTypes[0].retransmissionAllowed).toBe(false);

    expect(parsed.locationTypes[0].locations[0]).toBeInstanceOf(Circle);
  });
});
