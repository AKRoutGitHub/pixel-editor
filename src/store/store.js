import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import authReducer from "./authSlice";


const store = configureStore({
  reducer: {
    editor: editorReducer,
    auth: authReducer,
  },
});

export default store;