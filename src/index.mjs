import { app, BrowserWindow, ipcMain } from 'electron';
import { validate } from 'uuid';

import { createMainWindow, createModalWindow } from './main/windows.mjs';
import {
  addContact,
  changeActiveContact,
  renameContact,
  removeUserData,
  sendMessage,
  clearMessages,
  rmContact,
} from './main/controllers.mjs';

import { routers } from './main/routers.mjs';
import { init, isExistProfile } from './main/init.mjs';
import { importUserProfile } from './main/profile.mjs';
import store from './main/store.mjs';

import './main/menu.mjs';


const showMainWindow = () => {
  const { fileMainWin } = routers.local;
  const mainWin = createMainWindow(fileMainWin);

  mainWin.webContents.on('did-finish-load', () => {
    mainWin.webContents.send('get-state', store.getState());
  });

  return mainWin;
};

app.whenReady().then(() => {
  let modalWin;
  let isWelcomeWin = !isExistProfile();
  let mainWin = isWelcomeWin
    ? createMainWindow(routers.local.fileWelcomeWin)
    : showMainWindow();

  // Инициализации внутреннего состояния
  init(store);

  // Отслеживаем изменение состояния
  store.subscribe(() => {
    mainWin.webContents.send('get-state', store.getState());
  });

  // Пробрасываем состояние после загрузки
  mainWin.webContents.on('did-finish-load', () => {
    mainWin.webContents.send('get-state', store.getState());
  });

  // Обработка действий
  ipcMain.on('add-contact', async (_event, uuid) => {
    if (isWelcomeWin) {
      mainWin.close();
      mainWin = showMainWindow();
      isWelcomeWin = false;
    }

    await addContact(uuid);
    if (modalWin) modalWin.close();
  });

  ipcMain.on('rename-contact', async (_event, uuid) => {
    await renameContact(uuid);
    modalWin.close();
  });

  ipcMain.on('remove-contact', async (_event, uuid) => {
    await rmContact(uuid);
  });

  ipcMain.on('set-active-contact', async (_event, uuid) => {
    await changeActiveContact(uuid);
  });

  ipcMain.on('send-message', async (_event, message) => {
    await sendMessage(message);
  });

  ipcMain.on('clear-messages', async () => {
    await clearMessages();
  });

  ipcMain.on('remove-user-data', async () => {
    await removeUserData();
    app.quit();
  });

  ipcMain.handle('is-valid-uuid', (_event, uuid) => {
    return validate(uuid);
  });

  // Обработка показа окон
  ipcMain.on('show-modal-add', () => {
    modalWin = createModalWindow(mainWin, routers.local.fileModalAdd);
  });

  ipcMain.on('show-modal-rename', () => {
    modalWin = createModalWindow(mainWin, routers.local.fileModalRename);
  });

  ipcMain.on('import-profile', async () => {
    await importUserProfile();
    if (isWelcomeWin) {
      mainWin.close();
      mainWin = showMainWindow();
      isWelcomeWin = false;
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
