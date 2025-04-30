const app = () => {
  const elements = {
    formElement: document.getElementById('form-add-contact'),
    inputElement: document.getElementById('input-add-contact'),
    feedbackElement: document.getElementById('feedback-add-contact'),
  };

  const isValidUUID = async (value) => window.appModules.isValidUUID(value);

  const message = 'Неверный формат ввода UUID!';

  elements.inputElement.focus();

  elements.formElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('contact').trim();

    const isValid = await isValidUUID(value);

    if (!value || !isValid) {
      elements.inputElement.classList.add('is-invalid');
      elements.feedbackElement.textContent = message;
      elements.inputElement.focus();
      return;
    }

    window.appModules.addContact(value);
  });
};

app();