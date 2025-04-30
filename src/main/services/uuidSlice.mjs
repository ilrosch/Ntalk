import { createSlice } from '@reduxjs/toolkit'

const uuidSlice = createSlice({
  name: 'uuid',
  initialState: {
    uuid: null,
    uuidActive: null,
  },
  reducers: {
    setUuid: (state, { payload }) => ({ ...state, uuid: payload }),
    setUuidActive: (state, { payload }) => ({ ...state, uuidActive: payload }),
  },

});

export const { setUuid, setUuidActive } = uuidSlice.actions;

export default uuidSlice.reducer;