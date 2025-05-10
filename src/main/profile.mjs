import AdmZip from "adm-zip";
import { dialog } from "electron";
import { routers } from "./routers.mjs";
import { init } from "./init.mjs";
import showNotification from "./notification.mjs";
import store from "./store.mjs";


const exportUserProfile = async () => {
  const { dirUserData } = routers.local;

  const pathZip = await dialog.showSaveDialog({
    title: 'Save profile',
    defaultPath: 'ntalk-profile.zip',
    filters: [{ name: 'ZIP', extensions: ['zip'] }],
  });

  if (pathZip.canceled || !pathZip.filePath) {
    return;
  }

  try {
    const zip = new AdmZip();
    await zip.addLocalFolderPromise(dirUserData, (n) => n);
    await zip.writeZipPromise(pathZip.filePath);
    showNotification('Your export profile successfully!');
  } catch (err) {
    showNotification(`Export error: ${err}`);
  }
};

const importUserProfile = async () => {
  const { dirUserData } = routers.local;

  const pathZip = await dialog.showOpenDialog({
    title: 'Import profile',
    defaultPath: 'ntalk-profile.zip',
    filters: [{ name: 'ZIP', extensions: ['zip'] }],
  });

  if (pathZip.canceled || !pathZip.filePaths.length) {
    return;
  }

  try {
    const zip = new AdmZip(pathZip.filePaths[0]);
    await zip.extractAllToAsync(dirUserData, true);
    init(store);
    showNotification('Import your profile successfully!');
  } catch (err) {
    showNotification(`Import error: ${err}`);
  }
};

export { exportUserProfile, importUserProfile };
