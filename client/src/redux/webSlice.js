import { createSlice } from "@reduxjs/toolkit";

const webSlice = createSlice({
  name: "webSlice",
  initialState: {
    user: {},
    authState: 0,
  },
  reducers: {
    updateAuthState: (state, { payload }) => {
      state.authState = payload;
    },
  },
  extraReducers: {},
});

export const { updateAuthState } = webSlice.actions;
export default webSlice.reducer;
