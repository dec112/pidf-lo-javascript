import fs from 'fs';
import path from 'path';

import { PidfLo, Device } from '../..';


describe('PidfLo Invalid Document', () => {
  const partiallyInvalid = [
    'invalid-part-1.xml',
    'invalid-part-2.xml',
  ]

  it.each(partiallyInvalid)('gracefully parses partially invalid document %s', (filename: string) => {
    const invalidCircle = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
    const parsed = PidfLo.fromXML(invalidCircle);

    if (!parsed)
      throw 'Could not parse circle';

    const { simple } = parsed;

    // should not be too forgiving if field contains bullshit
    expect(simple).toBeUndefined()

    expect(parsed.entity).toBe('pres:)(§+#*~');

    expect(parsed.locationTypes[0]).toBeInstanceOf(Device);
    expect(parsed.locationTypes[0].retransmissionAllowed).toBe(false);
    expect(parsed.locationTypes[0].timestamp).toBeUndefined();

    expect(parsed.locationTypes[0].locations[0]).toBeUndefined();
  });

  const completelyInvalid = [
    'invalid-full-1.xml',
    'invalid-full-2.xml',
  ];

  it.each(completelyInvalid)('does not parse fully invalid document %s', (filename: string) => {
    const invalidCircle = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
    const parsed = PidfLo.fromXML(invalidCircle);

    if (parsed)
      expect(parsed.simple).toBeUndefined();
    else
      expect(parsed).toBeUndefined();
  });
});
