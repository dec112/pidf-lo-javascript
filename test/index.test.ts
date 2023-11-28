import { Circle, Device, LocationMethod, PidfLo, Point } from '../dist/node';

describe('basic PIDF-LO tests', () => {
  it('handles equality correctly', () => {
    const getPidf = (lat: number = -34.407, alt: number = 20.7) => {
      const pidf = new PidfLo('point2d@example.com');
      const device = new Device('point2d');
      device.timestamp = new Date('2007-06-22T20:57:29Z');

      pidf.locationTypes.push(device);

      device.locations.push(new Point(
        lat,
        150.883,
        LocationMethod['AP-802.11'],
        alt,
      ));

      return pidf;
    }

    const defaultPidf = getPidf();
    const clone = getPidf();

    expect(defaultPidf.equals(clone)).toBe(true);

    const wrongClone1 = getPidf(48.123);
    const wrongClone2 = getPidf(undefined, 40.1);

    expect(defaultPidf.equals(wrongClone1)).toBe(false);
    expect(defaultPidf.equals(wrongClone2)).toBe(false);
  });

  it('does not generate PIDF from invalid simple location', () => {
    const pidf = PidfLo.fromSimpleLocation({
      latitude: undefined,
      longitude: 12.546,
      radius: 10,
      method: LocationMethod.GPS,
    });

    expect(pidf).toBe(undefined);
  });

  it('replaces circles with a point in the case that a radius is below 1 meter', () => {
    const pidfValid = PidfLo.fromSimpleLocation({
      latitude: 48.123,
      longitude: 14.456,
      radius: 1,
      method: LocationMethod.GPS,
    }, 'sip:user@domain.com');
    expect(pidfValid?.locationTypes[0].locations[0]).toBeInstanceOf(Circle);

    const pidfInvalid = PidfLo.fromSimpleLocation({
      latitude: 48.123,
      longitude: 14.456,
      radius: 0.5,
      method: LocationMethod.GPS,
    }, 'sip:user@domain.com');
    expect(pidfInvalid?.locationTypes[0].locations[0]).toBeInstanceOf(Point);
  });
})