import { BrowserWindow } from "electron";
import { routers } from "./routers.mjs";


const createMainWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    center: true,
    icon: routers.local.fileIcon,
    webPreferences: {
      preload: routers.local.filePreload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  win.loadFile(routers.local.fileMainWin);
  win.webContents.openDevTools();

  return win;
};

const createModalWindow = (parent, pathFile) => {
  const win = new BrowserWindow({
    parent,
    width: 500,
    height: 300,
    center: true,
    resizable: false,
    modal: true,
    icon: routers.local.fileIcon,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: routers.local.filePreload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  win.loadFile(pathFile);
  win.on('ready-to-show', () => win.show());
  // win.webContents.openDevTools();

  return win;
};

export { createMainWindow, createModalWindow };
