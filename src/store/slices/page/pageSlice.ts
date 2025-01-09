import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

export interface StatePayload {
  state: string;
  data: any;
}

export interface PageSlotState {
  [index: string]: [] | any;
}

export interface IPage {
  title: string;
  errorMessage: string;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isOpenModal: boolean;
  isEditing: boolean;
  dataModal: {} | any;
  slots: PageSlotState;
  modalSize: string;
}

export const initialState: IPage = {
  title: "",
  errorMessage: "",
  isLoading: false,
  isError: false,
  isSuccess: false,
  isOpenModal: false,
  isEditing: false,
  dataModal: {},
  slots: {},
  modalSize: "lg",
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    setModalSize: (state, action: PayloadAction<string>) => {
      state.modalSize = action.payload;
    },
    setIsSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    setIsOpenModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenModal = action.payload;
    },
    setDataModal: (state, action: PayloadAction<any>) => {
      state.dataModal = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    createSlot: (state, action: PayloadAction<PageSlotState>) => {
      state.slots = { ...state.slots, ...action.payload };
    },

    addItemSlot: (state, { payload }: PayloadAction<StatePayload>) => {
      const nombreSlot = payload.state;
      state.slots[nombreSlot].push(payload.data);
    },
    updateItemSlot: (state, { payload }: PayloadAction<StatePayload>) => {
      const nombreSlot = payload.state;
      state.slots[nombreSlot] = state.slots[nombreSlot].map((item) =>
        item.id === payload.data.id ? payload.data : current(item)
      );
    },

    deleteItemSlot: (state, { payload }: PayloadAction<StatePayload>) => {
      const nombreSlot = payload.state;
      state.slots[nombreSlot] = state.slots[nombreSlot].filter(
        (item) => item.id !== payload.data
      );
    },
    deleteSlot: (state, action: PayloadAction<string>) => {
      delete state.slots[action.payload];
    },
    clearSlot: (state) => {
      state.slots = initialState.slots;
    },
    getSlot: (state, action: PayloadAction<string>) => {
      return state.slots[action.payload];
    },
    initPage: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDataOnSlot: (state, action: PayloadAction<StatePayload>) => {
      state.slots[action.payload.state] = action.payload.data;
    },
  },
});

//export reducer
export const {
  setTitle,
  setErrorMessage,
  setIsLoading,
  setIsError,
  setIsSuccess,
  createSlot,
  addItemSlot,
  deleteSlot,
  clearSlot,
  getSlot,
  initPage,
  deleteItemSlot,
  setIsOpenModal,
  setDataModal,
  updateItemSlot,
  setDataOnSlot,
  setIsEditing,
  setModalSize,
} = pageSlice.actions;
// export const { setTitle, setErrorMessage, setIsLoading, setIsError, setIsSuccess, createSlot } = screenSlice.actions
