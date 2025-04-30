import { app, BrowserWindow, ipcMain } from 'electron';
import { validate } from 'uuid';

import { createMainWindow, createModalWindow } from './main/windows.mjs';
import {
  addContact,
  changeActiveContact,
  renameContact,
  removeUserData,
  sendMessage,
} from './main/controllers.mjs';

import { routers } from './main/routers.mjs';
import init from './main/init.mjs';
import store from './main/store.mjs';

import './main/menu.mjs';


app.whenReady().then(() => {
  let modalWin;
  const mainWin = createMainWindow();

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
    await addContact(uuid);
    modalWin.close();
  });

  ipcMain.on('rename-contact', async (_event, uuid) => {
    await renameContact(uuid);
    modalWin.close();
  });

  ipcMain.on('set-active-contact', async (_event, uuid) => {
    await changeActiveContact(uuid);
  });

  ipcMain.on('send-message', async (_event, message) => {
    await sendMessage(message);
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
