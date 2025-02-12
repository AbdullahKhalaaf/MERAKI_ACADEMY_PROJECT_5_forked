import { createSlice } from "@reduxjs/toolkit";

const favSlice = createSlice({
  name: "fav",
  initialState: [],
  reducers: {
    setFav: (state, action) => {
      state.fav = action.payload;
    },
    addFav: (state, action) => {
      state.push(action.payload);
    },
    removeFav: (state, action) => {
      state.filter((fav) => fav.id !== action.payload);
    },
  },
});

export const { setFav } = favSlice.actions;
export default favSlice.reducer;
