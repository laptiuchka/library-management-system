import './styles/main.scss';
import { Book } from './models/Book';
import { User } from './models/User';
import { Library } from './services/Library';
import { Storage } from './services/Storage';
import { BookForm } from './ui/components/BookForm';
import { UserForm } from './ui/components/UserForm';
import { BookList } from './ui/components/BookList';
import { UserList } from './ui/components/UserList';
import { Modal } from './ui/components/Modal';

const initialBooksData: Book[] = [
  new Book('1', 'The Love Hypothesis', 'Ali Hazelwood', 2023),
  new Book('2', 'Clean Code', 'Роберт Мартін', 2008),
  new Book('3', 'Хранителі смерті', 'Тесс Ґеррітсен', 2021),
];

const initialUsersData: User[] = [
  new User('1725533394038', 'Тетяна', 'laptiuk.tetiana@gmail.com', 0),
  new User('1725533437798', 'Андрій', 'andriimaks@gmail.com', 0),
];

const savedBooks = Storage.get<Book[]>('library_books', initialBooksData).map(
  (b) =>
    new Book(b.id, b.title, b.author, b.year, b.isBorrowed, b.borrowedByUserId)
);
const savedUsers = Storage.get<User[]>('library_users', initialUsersData).map(
  (u) => new User(u.id, u.name, u.email, u.borrowedBooksCount)
);

const bookLibrary = new Library<Book>(savedBooks);
const userLibrary = new Library<User>(savedUsers);

function syncStorage(): void {
  Storage.set('library_books', bookLibrary.getAll());
  Storage.set('library_users', userLibrary.getAll());
}

const appContainer = document.getElementById('app');

if (appContainer) {
  appContainer.innerHTML = '';

  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'container py-4';
  mainWrapper.style.maxWidth = '900px';

  const headerTitle = document.createElement('h3');
  headerTitle.className = 'text-center fw-bold mb-4';
  headerTitle.textContent = 'Система управління бібліотекою';
  mainWrapper.appendChild(headerTitle);

  let bookListComponent: BookList;
  let userListComponent: UserList;

  const handleBorrowBook = (book: Book) => {
    Modal.showPrompt(
      'Введіть ID користувача для позичення книги:',
      'ID',
      (userId: string) => {
        const user = userLibrary.findById(userId);
        if (!user) {
          Modal.showAlert('Користувача з таким ID не знайдено!', 'Закрити');
          return;
        }

        if (user.borrowedBooksCount >= 3) {
          Modal.showAlert(
            'Користувач не може позичити більше 3-х книг!',
            'Закрити'
          );
          return;
        }

        book.borrow(user.id);
        user.borrowedBooksCount += 1;
        syncStorage();

        bookListComponent.update(bookLibrary.getAll());
        userListComponent.update(userLibrary.getAll());

        Modal.showAlert(
          `${book.title} by ${book.author} (${book.year}) has been borrowed by ${user.id} ${user.name} (${user.email}).`,
          'Зрозуміло!'
        );
      }
    );
  };

  const handleReturnBook = (book: Book) => {
    if (book.borrowedByUserId) {
      const user = userLibrary.findById(book.borrowedByUserId);
      if (user && user.borrowedBooksCount > 0) {
        user.borrowedBooksCount -= 1;
      }
    }

    book.returnBook();
    syncStorage();

    bookListComponent.update(bookLibrary.getAll());
    userListComponent.update(userLibrary.getAll());

    Modal.showAlert(
      `${book.title} by ${book.author} (${book.year}) has been returned.`,
      'Закрити'
    );
  };

  const handleDeleteBook = (id: string) => {
    bookLibrary.remove(id);
    syncStorage();
    bookListComponent.update(bookLibrary.getAll());
  };

  const handleDeleteUser = (id: string) => {
    userLibrary.remove(id);
    syncStorage();
    userListComponent.update(userLibrary.getAll());
  };

  const bookForm = new BookForm((newBook) => {
    bookLibrary.add(newBook);
    syncStorage();
    bookListComponent.update(bookLibrary.getAll());
  });

  const userForm = new UserForm((newUser) => {
    userLibrary.add(newUser);
    syncStorage();
    userListComponent.update(userLibrary.getAll());
  });

  bookListComponent = new BookList(
    handleBorrowBook,
    handleReturnBook,
    handleDeleteBook
  );
  userListComponent = new UserList(handleDeleteUser);

  bookListComponent.update(bookLibrary.getAll());
  userListComponent.update(userLibrary.getAll());

  mainWrapper.appendChild(bookForm.render());
  mainWrapper.appendChild(userForm.render());
  mainWrapper.appendChild(bookListComponent.render());
  mainWrapper.appendChild(userListComponent.render());

  appContainer.appendChild(mainWrapper);
}
