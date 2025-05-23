import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const contactsAdapter = createEntityAdapter();
const initialState = contactsAdapter.getInitialState();

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContact: contactsAdapter.addOne,
    setContacts: contactsAdapter.setMany,
    updateContact: contactsAdapter.updateOne,
    removeContact: contactsAdapter.removeOne,
  },
});

export const selector = contactsAdapter.getSelectors((state) => state.contacts);

export const { setContact, setContacts, updateContact, removeContact } = contactsSlice.actions;

export default contactsSlice.reducer;
