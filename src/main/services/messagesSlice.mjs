import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const contactsSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessage: messagesAdapter.addOne,
    setMessages: messagesAdapter.setAll,
  },
});

export const selector = messagesAdapter.getSelectors((state) => state.messages);

export const { setMessage, setMessages } = contactsSlice.actions;

export default contactsSlice.reducer;
