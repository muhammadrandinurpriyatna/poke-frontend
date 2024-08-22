import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface PokemonDetail {
  name: string;
  types: Array<{ type: { name: string } }>;
  moves: Array<{ move: { name: string } }>;
  sprites: {
    front_default: string;
  };
}

interface PokemonDetailState {
  data: PokemonDetail | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PokemonDetailState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchPokemonDetails = createAsyncThunk(
  'pokemonDetail/fetchPokemonDetails',
  async (pokemonName: string) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon details');
    }
    return response.json();
  }
);

const pokemonDetailSlice = createSlice({
  name: 'pokemonDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPokemonDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch Pokémon details';
      });
  },
});

export default pokemonDetailSlice.reducer;
