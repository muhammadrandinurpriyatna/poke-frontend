import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './pokemonSlice';
import pokemonDetailReducer from './pokemonDetailSlice';
import pokemonRenameReducer from './pokemonRenameSlice';
import capturedPokemonReducer from "./capturedPokemonSlice";
import releasedPokemonReducer from "./releasedPokemonSlice";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    pokemonDetail: pokemonDetailReducer,
    capturedPokemon: capturedPokemonReducer,
    releasedPokemon: releasedPokemonReducer,
    pokemonRename: pokemonRenameReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
