import { Notification } from "electron";
import { routers } from "./routers.mjs";


const showNotification = (message) => {
  const notification = new Notification({
    title: 'Notice from Ntalk',
    body: message,
    icon: routers.local.fileIcon,
  });

  notification.show();
};

export default showNotification;
