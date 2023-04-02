import { CompatImpl } from '.';
import {
  getElementsByLocalName,
  toXMLString,
} from './common';

/**
 * Get a web-compatible XML CompatImpl
 */
export const getWebImpl = (): CompatImpl => {
  const domParser = new DOMParser();
  const xmlSerializer = new XMLSerializer();

  return {
    createDocument: document.implementation.createDocument,
    getElementsByLocalName,
    instanceOfElement: (obj) => obj instanceof Element,
    parseFromString: (string: string, type: DOMParserSupportedType) => domParser.parseFromString(string, type),
    toXMLString: (document: Document) => toXMLString(xmlSerializer, document),
  };
}