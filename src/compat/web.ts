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
    createDocument: (namespace, qualifiedName, doctype) =>
      document.implementation.createDocument(namespace, qualifiedName, doctype),
    getElementsByLocalName,
    instanceOfElement: (obj) =>
      obj instanceof Element,
    parseFromString: (string, type) =>
      domParser.parseFromString(string, type),
    toXMLString: (document) =>
      toXMLString(xmlSerializer, document),
  };
}