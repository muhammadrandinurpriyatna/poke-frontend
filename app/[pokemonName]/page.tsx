"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchPokemonDetails } from "../../store/pokemonDetailSlice";
import { capturePokemon, resetStatus } from "../../store/capturedPokemonSlice";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../../components/Spinner";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const PokemonDetail = () => {
  const { pokemonName } = useParams<{ pokemonName: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    data: pokemonData,
    status,
    error,
  } = useSelector((state: RootState) => state.pokemonDetail);
  const captureStatus = useSelector(
    (state: RootState) => state.capturedPokemon.status
  );

  const [isPokemonCaught, setIsPokemonCaught] = useState(false);

  useEffect(() => {
    if (pokemonName) {
      dispatch(fetchPokemonDetails(pokemonName));
      checkIfPokemonCaught(pokemonName);
    }
  }, [dispatch, pokemonName]);

  const checkIfPokemonCaught = (baseName: string) => {
    const existingPokemons = Cookies.get("capturedPokemons");
    if (existingPokemons) {
      const parsedPokemons = JSON.parse(existingPokemons);
      const isCaught = parsedPokemons.some(
        (pokemon: { baseName: string }) => pokemon.baseName === baseName
      );
      setIsPokemonCaught(isCaught);
    }
  };

  const handleNamePrompt = async () => {
    if (!pokemonData) return;

    const { value: pokemonNameInput } = await Swal.fire({
      title: "Enter Pokémon name",
      input: "text",
      inputLabel: "Pokémon Name",
      inputValue: pokemonData.name || "",
      inputPlaceholder: "Enter a name for the Pokémon",
    });

    const nameToUse = pokemonNameInput?.trim() || pokemonData.name;

    if (nameToUse) {
      const pokemon = {
        baseName: pokemonData.name,
        name: nameToUse,
        imageUrl: pokemonData.sprites.front_default,
      };

      const existingPokemons = Cookies.get("capturedPokemons");
      const updatedPokemons = existingPokemons
        ? [...JSON.parse(existingPokemons), pokemon]
        : [pokemon];
      Cookies.set("capturedPokemons", JSON.stringify(updatedPokemons));

      Swal.fire({
        title: "Success!",
        text: `Pokémon named ${nameToUse} has been added to your collection.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        dispatch(resetStatus());
        setIsPokemonCaught(true);
        router.push("/my-pokemon");
      });
    } else {
      dispatch(resetStatus());
    }
  };

  const handleCatchPokemon = () => {
    if (pokemonData) {
      dispatch(
        capturePokemon({
          name: pokemonData.name,
          imageUrl: pokemonData.sprites.front_default,
        })
      )
        .unwrap()
        .then((data) => {
          if (data.success) {
            handleNamePrompt();
          } else {
            Swal.fire({
              title: "Oops!",
              text: "You haven’t been lucky this time!",
              icon: "error",
              confirmButtonText: "Try Again",
            }).then(() => {
              dispatch(resetStatus());
            });
          }
        })
        .catch(() => {
          Swal.fire({
            title: "Oops!",
            text: "You haven’t been lucky this time!",
            icon: "error",
            confirmButtonText: "Try Again",
          }).then(() => {
            dispatch(resetStatus());
          });
        });
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!pokemonData) {
    return <div>Pokémon not found.</div>;
  }

  const types =
    pokemonData.types?.map((type) => type.type.name).join(", ") || "Unknown";
  const moves =
    pokemonData.moves?.map((move) => move.move.name).join(", ") || "Unknown";

  return (
    <div className="lg:px-96 md:px-48 px-10 py-10">
      <Link
        href="/"
        className="mb-5 text-green-500 font-bold text-xl font-sans"
      >
        &lt; Back To Home
      </Link>
      <div className="flex flex-col rounded-xl bg-white shadow mt-8">
        <div className="text-white flex justify-center bg-green-300 rounded-t-xl">
          <Image
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
            width={150}
            height={150}
          />
        </div>
        <div className="pt-6 px-6 pb-3">
          <p className="font-sans text-xl font-medium text-blue-gray-900">
            <strong>Name :</strong> {pokemonData.name}
          </p>
        </div>
        <div className="pb-6 px-6 pt-3">
          <p className="font-sans text-sm font-small text-blue-gray-900">
            <strong>Types :</strong> {types}
          </p>
          <p className="font-sans text-sm font-small text-blue-gray-900">
            <strong>Moves :</strong> {moves}
          </p>
        </div>
        <div className="pb-6 px-6 pt-3 flex">
          <button
            onClick={handleCatchPokemon}
            disabled={isPokemonCaught}
            className={`w-full rounded-xl py-4 px-7 text-center font-sans text-sm font-bold uppercase text-white shadow-md ${
              isPokemonCaught
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:shadow-lg hover:shadow-gray-900/20"
            }`}
          >
            {isPokemonCaught ? "Already Caught" : "Catch Pokémon"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
