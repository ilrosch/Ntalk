const renderContacts = (elements, entities, currentUUID) => {
  const items = Object.values(entities).map((contact) => {
    const isActive = contact.id === currentUUID;

    const li = document.createElement('li');
    const button = document.createElement('button');
    const buttonNames = isActive ? ['contacts__item', 'contacts__item_active'] : ['contacts__item'];
    button.classList.add(...buttonNames);
    button.setAttribute('type', 'button');
    button.setAttribute('data-uuid', contact.id);

    button.addEventListener('click', async ({ currentTarget }) => {
      await window.appModules.setActiveContact(currentTarget.dataset.uuid);
    });

    const icon = document.createElement('div');
    icon.classList.add('contacts__item-icon');

    const block = document.createElement('div');
    block.classList.add('contacts__item-block');

    const name = document.createElement('div');
    name.classList.add('contacts__item-title');
    name.textContent = contact.name;

    const status = document.createElement('div');
    const statusName = contact.isOnline ? 'status_on' : 'status_off';
    status.classList.add('status', statusName);
    status.textContent = contact.isOnline ? 'Online' : 'Offline';

    block.append(name, status);
    button.append(icon, block);
    li.append(button);

    return li;
  });

  elements.contactsContainer.innerHTML = '';
  elements.contactsContainer.append(...items);
};

const renderGreating = (elements) => {
  const greatingBlock = document.createElement('div');
  greatingBlock.classList.add('msg__greating');

  const img = document.createElement('img');
  img.classList.add('msg__greating-img');
  img.src = '../../asserts/img/welcome.png';

  const titleBlock = document.createElement('div');
  titleBlock.classList.add('msg__greating-block');

  const title = document.createElement('h2');
  title.classList.add('msg__greating-title');
  title.textContent = 'Welcome';

  const text = document.createElement('p');
  text.classList.add('msg__greating-text');
  text.innerHTML = "You don't have any contacts yet.<br>Add users and enjoy safe communication.";

  titleBlock.append(title, text);
  greatingBlock.append(img, titleBlock);

  elements.headerContainer.innerHTML = '';
  elements.messagesContainer.innerHTML = '';
  elements.footerContainer.classList.add('hidden');

  elements.messagesContainer.append(greatingBlock);
};

const renderHeader = (elements, contact) => {
  const headerBlock = document.createElement('div');
  headerBlock.classList.add('msg__header-title');

  const status = document.createElement('div');
  const statusName = contact.isOnline ? 'status_on' : 'status_off';
  status.classList.add('status', statusName);

  const headerTitle = document.createElement('span');
  headerTitle.classList.add('msg__header-name');
  headerTitle.textContent = contact.name;

  headerBlock.append(status, headerTitle);

  const btnBlock = document.createElement('div');
  btnBlock.classList.add('msg__header-btns');

  const btnRename = document.createElement('button');
  btnRename.classList.add('msg__header-btn', 'btn', 'btn_blue');
  btnRename.setAttribute('type', 'button');
  btnRename.setAttribute('data-action', 'rename');
  btnRename.setAttribute('title', 'Rename contact');

  btnRename.addEventListener('click', () => {
    window.appModules.openRenameModal();
  });

  const btnClear = document.createElement('button');
  btnClear.classList.add('msg__header-btn', 'btn', 'btn_yellow');
  btnClear.setAttribute('type', 'button');
  btnClear.setAttribute('data-action', 'clear');
  btnClear.setAttribute('title', 'Clear chat');

  btnClear.addEventListener('click', () => {
    window.appModules.clearMessages();
  });

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('msg__header-btn', 'btn', 'btn_red');
  btnDelete.setAttribute('type', 'button');
  btnDelete.setAttribute('data-action', 'delete');
  btnDelete.setAttribute('title', 'Delete contact');

  btnDelete.addEventListener('click', () => {
    window.appModules.removeContact();
  });

  btnBlock.append(btnRename, btnClear, btnDelete);

  elements.headerContainer.innerHTML = '';
  elements.headerContainer.append(headerBlock, btnBlock);
};

const renderMesssages = (elements, entities) => {
  const { messagesContainer } = elements;

  const groups = Object.values(entities).reduce((acc, message) => {
    acc[message.dateId] = acc[message.dateId] ?? [];
    acc[message.dateId].push(message);
    return acc;
  }, {});

  const items = Object.entries(groups).map(([key, messages]) => {
    const item = document.createElement('div');
    item.classList.add('msg__item');
    const date = document.createElement('div');
    date.classList.add('msg__item-date');
    date.textContent = key;
    const msgs = messages.map((message) => {
      const block = document.createElement('div');
      const blockNames = message.sender === 'you' ? ['msg__item-content', 'msg__item-content_sented'] : ['msg__item-content', 'msg__item-content_received'];
      block.classList.add(...blockNames);
      block.textContent = message.message;
      return block;
    });
    item.append(date, ...msgs);
    return item;
  });

  messagesContainer.innerHTML = '';
  messagesContainer.append(...items);
  // scroll bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

const App = () => {
  const elements = {
    // Кнопки взаимодействия
    buttonAddContact: document.querySelector('[data-action="modal-add"]'),
    buttonRemoveUser: document.querySelector('[data-action="remove-user-data"]'),
    // Контейнеры для контента
    contactsContainer: document.getElementById('contacts'),
    chatContainer: document.getElementById('chat'),
    headerContainer: document.getElementById('msg-header'),
    messagesContainer: document.getElementById('msg-body'),
    footerContainer: document.getElementById('msg-footer'),
    // Конкретнные элементы
    uuidElement: document.getElementById('uuid'),
    formElement: document.getElementById('form-add-message'),
  };

  const render = (state) => {
    const { uuid, uuidActive } = state.uuid;
    const { entities: contactsEntities } = state.contacts;
    const { entities: msgEntities } = state.messages;

    const currentContact = contactsEntities[uuidActive];

    elements.uuidElement.textContent = uuid;
    renderContacts(elements, contactsEntities, uuidActive);

    if (!uuidActive) {
      renderGreating(elements);
      return;
    }

    renderHeader(elements, currentContact);
    renderMesssages(elements, msgEntities);

    elements.footerContainer.classList.toggle('hidden', !uuidActive);
  };

  // Отслеживаем состояние
  window.appModules.getState((state) => { render(state); });

  // Обработчик открытия окна добавления контакта
  elements.buttonAddContact.addEventListener('click', () => {
    window.appModules.openModalAdd();
  });

  // Обработчик удаления учетной записи пользователя
  elements.buttonRemoveUser.addEventListener('click', () => {
    window.appModules.removeUserData();
  });

  // Обработка формы отправки сообщения
  elements.formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const message = formData.get('message').trim();

    if (!message) { return; }

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const msg = { id: date.toISOString(), dateId: formattedDate, message, sender: 'you' };

    window.appModules.sendMessage(msg);

    e.target.reset();
  });
};

App();
