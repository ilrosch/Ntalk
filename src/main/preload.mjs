import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('appModules', {
  // Обработка окон
  openModalAdd: () => ipcRenderer.send('show-modal-add'),
  openRenameModal: () => ipcRenderer.send('show-modal-rename'),
  // Обработка состояния
  getState: (cb) => ipcRenderer.on('get-state', (_event, state) => cb(state)),
  addContact: (uuid) => ipcRenderer.send('add-contact', uuid),
  renameContact: (name) => ipcRenderer.send('rename-contact', name),
  removeUserData: () => ipcRenderer.send('remove-user-data'),
  sendMessage: (msg) => ipcRenderer.send('send-message', msg),
  setActiveContact: (uuid) => ipcRenderer.send('set-active-contact', uuid),
  clearMessages: () => ipcRenderer.send('clear-messages'),
  removeContact: () => ipcRenderer.send('remove-contact'),
  // Прочее
  isValidUUID: (uuid) => ipcRenderer.invoke('is-valid-uuid', uuid),
});