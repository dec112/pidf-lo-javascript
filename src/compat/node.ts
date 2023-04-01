import { initialize as init } from "."

export const initialize = () => {
  const {
    DOMImplementation,
    XMLSerializer,
    DOMParser,
  } = require('@xmldom/xmldom');

  init({
    domImplementation: new DOMImplementation(),
    xmlSerializer: new XMLSerializer(),
    domParser: new DOMParser(),
    instanceOfElement: (obj) =>
      // TODO: That's currently a limitation of xmldom as it does not expose level 2 DOM interfaces
      // see https://github.com/xmldom/xmldom/pull/41 for more info
      // this will be fixed in xmldom version 1.0
      !!(obj.nodeName && obj.localName),
  });
}