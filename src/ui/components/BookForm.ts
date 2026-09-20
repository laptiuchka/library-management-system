import { Book } from '../../models/Book';
import { Validation } from '../../utils/validators';

export class BookForm {
  private container: HTMLDivElement;
  private onBookAdd: (book: Book) => void;

  constructor(onBookAdd: (book: Book) => void) {
    this.onBookAdd = onBookAdd;
    this.container = document.createElement('div');
    this.init();
  }

  private init(): void {
    this.container.className = 'card shadow-sm p-4 mb-4';

    const titleEl = document.createElement('h5');
    titleEl.className = 'fw-bold mb-3';
    titleEl.textContent = 'Додати Книгу';
    this.container.appendChild(titleEl);

    const titleGroup = this.createInputGroup('Назва книги', 'text');
    const authorGroup = this.createInputGroup('Автор', 'text');
    const yearGroup = this.createInputGroup('Рік видання', 'text');

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-success mt-2 align-self-start px-4';
    submitBtn.textContent = 'Додати Книгу';

    submitBtn.onclick = () => {
      let isValid = true;

      const titleVal = titleGroup.input.value.trim();
      const authorVal = authorGroup.input.value.trim();
      const yearVal = yearGroup.input.value.trim();

      this.clearError(titleGroup);
      this.clearError(authorGroup);
      this.clearError(yearGroup);

      if (!Validation.isNotEmpty(titleVal)) {
        this.showError(titleGroup, 'Це поле є обов’язковим');
        isValid = false;
      }
      if (!Validation.isNotEmpty(authorVal)) {
        this.showError(authorGroup, 'Це поле є обов’язковим');
        isValid = false;
      }
      if (!Validation.isNotEmpty(yearVal)) {
        this.showError(yearGroup, 'Це поле є обов’язковим');
        isValid = false;
      } else if (!Validation.isValidYear(yearVal)) {
        this.showError(yearGroup, 'Введіть коректний рік видання (4 цифри)');
        isValid = false;
      }

      if (isValid) {
        const newBook = new Book(
          Date.now().toString(),
          titleVal,
          authorVal,
          parseInt(yearVal, 10)
        );
        this.onBookAdd(newBook);

        titleGroup.input.value = '';
        authorGroup.input.value = '';
        yearGroup.input.value = '';
      }
    };

    this.container.appendChild(titleGroup.wrapper);
    this.container.appendChild(authorGroup.wrapper);
    this.container.appendChild(yearGroup.wrapper);
    this.container.appendChild(submitBtn);
  }

  private createInputGroup(
    placeholder: string,
    type: string
  ): {
    wrapper: HTMLDivElement;
    input: HTMLInputElement;
    error: HTMLDivElement;
  } {
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-2';

    const input = document.createElement('input');
    input.type = type;
    input.className = 'form-control';
    input.placeholder = placeholder;

    const error = document.createElement('div');
    error.className = 'text-danger small mt-1 d-none';

    wrapper.appendChild(input);
    wrapper.appendChild(error);

    return { wrapper, input, error };
  }

  private showError(
    group: { input: HTMLInputElement; error: HTMLDivElement },
    msg: string
  ): void {
    group.error.textContent = msg;
    group.error.classList.remove('d-none');
    group.input.classList.add('is-invalid');
  }

  private clearError(group: {
    input: HTMLInputElement;
    error: HTMLDivElement;
  }): void {
    group.error.classList.add('d-none');
    group.input.classList.remove('is-invalid');
  }

  public render(): HTMLDivElement {
    return this.container;
  }
}
