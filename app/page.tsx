"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { AppDispatch, RootState } from "../store/store";
import { fetchPokemons } from "../store/pokemonSlice";
import Spinner from "../components/Spinner";
import Link from "next/link";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { pokemonList, status, nextUrl } = useSelector(
    (state: RootState) => state.pokemon
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPokemons(nextUrl!));
    }
  }, [dispatch, nextUrl, status]);

  const loadMore = useCallback(() => {
    if (nextUrl && status !== "loading") {
      dispatch(fetchPokemons(nextUrl));
    }
  }, [dispatch, nextUrl, status]);

  useEffect(() => {
    const currentLoader = loader.current;
    if (currentLoader) {
      const options = {
        root: null,
        rootMargin: "20px",
        threshold: 1.0,
      };
      const handleIntersect: IntersectionObserverCallback = (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      };
      observer.current = new IntersectionObserver(handleIntersect, options);
      observer.current.observe(currentLoader);
      return () => {
        if (observer.current && currentLoader) {
          observer.current.unobserve(currentLoader);
        }
      };
    }
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 p-10">
        {pokemonList.map((pokemon) => (
          <div className="flex flex-col rounded-xl bg-white shadow">
            <div className="text-white flex justify-center bg-green-300 rounded-t-xl">
              <Image
                src={pokemon.imageUrl || "/placeholder.png"}
                alt={`${pokemon.name} pokemon image`}
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
              <Link
                href={`/${pokemon.name}`}
                className="w-full rounded-xl bg-green-500 py-4 px-7 text-center font-sans text-sm font-bold uppercase text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20"
              >
                See Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div ref={loader} className="my-4">
        {status === "loading" && <Spinner />}
      </div>
    </>
  );
}
