import * as Model from './interfaces';
import { XMLCompat } from './xml';

const PRESENTITY_PROTOCOL = 'pres:';

abstract class Location {
  constructor(
    public method: Model.LocationMethod | string,
  ) { }

  abstract toXML(document: XMLDocument, rootNode: Element): Element;
}

export class Civic extends Location {
  public static nodeName: string = 'civicAddress';
  protected nodeName: string = Civic.nodeName;

  constructor(
    public address: Model.CivicAddress,
    public method: Model.LocationMethod | string,
  ) {
    super(method);
  }

  private static getValueIfAvailable = (node: Element, localName: string): string | undefined => {
    const matches = XMLCompat.getElementsByLocalName(node, localName);

    if (matches.length > 0) {
      return matches[0].textContent || undefined;
    }

    return undefined;
  }

  private static addElementIfNotUndefined = (doc: XMLDocument, parent: Element, namespacePrefix: string, localName: string, value: string | undefined): void => {
    if (!value)
      return;

    const node = doc.createElement(`${namespacePrefix}:${localName}`);
    node.textContent = value;

    parent.appendChild(node);
  }

  static fromXML = (node: Element, method: Model.LocationMethod | string): Civic | undefined => {
    const addr: Model.CivicAddress = {
      A1: Civic.getValueIfAvailable(node, 'A1'),
      A2: Civic.getValueIfAvailable(node, 'A2'),
      A3: Civic.getValueIfAvailable(node, 'A3'),
      A4: Civic.getValueIfAvailable(node, 'A4'),
      A5: Civic.getValueIfAvailable(node, 'A5'),
      A6: Civic.getValueIfAvailable(node, 'A6'),
      FLR: Civic.getValueIfAvailable(node, 'FLR'),
      HNO: Civic.getValueIfAvailable(node, 'HNO'),
      HNS: Civic.getValueIfAvailable(node, 'HNS'),
      LMK: Civic.getValueIfAvailable(node, 'LMK'),
      LOC: Civic.getValueIfAvailable(node, 'LOC'),
      NAM: Civic.getValueIfAvailable(node, 'NAM'),
      PC: Civic.getValueIfAvailable(node, 'PC'),
      POD: Civic.getValueIfAvailable(node, 'POD'),
      PRD: Civic.getValueIfAvailable(node, 'PRD'),
      STS: Civic.getValueIfAvailable(node, 'STS'),
      country: Civic.getValueIfAvailable(node, 'country'),
    };

    return new Civic(addr, method);
  }

  toXML(doc: XMLDocument, rootNode: Element): Element {
    const prefix = 'cl';
    rootNode.setAttribute(`xmlns:${prefix}`, 'urn:ietf:params:xml:ns:pidf:geopriv10:civicLoc');

    const root = doc.createElement(`${prefix}:${this.nodeName}`);

    const adr = this.address;

    Civic.addElementIfNotUndefined(doc, root, prefix, 'A1', adr.A1);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'A2', adr.A2);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'A3', adr.A3);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'A4', adr.A4);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'A5', adr.A5);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'A6', adr.A6);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'FLR', adr.FLR);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'HNO', adr.HNO);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'HNS', adr.HNS);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'LMK', adr.LMK);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'LOC', adr.LOC);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'NAM', adr.NAM);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'PC', adr.PC);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'POD', adr.POD);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'PRD', adr.PRD);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'STS', adr.STS);
    Civic.addElementIfNotUndefined(doc, root, prefix, 'country', adr.country);

    return root;
  }
}

export class Point extends Location {
  public static nodeName: string = 'Point';

  public readonly srsName: string = 'urn:ogc:def:crs:EPSG::4326';

  constructor(
    public latitude: number,
    public longitude: number,
    public method: Model.LocationMethod | string,
  ) {
    super(method);
  }

  static fromXML = (node: Element, method: Model.LocationMethod | string): Point | undefined => {
    try {
      const pos = XMLCompat.getElementsByLocalName(node, 'pos')[0];
      const posSplit = pos?.textContent?.split(' ');

      if (!posSplit)
        return;

      const lat = posSplit[0];
      const lon = posSplit[1];

      if (lat && lon) {
        return new Point(
          parseFloat(lat),
          parseFloat(lon),
          method,
        );
      }
    }
    catch { /* */ }

    return;
  }

  protected _getPosElement(doc: XMLDocument, rootNode: Element): Element {
    rootNode.setAttribute('xmlns:gml', 'http://www.opengis.net/gml');

    const pos = doc.createElement(`gml:pos`);
    pos.textContent = `${this.latitude} ${this.longitude}`;

    return pos;
  }

  toXML(doc: XMLDocument, rootNode: Element): Element {
    rootNode.setAttribute('xmlns:gml', 'http://www.opengis.net/gml');

    const root = doc.createElement(`gml:${Point.nodeName}`);
    root.setAttribute('srsName', this.srsName);

    root.appendChild(this._getPosElement(doc, rootNode));

    return root;
  }
}

export class Circle extends Point {
  public static nodeName: string = 'Circle';

  constructor(
    public latitude: number,
    public longitude: number,
    public radius: number,
    public method: Model.LocationMethod | string,
  ) {
    super(latitude, longitude, method);
  }

  static fromXML = (node: Element, method: Model.LocationMethod | string): Circle | undefined => {
    try {
      const point = Point.fromXML(node, method);

      const radiusEl = XMLCompat.getElementsByLocalName(node, 'radius')[0];
      const rad = radiusEl?.textContent;

      if (point && rad) {
        return new Circle(
          point.latitude,
          point.longitude,
          parseFloat(rad),
          method,
        );
      }
    }
    catch { /* */ }

    return;
  }

  toXML(doc: XMLDocument, rootNode: Element): Element {
    // TODO: centralize this somehow...
    // I don't want to have those strings everywhere in the code
    rootNode.setAttribute('xmlns:gs', 'http://www.opengis.net/pidflo/1.0');
    rootNode.setAttribute('xmlns:gml', 'http://www.opengis.net/gml');

    const root = doc.createElement(`gs:${Circle.nodeName}`);
    root.setAttribute('srsName', this.srsName);

    root.appendChild(this._getPosElement(doc, rootNode));

    const radius = doc.createElement('gs:radius');
    radius.setAttribute('uom', 'urn:ogc:def:uom:EPSG::9001');
    radius.textContent = `${this.radius}`;
    root.appendChild(radius);

    return root;
  }
}

abstract class LocationType {
  public locations: Location[] = [];

  constructor(
    public id?: string,
    public timestamp?: Date,
    public retransmissionAllowed: boolean = false,
  ) { }

  abstract getName(): string;

  fromXML = (xml: Element): LocationType => {
    this.id = xml.getAttribute('id') || undefined

    // TODO: is an empty string allowed?
    const method = XMLCompat.getElementsByLocalName(xml, 'method')[0]?.textContent || '';
    const locInfoElements = XMLCompat.getElementsByLocalName(xml, 'location-info');

    if (locInfoElements.length > 0) {
      for (const unsafeLocationNode of Array.from(locInfoElements[0].childNodes)) {
        let locationNode: Element;

        // TODO: safer type checks
        if (XMLCompat.instanceOfElement(unsafeLocationNode))
          locationNode = unsafeLocationNode as Element;
        else
          continue;

        let location: Location | undefined;

        switch (locationNode.localName) {
          case Circle.nodeName:
            location = Circle.fromXML(locationNode, method);
            break;
          case Point.nodeName:
            location = Point.fromXML(locationNode, method);
            break;
          case Civic.nodeName:
            location = Civic.fromXML(locationNode, method);
            break;
        }

        if (location)
          this.locations.push(location);
      }
    }


    const retransmissionAllowedElements = XMLCompat.getElementsByLocalName(xml, 'retransmission-allowed');
    if (retransmissionAllowedElements.length > 0) {
      this.retransmissionAllowed = retransmissionAllowedElements[0].textContent === 'yes';
    }

    const timestampElements = XMLCompat.getElementsByLocalName(xml, 'timestamp');
    if (timestampElements.length > 0) {
      const value = timestampElements[0].textContent;

      if (value !== null)
        this.timestamp = new Date(value);
    }

    return this;
  };

  toXML = (doc: Document, root: Element): Element => {
    root.setAttribute('xmlns:gp', 'urn:ietf:params:xml:ns:pidf:geopriv10');
    root.setAttribute('xmlns:dm', 'urn:ietf:params:xml:ns:pidf:data-model');

    const locTypeNode = doc.createElement(`dm:${this.getName()}`);
    locTypeNode.setAttribute('id', this.id || '');

    if (this.timestamp) {
      const timestampNode = doc.createElement('dm:timestamp');
      timestampNode.textContent = this.timestamp.toISOString();
      locTypeNode.appendChild(timestampNode);
    }

    const statusNode = doc.createElement('status');
    locTypeNode.appendChild(statusNode);

    const geopriv = doc.createElement('gp:geopriv');
    statusNode.appendChild(geopriv);

    const usageRules = doc.createElement('gp:usage-rules');
    geopriv.appendChild(usageRules);

    const retransmissionAllowed = doc.createElement('gp:retransmission-allowed');
    retransmissionAllowed.textContent = this.retransmissionAllowed ? 'yes' : 'no';
    usageRules.appendChild(retransmissionAllowed);

    const method = doc.createElement('gp:method');
    // TODO: we just take the first available location's method
    // as per definition these two locations have to be derived by the same method
    // rfc5491: Rule #6
    method.textContent = this.locations[0].method;
    geopriv.appendChild(method);

    const locInfo = doc.createElement('gp:location-info');
    geopriv.appendChild(locInfo);

    for (const loc of this.locations) {
      locInfo.appendChild(loc.toXML(doc, root));
    }

    return locTypeNode;
  }
}

export class Device extends LocationType {
  static nodeName = 'device';
  getName = () => Device.nodeName;

  static fromXML = (xml: Element): Device => {
    const device = new Device();
    return device.fromXML(xml);
  }
}
export class Tuple extends LocationType {
  static nodeName = 'tuple';
  getName = () => Tuple.nodeName;

  static fromXML = (xml: Element): Tuple => {
    const tuple = new Tuple();
    return tuple.fromXML(xml);
  }
}
export class Person extends LocationType {
  static nodeName = 'person';
  getName = () => Person.nodeName;

  static fromXML = (xml: Element): Person => {
    const person = new Person();
    return person.fromXML(xml);
  }
}

export class PidfLo {
  public locationTypes: LocationType[] = [];

  constructor(
    private _entity?: string,
  ) {
    this.entity = _entity;
  }

  /**
   * https://tools.ietf.org/html/rfc4479#section-3.1
   */
  set entity(value: string | undefined) {
    let e = value;

    if (e) {
      try {
        const url = new URL(e);

        // if there is no protocol we add "pres:"
        if (!url.protocol)
          url.protocol = PRESENTITY_PROTOCOL;

        e = url.toString();
      }
      catch {
        // if it does not already start with "pres:"", we just add it
        // however, it still might not be fully correct
        if (e.indexOf(PRESENTITY_PROTOCOL) !== 0)
          e = `${PRESENTITY_PROTOCOL}${e}`;
      }
    }

    this._entity = e;
  }
  get entity(): string | undefined { return this._entity; }

  toXML = (): XMLDocument => {
    const doc = XMLCompat.createDocument();

    const root = doc.createElement('presence');
    root.setAttribute('xmlns', 'urn:ietf:params:xml:ns:pidf');
    if (this.entity) {
      root.setAttribute('entity', this.entity);
    }

    doc.appendChild(root);

    for (const locType of this.locationTypes) {
      root.appendChild(locType.toXML(doc, root));
    }

    return doc;
  }

  static fromXML = (xml: string): PidfLo | undefined => {
    const document = XMLCompat.getDocumentFromString(xml);

    // this should be the "presence" element
    const rootElement = document.documentElement;

    if (rootElement.localName !== 'presence')
      return;

    const pidf = new PidfLo(rootElement.getAttribute('entity') || undefined);

    for (const unsafeLocTypeNode of Array.from(rootElement.childNodes)) {
      let locTypeNode: Element;

      // TODO: safer type checks
      if (XMLCompat.instanceOfElement(unsafeLocTypeNode))
        locTypeNode = unsafeLocTypeNode as Element;
      else
        continue;

      let locType: LocationType;

      switch (locTypeNode.localName) {
        case Device.nodeName:
          locType = Device.fromXML(locTypeNode);
          break;
        case Person.nodeName:
          locType = Person.fromXML(locTypeNode);
          break;
        default:
          locType = Tuple.fromXML(locTypeNode);
      }

      pidf.locationTypes.push(locType);
    }

    if (pidf.locationTypes.length > 0)
      return pidf;

    return;
  }

  static fromSimpleLocation = (location: Model.SimpleLocation, originSipUri?: string): PidfLo | undefined => {
    const pidflo = new PidfLo(originSipUri);
    const locType = new Tuple('ue');
    locType.timestamp = location.timestamp;
    pidflo.locationTypes.push(locType);

    if (location.latitude && location.longitude && location.method) {
      const loc = location.radius ?
        new Circle(
          location.latitude,
          location.longitude,
          location.radius,
          location.method,
        ) :
        new Point(
          location.latitude,
          location.longitude,
          location.method,
        );

      locType.locations.push(loc);
    }

    if (location.civic && location.method) {
      locType.locations.push(
        new Civic(location.civic, location.method)
      );
    }

    if (locType.locations.length === 0)
      // obviously we were not able to create a location...
      return undefined;

    return pidflo;
  }

  /**
   * Retrieve a SimpleLocation object for easy interaction with PidfLo locations \
   * Keep in mind that this might not necessarily represent all information that's available in PidfLo!
   */
  get simple(): Model.SimpleLocation | undefined {
    if (this.locationTypes.length === 0)
      return;

    // tuple is the most important according to ETSI TS 103 698
    let lt = this.locationTypes.find(lt => lt instanceof Tuple);

    // if there is no tuple, we just take the first available
    if (!lt)
      lt = this.locationTypes[0];

    if (lt.locations.length === 0)
      return;

    let returnVal: Model.SimpleLocation = {
      timestamp: lt.timestamp,
    };

    // TODO: support more than circle and point and civic location
    for (const loc of lt.locations) {
      // both Circle and Point are compatible with our SimpleLocation interface
      if (loc instanceof Circle || loc instanceof Point)
        returnVal = {
          ...returnVal,
          ...loc,
        };
      else if (loc instanceof Civic)
        returnVal = {
          ...returnVal,
          method: loc.method,
          civic: loc.address,
        };
    }

    return returnVal;
  }

  equals = (pidfLo: PidfLo) => {
    try {
      return XMLCompat.toXMLString(this.toXML()) === XMLCompat.toXMLString(pidfLo.toXML());
    } catch {
      return false;
    }
  }
}