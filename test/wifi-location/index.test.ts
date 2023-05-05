import fs from 'fs';
import path from 'path';

import { Circle, Device, PidfLo } from '../..';

const loc = fs.readFileSync(path.join(__dirname, 'location.xml'), 'utf-8');

describe('PidfLo Location Wifi GPS', () => {
  it('parses xml', () => {
    const parsed = PidfLo.fromXML(loc);

    if (!parsed)
      throw 'Could not parse location';

    const { simple } = parsed;

    expect(simple).toHaveProperty('latitude', 48.197457);
    expect(simple).toHaveProperty('longitude', 14.482596);
    expect(simple).toHaveProperty('radius', 270);
    expect(simple).toHaveProperty('method', '');

    expect(parsed.entity).toBe('sip:+43123456789@ims.mno.at');

    expect(parsed.locationTypes[0]).toBeInstanceOf(Device)
    expect(parsed.locationTypes[0].locations[0]).toBeInstanceOf(Circle);
  });
});
