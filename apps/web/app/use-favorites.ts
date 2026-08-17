"use client";

import { useEffect, useState } from "react";
import { schools } from "@compario/data";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage
      .getItem("compario-favorites")
      ?.split(",")
      .filter((id) => schools.some((school) => school.id === id)) ?? [];
    setFavoriteIds([...new Set(savedFavorites)]);
    setFavoritesLoaded(true);
  }, []);

  useEffect(() => {
    if (favoritesLoaded) {
      localStorage.setItem("compario-favorites", favoriteIds.join(","));
    }
  }, [favoriteIds, favoritesLoaded]);

  const toggleFavorite = (id: string) =>
    setFavoriteIds((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );

  const favoriteSchools = favoriteIds.flatMap((id) => {
    const school = schools.find((candidate) => candidate.id === id);
    return school ? [school] : [];
  });

  return { favoriteIds, favoriteSchools, favoritesLoaded, toggleFavorite };
}
