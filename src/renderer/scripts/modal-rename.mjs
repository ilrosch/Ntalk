const app = () => {
  const elements = {
    formElement: document.getElementById('form-rename-contact'),
    inputElement: document.getElementById('input-rename-contact'),
    feedbackElement: document.getElementById('feedback-rename-contact'),
  };

  const message = 'Минимимум 2 символа!';

  elements.inputElement.focus();

  elements.formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('contact').trim();

    if (!value || value.length < 2) {
      elements.inputElement.classList.add('is-invalid');
      elements.feedbackElement.textContent = message;
      elements.inputElement.focus();
      return;
    }

    window.appModules.renameContact(value);
  });
};

app();