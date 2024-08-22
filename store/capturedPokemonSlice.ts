import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface CapturedPokemonState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CapturedPokemonState = {
  status: 'idle',
  error: null,
};

export const capturePokemon = createAsyncThunk(
  'capturedPokemon/capture',
  async (pokemon: { name: string; imageUrl: string }) => {
    const response = await fetch('http://localhost:3004/pokemon/capture');
    const data = await response.json();

    if (!response.ok || data.success !== true) {
      throw new Error('Failed to capture Pokémon');
    }

    return data;
  }
);

const capturedPokemonSlice = createSlice({
  name: 'capturedPokemon',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(capturePokemon.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(capturePokemon.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(capturePokemon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to capture Pokémon';
      });
  },
});

export const { resetStatus } = capturedPokemonSlice.actions;
export default capturedPokemonSlice.reducer;
