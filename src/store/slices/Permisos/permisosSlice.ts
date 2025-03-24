import { createSlice } from "@reduxjs/toolkit";

export interface StatePayload {
  state: string;
  data: any;
}

export interface PageSlotState {
  [index: string]: [] | any;
}

export interface IPage {
  slots: PageSlotState;
}

export const initialState: IPage = {
  slots: {},
};

export const permisosSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    createSlotPermisos: (state, action) => {
      state.slots = { ...state.slots, ...action.payload };
    },
  },
});

//export reducer
export const { createSlotPermisos } = permisosSlice.actions;
