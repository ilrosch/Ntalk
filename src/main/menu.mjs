import { Menu, shell } from 'electron';

const template = [
  {
    label: 'Окно',
    submenu: [
      { label: 'Полноэкранный', role: 'togglefullscreen' },
      { type: 'separator' },
      { label: 'Обновить', role: 'reload' },
      { label: 'Свернуть', role: 'minimize' },
      { label: 'Закрыть', accelerator: 'Ctrl+Z', role: 'quit' },
    ],
  },
  {
    label: 'Действия',
    submenu: []
  },
  {
    label: 'Помощь',
    submenu: [
      {
        label: 'Документация',
        click: async () => {
          await shell.openExternal('https://github.com/ilrosch/Ntalk/tree/main');
        },
      },
      {
        label: 'Узнать больше',
        click: async () => {
          await shell.openExternal('https://github.com/ilrosch/Ntalk/tree/main');
        },
      }
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
