import fs from 'fs';
import path from 'path';

import { LocationMethod, PidfLo, XMLCompat, Civic, Tuple } from '../../dist/node';

const validCivicAddress = fs.readFileSync(path.join(__dirname, 'valid-civic-address.xml'), 'utf-8');

describe('PidfLo SimpleLocation Civic', () => {

  it('generates valid xml for civic address', () => {
    const pidf = PidfLo.fromSimpleLocation({
      civic: {
        country: 'AT',
        A1: 'Upper Austria',
        A4: 'Schärding',
        FLR: '5',
        PC: '4780',
        NAM: 'Hospital',
      },
      method: LocationMethod['AP-802.11'],
    }, 'lkh-schaerding.at');

    if (!pidf)
      throw 'Could not generate civic address';

    const xml = XMLCompat.toXMLString(pidf.toXML());

    expect(xml).toEqual(validCivicAddress);
  });

  it('parses valid xml civic address', () => {
    const parsed = PidfLo.fromXML(validCivicAddress);

    if (!parsed)
      throw 'Could not parse civic address';

    const simple = parsed.simple;

    if (!simple)
      throw 'No simple object';

    expect(simple).toHaveProperty('method', LocationMethod['AP-802.11']);

    const { civic } = simple;

    if (!civic)
      throw 'No civic object';

    expect(civic).toHaveProperty('country', 'AT');
    expect(civic).toHaveProperty('A1', 'Upper Austria');
    expect(civic).toHaveProperty('A2', undefined);
    expect(civic).toHaveProperty('A4', 'Schärding');
    expect(civic).toHaveProperty('FLR', '5');
    expect(civic).toHaveProperty('PC', '4780');
    expect(civic).toHaveProperty('NAM', 'Hospital');

    expect(parsed.entity).toBe('pres:lkh-schaerding.at');

    expect(parsed.locationTypes[0]).toBeInstanceOf(Tuple);
    expect(parsed.locationTypes[0].retransmissionAllowed).toBe(false);

    expect(parsed.locationTypes[0].locations[0]).toBeInstanceOf(Civic);
  });
});
