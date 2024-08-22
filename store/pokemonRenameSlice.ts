import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RenamePayload {
  baseName: string;
  count: number;
}

interface RenameResponse {
  newName: string;
}

interface PokemonRenameState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PokemonRenameState = {
  status: 'idle',
  error: null,
};

export const renamePokemon = createAsyncThunk(
  'pokemon/rename',
  async (payload: RenamePayload): Promise<RenameResponse> => {
    const response = await fetch('http://localhost:3004/pokemon/rename', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to rename Pokémon');
    }

    return response.json();
  }
);

const pokemonRenameSlice = createSlice({
  name: 'pokemonRename',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(renamePokemon.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(renamePokemon.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(renamePokemon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default pokemonRenameSlice.reducer;
