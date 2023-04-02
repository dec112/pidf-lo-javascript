export interface CompatImpl {
  createDocument(namespace: string | null, qualifiedName: string | null, doctype?: DocumentType | null): XMLDocument;
  getElementsByLocalName: (element: Element, localName: string, result: Element[]) => Element[];
  instanceOfElement: (obj: any) => boolean;
  parseFromString(string: string, type: DOMParserSupportedType): Document;
  toXMLString: (document: Document) => string;
}

let compatObject: CompatImpl;

export const initialize = (impl: typeof compatObject) => compatObject = impl;

export const createDocument = (): Document =>
  compatObject.createDocument('', '', null);
export const getElementsByLocalName = (element: Element, localName: string, result: Element[] = []) =>
  compatObject.getElementsByLocalName(element, localName, result);
export const instanceOfElement = (obj: any): boolean =>
  compatObject.instanceOfElement(obj);
export const getDocumentFromString = (value: string): Document =>
  compatObject.parseFromString(value, 'text/xml');
export const toXMLString = (document: Document): string =>
  compatObject.toXMLString(document);

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