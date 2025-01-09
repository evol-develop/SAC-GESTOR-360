import { configureStore } from "@reduxjs/toolkit";
import { pageSlice } from "./slices/page/pageSlice";
import { permisosSlice } from "./slices/Permisos/permisosSlice";
import { empresaSlice } from "./slices/Empresa";

export const store = configureStore({
  reducer: {
    page: pageSlice.reducer,
    permisos: permisosSlice.reducer,
    empresa: empresaSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
