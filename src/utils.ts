export type OmitStrict<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export const getPrefixedXmlTag = (tag: string, namespacePrefix?: string) => {
  return namespacePrefix ? `${namespacePrefix}:${tag}` : tag;
}