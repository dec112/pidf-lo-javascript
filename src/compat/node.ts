import { CompatImpl } from '.';
import {
  getElementsByLocalName,
  toXMLString,
} from './common';
import {
  DOMImplementation,
  XMLSerializer,
  DOMParser,
} from '@xmldom/xmldom';

/**
 * Get a node-compatible XML CompatImpl (using @xmldom/xmldom)
 * @xmldom/xmldom must be installed as direct dependency!
 */
export const getNodeImpl = (): CompatImpl => {
  const domImplementation = new DOMImplementation();
  const xmlSerializer = new XMLSerializer();
  const domParser = new DOMParser();

  return {
    createDocument: domImplementation.createDocument,
    getElementsByLocalName,
    instanceOfElement: (obj) =>
      // TODO: That's currently a limitation of xmldom as it does not expose level 2 DOM interfaces
      // see https://github.com/xmldom/xmldom/pull/41 for more info
      // this will be fixed in xmldom version 1.0
      !!(obj.nodeName && obj.localName),
    parseFromString: (string: string, type: DOMParserSupportedType) => domParser.parseFromString(string, type),
    toXMLString: (document: Document) => toXMLString(xmlSerializer, document),
  };
}