import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ReleaseResponse {
  success: boolean;
}

interface PokemonState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PokemonState = {
  status: 'idle',
  error: null,
};

export const releasePokemon = createAsyncThunk<ReleaseResponse, string>(
  'pokemon/release',
  async (pokemonName: string) => {
    const response = await fetch('http://localhost:3004/pokemon/release', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: pokemonName }),
    });
    const data: ReleaseResponse = await response.json();
    if (!response.ok || !data.success) {
      throw new Error('Failed to release Pokémon');
    }
    return data;
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(releasePokemon.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(releasePokemon.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(releasePokemon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to release Pokémon';
      });
  },
});

export default pokemonSlice.reducer;
