const app = () => {
  const buttons = document.querySelectorAll('[data-action]');
  buttons.forEach((button) => {
    button.addEventListener('click', ({ target }) => {
      const action = target.dataset.action;
      window.appModules[action]();
    });
  });

  const renderUUID = (state) => {
    const { uuid } = state.uuid;
    const uuidElement = document.getElementById('uuid');
    const spanElement = document.getElementById('span-uuid');
    spanElement.textContent = uuid;

    const notification = document.getElementById('notification');
    const textNotification = notification.querySelector('span');

    const renderNotification = (text, isOk) => {
      const nameClass = isOk ? 'welcome__notification_success' : 'welcome__notification_error';
      notification.classList.add('open-notification', nameClass);
      textNotification.textContent = text;

      setTimeout(() => notification.classList.remove('open-notification'), 3000);
    };

    uuidElement.addEventListener('click', ({ target }) => {
      navigator.clipboard.writeText(target.textContent)
        .then(() => { renderNotification('Copied to clipboard', true); })
        .catch((err) => { renderNotification(`Error: ${err}`, false); });
    });
  };

  window.appModules.getState((state) => { renderUUID(state); });
};

app();