export class Modal {
  static showAlert(message: string, buttonText: string = 'Зрозуміло!'): void {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop-custom';

    const card = document.createElement('div');
    card.className = 'card shadow p-4';
    card.style.maxWidth = '480px';
    card.style.width = '90%';

    const text = document.createElement('p');
    text.className = 'mb-4 fs-6';
    text.textContent = message;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'd-flex justify-content-end';

    const okBtn = document.createElement('button');
    okBtn.className = 'btn btn-primary px-4';
    okBtn.textContent = buttonText;
    okBtn.onclick = () => backdrop.remove();

    btnContainer.appendChild(okBtn);
    card.appendChild(text);
    card.appendChild(btnContainer);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
  }

  static showPrompt(
    title: string,
    placeholder: string,
    onConfirm: (val: string) => void
  ): void {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop-custom';

    const card = document.createElement('div');
    card.className = 'card shadow p-4';
    card.style.maxWidth = '450px';
    card.style.width = '90%';

    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-3';

    const titleEl = document.createElement('h5');
    titleEl.className = 'm-0 fs-5';
    titleEl.textContent = title;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close';
    closeBtn.onclick = () => backdrop.remove();

    header.appendChild(titleEl);
    header.appendChild(closeBtn);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control mb-3';
    input.placeholder = placeholder;

    const errorMsg = document.createElement('div');
    errorMsg.className = 'text-danger small mb-3 d-none';

    const actions = document.createElement('div');
    actions.className = 'd-flex justify-content-end gap-2';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Скасувати';
    cancelBtn.onclick = () => backdrop.remove();

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Зберегти';
    saveBtn.onclick = () => {
      const val = input.value.trim();
      if (!val) {
        errorMsg.textContent = 'Це поле є обов’язковим';
        errorMsg.classList.remove('d-none');
        return;
      }
      backdrop.remove();
      onConfirm(val);
    };

    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);

    card.appendChild(header);
    card.appendChild(input);
    card.appendChild(errorMsg);
    card.appendChild(actions);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
  }
}
