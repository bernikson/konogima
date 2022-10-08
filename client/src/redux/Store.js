import { configureStore } from "@reduxjs/toolkit";
import webSlice from "./webSlice";

export default configureStore({
  reducer: {
    web: webSlice,
  },
});
