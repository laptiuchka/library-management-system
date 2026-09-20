import { User } from '../../models/User';

export class UserList {
  private container: HTMLDivElement;
  private users: User[] = [];
  private currentPage: number = 1;
  private itemsPerPage: number = 5;
  private onDelete: (id: string) => void;

  constructor(onDelete: (id: string) => void) {
    this.onDelete = onDelete;
    this.container = document.createElement('div');
    this.container.className = 'card shadow-sm p-4 mb-4';
  }

  public update(users: User[]): void {
    this.users = users;
    this.renderContent();
  }

  private renderContent(): void {
    this.container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-3';

    const title = document.createElement('h5');
    title.className = 'fw-bold m-0';
    title.textContent = 'Список Користувачів';

    header.appendChild(title);
    this.container.appendChild(header);

    if (this.users.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'text-muted my-3';
      emptyMsg.textContent = 'Користувачів поки що немає.';
      this.container.appendChild(emptyMsg);
      return;
    }

    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedItems = this.users.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );

    const listGroup = document.createElement('div');
    listGroup.className = 'list-group mb-3';

    paginatedItems.forEach((user) => {
      const item = document.createElement('div');
      item.className =
        'list-group-item d-flex justify-content-between align-items-center py-3';

      const info = document.createElement('span');
      info.textContent = `${user.id} ${user.name} (${user.email})`;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-outline-danger btn-sm';
      deleteBtn.textContent = 'Видалити';
      deleteBtn.onclick = () => this.onDelete(user.id);

      item.appendChild(info);
      item.appendChild(deleteBtn);
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
