import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Pokemon {
	name: string;
	url: string;
	imageUrl?: string;
}

interface PokemonState {
	pokemonList: Pokemon[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	nextUrl: string | null;
}

const initialState: PokemonState = {
	pokemonList: [],
	status: 'idle',
	nextUrl: 'https://pokeapi.co/api/v2/pokemon?limit=20',
};

export const fetchPokemons = createAsyncThunk(
	'pokemon/fetchPokemons',
	async (url: string) => {
		const response = await fetch(url);
		const data = await response.json();
		const pokemonList = await Promise.all(
			data.results.map(async (pokemon: any) => {
				const pokemonData = await fetch(pokemon.url).then((res) => res.json());
				return {
					name: pokemon.name,
					url: pokemon.url,
					imageUrl: pokemonData.sprites.front_default,
				};
			})
		);
		return { pokemonList, nextUrl: data.next };
	}
);

const pokemonSlice = createSlice({
	name: 'pokemon',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPokemons.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchPokemons.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.pokemonList = [...state.pokemonList, ...action.payload.pokemonList];
				state.nextUrl = action.payload.nextUrl;
			})
			.addCase(fetchPokemons.rejected, (state) => {
				state.status = 'failed';
			});
	},
});

export default pokemonSlice.reducer;