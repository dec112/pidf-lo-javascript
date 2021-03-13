import { Device, LocationMethod, PidfLo, Point } from '../dist/node';

describe('basic PIDF-LO tests', () => {
  it('handles equality correctly', () => {
    const getPidf = (lat: number = -34.407) => {
      const pidf = new PidfLo('point2d@example.com');
      const device = new Device('point2d');
      device.timestamp = new Date('2007-06-22T20:57:29Z');

      pidf.locationTypes.push(device);

      device.locations.push(new Point(
        lat,
        150.883,
        LocationMethod['AP-802.11'],
      ));

      return pidf;
    }

    const defaultPidf = getPidf();
    const clone = getPidf();

    expect(defaultPidf.equals(clone)).toBe(true);

    const wrongClone = getPidf(48.123);

    expect(defaultPidf.equals(wrongClone)).toBe(false);
  });
})