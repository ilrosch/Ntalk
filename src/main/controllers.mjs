import fsp from 'fs/promises';

import { selector as selectorContacts, setContact, updateContact, removeContact } from "./services/contactsSlice.mjs";
import { selector as selectorMessages, setMessage, setMessages } from './services/messagesSlice.mjs';
import { setUuidActive } from './services/uuidSlice.mjs';

import showNotification from './notification.mjs';
import { routers } from './routers.mjs';

import store from "./store.mjs";


const writeContacts = async () => {
  const { fileContacts } = routers.local;
  const entities = selectorContacts.selectEntities(store.getState());
  const contacts = Object.values(entities).map((contact) => contact);
  await fsp.writeFile(fileContacts, JSON.stringify(contacts));
};

const writeMessages = async (uuid) => {
  const { fileMessages } = routers.local;
  const entities = selectorMessages.selectEntities(store.getState());
  await fsp.writeFile(fileMessages(uuid), JSON.stringify(entities));
};

const changeActiveContact = async (uuid) => {
  const { fileMessages } = routers.local;
  try {
    if (uuid) {
      const data = await fsp.readFile(fileMessages(uuid), 'utf-8');
      store.dispatch(setMessages(JSON.parse(data || '{}')));
    }
    store.dispatch(setUuidActive(uuid));
  } catch (err) {
    showNotification(`An error occurred: ${err}`);
  }
};

const addContact = async (uuid) => {
  const currentIds = selectorContacts.selectIds(store.getState());

  if (currentIds.includes(uuid)) {
    await changeActiveContact(uuid);
    showNotification('An contact with this UUID already exists!');
    return;
  }

  const { fileMessages } = routers.local;
  const contact = { id: uuid, name: uuid };

  try {
    // Добавляем новый контакт
    store.dispatch(setContact(contact));
    await writeContacts();

    // Создаем файл для хранения сообщений
    await fsp.writeFile(fileMessages(uuid), '');

    // Изменение состояния
    await changeActiveContact(uuid);

    showNotification('Contact added successfully! Have a nice chat)');
  } catch (err) {
    showNotification(`An error occurred: ${err}`);
  }
};

const renameContact = async (name) => {
  const { uuidActive } = store.getState().uuid;
  try {
    store.dispatch(updateContact({ id: uuidActive, changes: { name } }));
    await writeContacts();
    showNotification('Contact renamed successfully!');
  } catch (err) {
    showNotification(`An error occurred: ${err}`);
  }
};

const sendMessage = async (message) => {
  const { uuidActive } = store.getState().uuid;
  const { fileMessages } = routers.local;

  if (!uuidActive) { return; }

  try {
    await fsp.access(fileMessages(uuidActive));
    store.dispatch(setMessage(message));
    const messages = selectorMessages.selectEntities(store.getState());
    await fsp.writeFile(fileMessages(uuidActive), JSON.stringify(messages));
  } catch (err) {
    showNotification(`An error occurred: ${err}`);
  }
};

const removeUserData = async () => {
  const { dirUserData } = routers.local;
  try {
    await fsp.rmdir(dirUserData, { recursive: true });
    showNotification('Your profile was successfully deleted!');
  } catch (err) {
    showNotification(`An error occurred: ${err}`);
  }
};

const clearMessages = async () => {
  const { uuidActive } = store.getState().uuid;
  try {
    store.dispatch(setMessages({}));
    await writeMessages(uuidActive);
    showNotification('Chat is cleared successfully!');
  } catch (err) {
    showNotification(`An error occurred: ${err}`);
  }
};

const rmContact = async () => {
  const { fileMessages } = routers.local;
  const { uuidActive } = store.getState().uuid;
  try {
    store.dispatch(removeContact(uuidActive));
    await fsp.rm(fileMessages(uuidActive));
    await writeContacts();
    const newActive = selectorContacts.selectIds(store.getState());
    if (newActive.length !== 0) {
      await changeActiveContact(newActive[0]);
    } else {
      await changeActiveContact(null);
    }
    showNotification('Contact is removed successfully!');
  } catch (err) {
    showNotification(`An error occurred: ${err}`);
  }
};

export {
  addContact,
  changeActiveContact,
  renameContact,
  removeUserData,
  sendMessage,
  clearMessages,
  rmContact,
};
