import { User } from '../../models/User';
import { Validation } from '../../utils/validators';

export class UserForm {
  private container: HTMLDivElement;
  private onUserAdd: (user: User) => void;

  constructor(onUserAdd: (user: User) => void) {
    this.onUserAdd = onUserAdd;
    this.container = document.createElement('div');
    this.init();
  }

  private init(): void {
    this.container.className = 'card shadow-sm p-4 mb-4';

    const titleEl = document.createElement('h5');
    titleEl.className = 'fw-bold mb-3';
    titleEl.textContent = 'Додати Користувача';
    this.container.appendChild(titleEl);

    const nameGroup = this.createInputGroup("Ім'я", 'text');
    const emailGroup = this.createInputGroup('Email', 'email');

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-success mt-2 align-self-start px-4';
    submitBtn.textContent = 'Додати Користувача';

    submitBtn.onclick = () => {
      let isValid = true;

      const nameVal = nameGroup.input.value.trim();
      const emailVal = emailGroup.input.value.trim();

      this.clearError(nameGroup);
      this.clearError(emailGroup);

      if (!Validation.isNotEmpty(nameVal)) {
        this.showError(nameGroup, 'Це поле є обов’язковим');
        isValid = false;
      }
      if (!Validation.isNotEmpty(emailVal)) {
        this.showError(emailGroup, 'Це поле є обов’язковим');
        isValid = false;
      } else if (!Validation.isValidEmail(emailVal)) {
        this.showError(emailGroup, 'Введіть коректну електронну пошту');
        isValid = false;
      }

      if (isValid) {
        const newUser = new User(Date.now().toString(), nameVal, emailVal);
        this.onUserAdd(newUser);

        nameGroup.input.value = '';
        emailGroup.input.value = '';
      }
    };

    this.container.appendChild(nameGroup.wrapper);
    this.container.appendChild(emailGroup.wrapper);
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
