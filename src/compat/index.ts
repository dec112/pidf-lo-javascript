export interface CompatImpl {
  createDocument(namespace: string | null, qualifiedName: string | null, doctype?: DocumentType | null): XMLDocument;
  getElementsByLocalName: (element: Element, localName: string, result: Element[]) => Element[];
  instanceOfElement: (obj: any) => boolean;
  parseFromString(string: string, type: DOMParserSupportedType): Document;
  toXMLString: (document: Document) => string;
}

let compatObject: CompatImpl | undefined = undefined;
const getCompatObject = (): CompatImpl => {
  if (!compatObject)
    throw new Error('Initialize XMLCompat before using pidf-lo!');

  return compatObject;
}

export const initialize = (impl: CompatImpl) => compatObject = impl;

export const createDocument = (): Document =>
  getCompatObject().createDocument('', '', null);
export const getElementsByLocalName = (element: Element, localName: string, result: Element[] = []) =>
  getCompatObject().getElementsByLocalName(element, localName, result);
export const instanceOfElement = (obj: any): boolean =>
  getCompatObject().instanceOfElement(obj);
export const getDocumentFromString = (value: string): Document =>
  getCompatObject().parseFromString(value, 'text/xml');
export const toXMLString = (document: Document): string =>
  getCompatObject().toXMLString(document);

export const XMLCompat = {
  /**
   * Initialize XMLCompat with a custom compat object
   */
  initialize,

  createDocument,
  getElementsByLocalName,
  instanceOfElement,
  getDocumentFromString,
  toXMLString,
};

export * from './node';
export * from './web';