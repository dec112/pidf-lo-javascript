# pidf-lo - PIDF-LO and GEOPRIV handling

This library should simplify handling PIDF-LO GEOPRIV documents as described in https://tools.ietf.org/html/rfc5491.

This README currently only describes simple usage of this library. More elaborate implementation examples will be added by time.

## Important Notices

This implemenentation only covers a small portion of the PIDF-LO specification documents and is (by far) not complete. Pull requests are therefore highly honored.

This library requires `@xmldom/xmldom` as a peer-dependency *only* in node.js environments!
JavaScript browser environments always have a DOM implementation on board, therefore `@xmldom/xmldom` is not needed there.

## Installation

Requires `node.js` and `npm`.

```bash
npm install pidf-lo
```

## Simplified Usage (WGS84 locations)

### PIDF-LO creation

```typescript
import { 
  LocationMethod, 
  PidfLo, 
  XMLCompat,

  getNodeImpl,
  getWebImpl,
} from 'pidf-lo';

// if xmldom interface is available (e.g. on web browsers)
XMLCompat.initialize(getNodeImpl());
// if xmldom interface is NOT available (e.g. on node environments)
// also don't forget to install required peer dependency @xmldom/xmldom
XMLCompat.initialize(getWebImpl());

const pidf = PidfLo.fromSimpleLocation({
  latitude: 48.123,
  longitude: 14.456,
  radius: 24,
  method: LocationMethod.GPS,
});

if (!pidf)
  throw 'Something is wrong with this location';

const xmlObj = pidf.toXML();
console.log(XMLCompat.toXMLString(xmlObj));
```

### PIDF-LO parsing

```typescript
import { 
  PidfLo, 
  XMLCompat,

  getNodeImpl,
  getWebImpl,
} from 'pidf-lo';

// if xmldom interface is available (e.g. on web browsers)
XMLCompat.initialize(getNodeImpl());
// if xmldom interface is NOT available (e.g. on node environments)
// also don't forget to install required peer dependency @xmldom/xmldom
XMLCompat.initialize(getWebImpl());

const parsed = PidfLo.fromXML('<xml...>');

if (!parsed || !parsed.simple)
  throw 'Something is wrong with this location';

const simpleLoc = parsed.simple;
console.log(`${simpleLoc.latitude} ${simpleLoc.longitude}`);
```

## Usage (Civic Addresses)
### PIDF-LO creation

```typescript
import { 
  LocationMethod, 
  PidfLo, 

  getNodeImpl,
  getWebImpl,
} from 'pidf-lo';

// if xmldom interface is available (e.g. on web browsers)
XMLCompat.initialize(getNodeImpl());
// if xmldom interface is NOT available (e.g. on node environments)
// also don't forget to install required peer dependency @xmldom/xmldom
XMLCompat.initialize(getWebImpl());

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
  throw 'Something is wrong with this location';

const xmlObj = pidf.toXML();
console.log(XMLCompat.toXMLString(xmlObj));
```
### PIDF-LO parsing

```typescript
import { 
  PidfLo,
  
  getNodeImpl,
  getWebImpl,
} from 'pidf-lo';

// if xmldom interface is available (e.g. on web browsers)
XMLCompat.initialize(getNodeImpl());
// if xmldom interface is NOT available (e.g. on node environments)
// also don't forget to install required peer dependency @xmldom/xmldom
XMLCompat.initialize(getWebImpl());

const parsed = PidfLo.fromXML('<xml...>');

if (!parsed || !parsed.simple || !parsed.simple.civic)
  throw 'Something is wrong with this location';

const simpleCivic = parsed.simple.civic;
console.log(`${simpleCivic.country} ${simpleCivic.A1}`);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
Distributed under the MIT License. See LICENSE for more information.