import { createSlice } from "@reduxjs/toolkit";

const favSlice = createSlice({
  name: "fav",
  initialState: {
    movieFav: [],
    seriesFav: [],
  },
  reducers: {
    setMovieFav: (state, action) => {
      state.movieFav = action.payload;
      return action.payload;
    },
    setSeriesFav: (state, action) => {
      state.seriesFav = action.payload;
      return action.payload;
    },
   
    removeFav: (state, action) => {
      return state.filter((fav) => fav.id !== action.payload);
    },
  },
});

export const { setMovieFav, setSeriesFav, addFav, removeFav } =
  favSlice.actions;
export default favSlice.reducer;
