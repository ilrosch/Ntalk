import fsp from 'fs/promises';

import { selector as selectorContacts, setContact, updateContact } from "./services/contactsSlice.mjs";
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

const changeActiveContact = async (uuid) => {
  const { fileMessages } = routers.local;
  try {
    const data = await fsp.readFile(fileMessages(uuid), 'utf-8');
    store.dispatch(setMessages(JSON.parse(data || '{}')));
    store.dispatch(setUuidActive(uuid));
  } catch (err) {
    showNotification(`Возникла ошибка: ${err}`);
  }
};

const addContact = async (uuid) => {
  const currentIds = selectorContacts.selectIds(store.getState());

  if (currentIds.includes(uuid)) {
    await changeActiveContact(uuid);
    showNotification('Собеседник с таким идентификатором уже существует!');
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

    showNotification('Собеседник добавлен успешно! Приятного общения)');
  } catch (err) {
    showNotification(`Возникла ошибка при добавлении собеседника: ${err}`);
  }
};

const renameContact = async (name) => {
  const { uuidActive } = store.getState().uuid;
  try {
    store.dispatch(updateContact({ id: uuidActive, changes: { name } }));
    await writeContacts();
    showNotification('Собеседник успешно переименован!');
  } catch (err) {
    showNotification(`Возникла ошибка при переименовании собеседника: ${err}`);
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
    showNotification(`Возникла ошибка при отправки сообщения: ${err}`);
  }
};

const removeUserData = async () => {
  const { dirUserData } = routers.local;
  try {
    await fsp.rmdir(dirUserData, { recursive: true });
    showNotification('Ваш профиль успешно удален!');
  } catch (err) {
    showNotification(`Возникла ошибка при удалении профиля: ${err}`);
  }
};

export {
  addContact,
  changeActiveContact,
  renameContact,
  removeUserData,
  sendMessage,
};
