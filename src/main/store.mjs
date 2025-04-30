import { configureStore } from '@reduxjs/toolkit';

import uuidReducer from './services/uuidSlice.mjs';
import contactsReducer from './services/contactsSlice.mjs';
import messagesReducer from './services/messagesSlice.mjs';


const store = configureStore({
  reducer: {
    uuid: uuidReducer,
    contacts: contactsReducer,
    messages: messagesReducer,
  },
});

export default store;
