import { isBrowser } from './compatibility';
import { isDevelopment } from './environment';

let domImplementation: DOMImplementation;
let xmlSerializer: XMLSerializer;
let domParser: DOMParser;

if (isBrowser) {
  domImplementation = document.implementation;
  xmlSerializer = new XMLSerializer();
  domParser = new DOMParser();
}
else {
  const {
    DOMImplementation,
    XMLSerializer,
    DOMParser,
  } = require('xmldom');

  domImplementation = new DOMImplementation();
  xmlSerializer = new XMLSerializer();
  domParser = new DOMParser();
}

// TODO: CREDITS REQUIRED! gracefully stolen from https://gist.github.com/sente/1083506/d2834134cd070dbcc08bf42ee27dabb746a1c54d
const formatXML = (xml: string) => {
  const PADDING = ' '.repeat(2); // set desired indent size here
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;

  xml = xml.replace(reg, '$1\r\n$2$3');

  return xml.split('\r\n').map((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/) && pad > 0) {
      pad -= 1;
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    pad += indent;

    return PADDING.repeat(pad - indent) + node;
  }).join('\r\n');
}

export const createDocument = (): Document => domImplementation.createDocument('', '', null);
export const toXMLString = (document: Document): string => {
  let xmlString = xmlSerializer.serializeToString(document);

  if (isDevelopment)
    // format strings in dev environments for easier debugging
    xmlString = formatXML(xmlString);

  return addXMLProlog(xmlString);
};
export const getDocumentFromString = (value: string): Document => domParser.parseFromString(value, 'text/xml');
export const instanceOfElement = (obj: any): boolean => {
  if (isBrowser)
    return obj instanceof Element;
  else
    // TODO: That's currently a limitation of xmldom as it does not expose level 2 DOM interfaces
    // see https://github.com/xmldom/xmldom/pull/41 for more info
    // this will be fixed in xmldom version 1.0
    return !!(obj.nodeName && obj.localName);
}
export const getElementsByLocalName = (element: Element, localName: string, result: Element[] = []) => {
  if (element.hasChildNodes()) {
    for (const unsafeChild of Array.from(element.childNodes)) {
      let child: Element;

      if (instanceOfElement(unsafeChild))
        child = unsafeChild as Element;
      else
        continue;

      if (child.localName === localName)
        result.push(child);

      getElementsByLocalName(child, localName, result);
    }
  }

  return result;
}

const addXMLProlog = (xmlDocument: string) => `<?xml version="1.0" encoding="UTF-8"?>\r\n${xmlDocument}`;

export const XMLCompat = {
  createDocument,
  getDocumentFromString,
  getElementsByLocalName,
  instanceOfElement,
  toXMLString,
};