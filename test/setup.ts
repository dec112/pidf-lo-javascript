import { XMLCompat, getNodeImpl } from '..';

beforeAll(() => {
  XMLCompat.initialize(getNodeImpl());
});