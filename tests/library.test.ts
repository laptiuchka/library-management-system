import { expect } from 'chai';
import { Library } from '../src/services/Library';

interface TestItem {
  id: string;
  name: string;
}

describe('Library Generic Service', () => {
  let library: Library<TestItem>;

  beforeEach(() => {
    library = new Library<TestItem>([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ]);
  });

  it('повинен повертати всі елементи колекції', () => {
    const items = library.getAll();
    expect(items).to.have.lengthOf(2);
  });

  it('повинен додавати новий елемент до колекції', () => {
    library.add({ id: '3', name: 'Item 3' });
    const items = library.getAll();
    expect(items).to.have.lengthOf(3);
    expect(library.findById('3')?.name).to.equal('Item 3');
  });

  it('повинен знаходити елемент за його id', () => {
    const item = library.findById('1');
    expect(item).to.not.be.undefined;
    expect(item?.name).to.equal('Item 1');
  });

  it('повинен повертати undefined, якщо елемент за id не знайдено', () => {
    const item = library.findById('999');
    expect(item).to.be.undefined;
  });

  it('повинен успішно видаляти елемент за id', () => {
    const removed = library.remove('1');
    expect(removed).to.be.true;
    expect(library.getAll()).to.have.lengthOf(1);
    expect(library.findById('1')).to.be.undefined;
  });
});
