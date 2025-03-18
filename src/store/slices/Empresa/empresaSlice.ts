import { createSlice } from "@reduxjs/toolkit";

export interface StatePayload {
  state: string;
  data: any;
}

export interface EmpresaSlotState {
  [index: string]: [] | any;
}

export interface IStateEmpresa {
  id: string;
  nombre: string;
  nombreCorto: string;
  direccion: string;
  telefono: string;
  representante: string;
  slots: EmpresaSlotState;
}

export const initialState: IStateEmpresa = {
  id: "",
  nombre: "",
  nombreCorto: "",
  direccion: "",
  telefono: "",
  representante: "",
  slots: {},
};

export const empresaSlice = createSlice({
  name: "empresa",
  initialState,
  reducers: {
    createSlotEmpresa: (state, action) => {
      state.slots = { ...state.slots, ...action.payload };
    },
    setInfoEmpresa: (state, action) => {
      state.id = action.payload.id;
      state.nombre = action.payload.nombre;
      state.nombreCorto = action.payload.nombreCorto;
      state.direccion = action.payload.direccion;
      state.representante = action.payload.representante;
      state.telefono = action.payload.telefono;
    },
  },
});

//export reducer
export const { createSlotEmpresa, setInfoEmpresa } = empresaSlice.actions;
