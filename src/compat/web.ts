import { initialize as init } from "./common"

export const initialize = () => {
  init({
    domImplementation: document.implementation,
    xmlSerializer: new XMLSerializer(),
    domParser: new DOMParser(),
    instanceOfElement: (obj) => obj instanceof Element,
  });
}