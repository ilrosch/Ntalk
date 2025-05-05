import fsp from 'fs/promises';
import { existsSync } from 'fs';
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

import { setContacts } from "./services/contactsSlice.mjs";
import { setUuid, setUuidActive } from "./services/uuidSlice.mjs";
import { setMessages } from './services/messagesSlice.mjs';

import showNotification from "./notification.mjs";
import { routers } from "./routers.mjs";


const createDirUserData = () => {
  const { dirUserData, dirMessages } = routers.local;

  const createDir = async () => {
    try {
      await fsp.mkdir(dirUserData);
      await fsp.mkdir(dirMessages);
    } catch (err) {
      showNotification(`An error occurred: ${err}`);
    }
  };

  const accessDir = async () => {
    try {
      const stats = await fsp.stat(dirUserData);
      if (!stats.isDirectory()) {
        throw new Error('User data directory is not exist!');
      }
    } catch (_err) {
      await createDir();
    }
  };

  return Promise.all([accessDir()]);
};

const uuidLoading = async (store) => {
  const { fileUuid } = routers.local;

  const createNewUuid = async () => {
    try {
      const uuid = uuidv4();
      await fsp.writeFile(fileUuid, JSON.stringify({ uuid }));
      store.dispatch(setUuid(uuid));
    } catch (err) {
      showNotification(`An error occurred: ${err}`);
    }
  };

  try {
    await fsp.access(fileUuid);
    const data = await fsp.readFile(fileUuid, 'utf-8');
    const { uuid } = JSON.parse(data);
    if (!uuid || !uuidValidate(uuid)) {
      throw new Error('UUID is not valid!');
    }
    store.dispatch(setUuid(uuid));
  } catch (err) {
    await createNewUuid();
  }
};

const contactsLoading = async (store) => {
  const { fileContacts, fileMessages } = routers.local;

  const createNewContacts = async () => {
    try {
      await fsp.writeFile(fileContacts, '');
    } catch (err) {
      showNotification(`An error occurred: ${err}`);
    }
  }

  try {
    await fsp.access(fileContacts);
    const data = await fsp.readFile(fileContacts, 'utf-8');
    const users = [...JSON.parse(data)];
    // добавить логику
    if (users.length === 0) {
      return;
    }

    const uuid = users[0].id;

    store.dispatch(setUuidActive(uuid));
    store.dispatch(setContacts(users));
    // Загрузка сообщений
    const messages = await fsp.readFile(fileMessages(uuid), 'utf-8');
    store.dispatch(setMessages(JSON.parse(messages)));
  } catch (err) {
    await createNewContacts();
  }
};

const init = (store) => {
  // подготовка директории
  // для пользовательских данных
  createDirUserData();
  // подготовка пользовательских данных
  const psUuidLoading = uuidLoading(store);
  const psContactsLoading = contactsLoading(store);
  return Promise.all([psUuidLoading, psContactsLoading])
    .then(() => showNotification('The client is ready to work!'));
};

const isExistProfile = () => {
  const { dirUserData } = routers.local;
  return existsSync(dirUserData);
};

export { init, isExistProfile };
