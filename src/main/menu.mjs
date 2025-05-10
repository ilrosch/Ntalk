import { Menu, shell } from 'electron';
import { exportUserProfile, importUserProfile } from './profile.mjs';


const template = [
  {
    label: 'File',
    submenu: [
      { label: 'Fullscreen', role: 'togglefullscreen' },
      { type: 'separator' },
      {
        label: 'Import profile',
        accelerator: 'Ctrl+Shift+I',
        click: async () => { await importUserProfile(); },
      },
      {
        label: 'Export profile',
        accelerator: 'Ctrl+Shift+E',
        click: async () => { await exportUserProfile(); },
      },
      { type: 'separator' },
      { label: 'Reload', role: 'reload' },
      { label: 'Minimize', role: 'minimize' },
      { label: 'Exit', accelerator: 'Ctrl+Z', role: 'quit' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Documentation',
        accelerator: 'Ctrl+Shift+H',
        click: async () => {
          await shell.openExternal('https://github.com/ilrosch/Ntalk/tree/main');
        },
      },
      {
        label: 'Learn more',
        click: async () => {
          await shell.openExternal('https://github.com/ilrosch/Ntalk/tree/main');
        },
      }
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
