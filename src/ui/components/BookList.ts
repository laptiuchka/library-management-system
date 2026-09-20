import { Book } from '../../models/Book';

export class BookList {
  private container: HTMLDivElement;
  private books: Book[] = [];
  private searchQuery: string = '';
  private currentPage: number = 1;
  private itemsPerPage: number = 5;

  private onBorrow: (book: Book) => void;
  private onReturn: (book: Book) => void;
  private onDelete: (id: string) => void;

  constructor(
    onBorrow: (book: Book) => void,
    onReturn: (book: Book) => void,
    onDelete: (id: string) => void
  ) {
    this.onBorrow = onBorrow;
    this.onReturn = onReturn;
    this.onDelete = onDelete;

    this.container = document.createElement('div');
    this.container.className = 'card shadow-sm p-4 mb-4';
  }

  public update(books: Book[]): void {
    this.books = books;
    this.renderContent();
  }

  private renderContent(): void {
    this.container.innerHTML = '';

    const header = document.createElement('div');
    header.className =
      'd-flex flex-wrap justify-content-between align-items-center mb-3 gap-2';

    const title = document.createElement('h5');
    title.className = 'fw-bold m-0';
    title.textContent = 'Список Книг';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Пошук за назвою або автором...';
    searchInput.className = 'form-control w-auto';
    searchInput.value = this.searchQuery;
    searchInput.oninput = (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.currentPage = 1; // повертаємось на першу сторінку при пошуку
      this.renderContent();
    };

    header.appendChild(title);
    header.appendChild(searchInput);
    this.container.appendChild(header);

    const filtered = this.books.filter(
      (b) =>
        b.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'text-muted my-3';
      emptyMsg.textContent = 'Книг не знайдено.';
      this.container.appendChild(emptyMsg);
      return;
    }

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedItems = filtered.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );

    const listGroup = document.createElement('div');
    listGroup.className = 'list-group mb-3';

    paginatedItems.forEach((book) => {
      const item = document.createElement('div');
      item.className =
        'list-group-item d-flex justify-content-between align-items-center py-3';

      const info = document.createElement('span');
      info.textContent = `${book.title} by ${book.author} (${book.year})`;

      const btnGroup = document.createElement('div');
      btnGroup.className = 'd-flex gap-2';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-outline-danger btn-sm';
      deleteBtn.textContent = 'Видалити';
      deleteBtn.onclick = () => this.onDelete(book.id);

      const actionBtn = document.createElement('button');
      if (book.isBorrowed) {
        actionBtn.className = 'btn btn-warning btn-sm text-dark';
        actionBtn.textContent = 'Повернути';
        actionBtn.onclick = () => this.onReturn(book);
      } else {
        actionBtn.className = 'btn btn-primary btn-sm';
        actionBtn.textContent = 'Позичити';
        actionBtn.onclick = () => this.onBorrow(book);
      }

      btnGroup.appendChild(actionBtn);
      btnGroup.appendChild(deleteBtn);

      item.appendChild(info);
      item.appendChild(btnGroup);
      listGroup.appendChild(item);
    });

    this.container.appendChild(listGroup);

    if (totalPages > 1) {
      const paginationNav = document.createElement('nav');
      const ul = document.createElement('ul');
      ul.className = 'pagination pagination-sm m-0 justify-content-center';

      for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === this.currentPage ? 'active' : ''}`;

        const a = document.createElement('button');
        a.className = 'page-link';
        a.textContent = i.toString();
        a.onclick = () => {
          this.currentPage = i;
          this.renderContent();
        };

        li.appendChild(a);
        ul.appendChild(li);
      }
      paginationNav.appendChild(ul);
      this.container.appendChild(paginationNav);
    }
  }

  public render(): HTMLDivElement {
    return this.container;
  }
}
