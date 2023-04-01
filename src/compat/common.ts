export let compatObj: {
  domImplementation: DOMImplementation;
  xmlSerializer: XMLSerializer;
  domParser: DOMParser;
  instanceOfElement: (obj: any) => boolean;
}

export const initialize = (impl: typeof compatObj) => compatObj = impl;