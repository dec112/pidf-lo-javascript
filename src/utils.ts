export const getPrefixedXmlTag = (tag: string, namespacePrefix?: string) => {
  return namespacePrefix ? `${namespacePrefix}:${tag}` : tag;
}