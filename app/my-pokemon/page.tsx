"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { releasePokemon } from "../../store/releasedPokemonSlice";
import { renamePokemon } from "../../store/pokemonRenameSlice";
import { AppDispatch, RootState } from "../../store/store";

const MyPokemon = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const renameStatus = useSelector((state: RootState) => state.pokemonRename.status);
  const renameError = useSelector((state: RootState) => state.pokemonRename.error);

  useEffect(() => {
    const capturedPokemons = Cookies.get("capturedPokemons");
    if (capturedPokemons) {
      setPokemons(JSON.parse(capturedPokemons).map((pokemon: { originalName: any; name: any; }) => ({
        ...pokemon,
        originalName: pokemon.originalName || pokemon.name,
      })));
    }
  }, []);

  const handleRelease = async (pokemonName: string) => {
    try {
      const resultAction = await dispatch(releasePokemon(pokemonName));
      if (releasePokemon.fulfilled.match(resultAction)) {
        const result = resultAction.payload;
        if (result.success) {
          const updatedPokemons = pokemons.filter(pokemon => pokemon.name !== pokemonName);
          Cookies.set('capturedPokemons', JSON.stringify(updatedPokemons));
          setPokemons(updatedPokemons);

          Swal.fire({
            title: 'Success!',
            text: 'Successfully released Pokémon.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'You haven’t been lucky this time. Try again!',
            icon: 'error',
            confirmButtonText: 'Try Again',
          });
        }
      } else {
        throw new Error('Failed to release Pokémon');
      }
    } catch (error) {
      console.error('Release failed:', error);
      Swal.fire({
        title: 'Oops!',
        text: 'You haven’t been lucky this time. Try again!',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleRename = async (pokemon: any) => {
    try {
      const originalName = pokemon.originalName || pokemon.name;

      const resultAction = await dispatch(renamePokemon({
        baseName: originalName,
        count: pokemon.renameCount || 0,
      }));

      if (renamePokemon.fulfilled.match(resultAction)) {
        const data = resultAction.payload;
        const updatedPokemons = pokemons.map(poke => {
          if (poke.name === pokemon.name) {
            return { ...poke, name: data.newName, renameCount: (poke.renameCount || 0) + 1 };
          }
          return poke;
        });

        Cookies.set('capturedPokemons', JSON.stringify(updatedPokemons));
        setPokemons(updatedPokemons);

        Swal.fire({
          title: 'Success!',
          text: `Pokémon renamed to ${data.newName}.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        throw new Error(renameError || 'Failed to rename Pokémon');
      }
    } catch (error) {
      console.error('Rename failed:', error);
      Swal.fire({
        title: 'Oops!',
        text: 'Failed to rename Pokémon. Try again!',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  if (!pokemons) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 p-10">
      {pokemons.length > 0 ? (
        pokemons.map((pokemon: any) => (
          <div
            key={pokemon.name}
            className="flex flex-col rounded-xl bg-white shadow"
          >
            <div className="text-white flex justify-center bg-green-300 rounded-t-xl">
              <Image
                src={pokemon.imageUrl || "/placeholder.png"}
                alt={`${pokemon.name} Pokémon image`}
                width={150}
                height={150}
              />
            </div>
            <div className="pt-6 pb-3">
              <div className="flex justify-center">
                <h5 className="font-sans text-xl font-medium text-blue-gray-900">
                  {pokemon.name}
                </h5>
              </div>
            </div>
            <div className="pb-6 px-6 pt-3 flex">
              <button
                onClick={() => handleRelease(pokemon.name)}
                className="w-full rounded-xl bg-amber-500 py-4 px-7 text-center font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20"
              >
                Release
              </button>
            </div>
            <div className="pb-6 px-6 pt-3 flex">
              <button
                onClick={() => handleRename(pokemon)}
                className="w-full rounded-xl bg-yellow-500 py-4 px-7 text-center font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20"
              >
                Rename
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          No Pokémon captured yet.
        </div>
      )}
    </div>
  );
};

export default MyPokemon;
