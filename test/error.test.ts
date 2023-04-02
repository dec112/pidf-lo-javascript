import { LocationMethod, PidfLo, XMLCompat } from "..";

describe('Error behaviour', () => {
  it('should throw an error if module was not initialized correctly', () => {
    // the module needs to be initialized like this
    // XMLCompat.initialize(getNodeImpl());
    // however, for this test we just want it to fail
    // therefore we just set it to undefined
    // @ts-expect-error typescript rightfully complains about this
    XMLCompat.initialize(undefined);

    const pidf = PidfLo.fromSimpleLocation({
      latitude: 78.90,
      longitude: 12.54,
      radius: 10,
      method: LocationMethod.GPS,
    });

    expect(() => pidf?.toXMLString()).toThrowError();
  });
});