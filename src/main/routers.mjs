import { app } from "electron";
import { fileURLToPath } from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathUserData = path.join(app.getPath('userData'), 'data');

export const routers = {
  local: {
    fileModalAdd: path.join(__dirname, '../renderer/windows/modal-add.html'),
    fileModalRename: path.join(__dirname, '../renderer/windows/modal-rename.html'),
    fileMainWin: path.join(__dirname, '../renderer/windows/index.html'),
    fileWelcomeWin: path.join(__dirname, '../renderer/windows/welcome.html'),
    fileIcon: path.join(__dirname, '../asserts/img/icon.png'),
    filePreload: path.join(__dirname, '../main/preload.mjs'),
    // user data
    dirUserData: pathUserData,
    fileUuid: path.join(pathUserData, 'uuid.json'),
    fileContacts: path.join(pathUserData, 'contacts.json'),
    dirMessages: path.join(pathUserData, 'messages'),
    fileMessages: (uuid) => path.join(pathUserData, 'messages', `${uuid}.json`),
  },
};
