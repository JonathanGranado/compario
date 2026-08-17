"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ComparisonWeights } from "@compario/data";
import {
  initialWeights,
  rankSchools,
  sortOptions,
  type SortOption,
} from "../ranking";
import { useFavorites } from "../use-favorites";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function FavoritesPage() {
  const [residency, setResidency] = useState<"resident" | "nonResident">("nonResident");
  const [weights, setWeights] = useState(initialWeights);
  const [sortBy, setSortBy] = useState<SortOption>("fit");
  const [secondarySortBy, setSecondarySortBy] = useState<SortOption | "none">("none");
  const { favoriteSchools, favoritesLoaded, toggleFavorite } = useFavorites();

  const ranked = useMemo(
    () => rankSchools(favoriteSchools, weights, residency, sortBy, secondarySortBy),
    [favoriteSchools, residency, secondarySortBy, sortBy, weights],
  );

  const updateWeight = (key: keyof ComparisonWeights, value: string) =>
    setWeights((current) => ({ ...current, [key]: Number(value) }));
  const directCost = (school: (typeof ranked)[number]) =>
    school.directExpenses[residency].reduce((total, amount) => total + amount, 0);

  return (
    <main className="favorites-page">
      <Link className="back-link" href="/">Back to all schools</Link>
      <header className="favorites-hero">
        <p className="eyebrow">Your private shortlist</p>
        <h1>Rank only the schools you love.</h1>
        <p className="lede">
          Adjust your priorities, combine two criteria, and compare your saved programs
          without the rest of the list getting in the way.
        </p>
      </header>

      {!favoritesLoaded ? (
        <p className="favorites-empty-state">Loading your favorites...</p>
      ) : favoriteSchools.length === 0 ? (
        <section className="favorites-empty-state">
          <h2>Your shortlist is empty.</h2>
          <p>Favorite schools from the main comparison page, then return here to rank them.</p>
          <Link className="external-button" href="/#programs">Browse programs</Link>
        </section>
      ) : (
        <>
          <section className="controls favorites-ranking-controls" aria-label="Favorite ranking controls">
            <fieldset>
              <legend>Tuition status</legend>
              <label><input type="radio" checked={residency === "resident"} onChange={() => setResidency("resident")} /> Resident</label>
              <label><input type="radio" checked={residency === "nonResident"} onChange={() => setResidency("nonResident")} /> Non-resident</label>
            </fieldset>
            <div className="weights">
              {([
                ["tuition", "Tuition"],
                ["boardPassRate", "Ultimate boards"],
                ["departures", "Departures"],
                ["livingExpenses", "Living costs"],
              ] as const).map(([key, label]) => (
                <label key={key}>
                  {label}: {weights[key]}
                  <input type="range" min="0" max="5" value={weights[key]} onChange={(event) => updateWeight(key, event.target.value)} />
                </label>
              ))}
            </div>
          </section>

          <div className="favorites-results-heading">
            <div>
              <p className="eyebrow">Shortlist ranking</p>
              <h2>{ranked.length} favorite{ranked.length === 1 ? "" : "s"}</h2>
            </div>
            <div className="sort-controls">
              <label className="sort-control">
                First criterion
                <select
                  value={sortBy}
                  onChange={(event) => {
                    const nextSort = event.target.value as SortOption;
                    setSortBy(nextSort);
                    if (secondarySortBy === nextSort) setSecondarySortBy("none");
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="sort-control">
                Combine with
                <select
                  value={secondarySortBy}
                  onChange={(event) => setSecondarySortBy(event.target.value as SortOption | "none")}
                >
                  <option value="none">No second criterion</option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === sortBy}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <section className="favorites-ranking-list">
            {ranked.map((school, index) => (
              <article key={school.id} className="favorite-ranking-card">
                <div className="favorite-rank">
                  <span>#{index + 1}</span>
                  <strong>{school.score ?? "--"}</strong>
                  <small>fit score</small>
                </div>
                <div>
                  <p className="code">{school.ascoCode}</p>
                  <h3><Link href={`/schools/${school.id}`}>{school.name}</Link></h3>
                  <p>{school.city}, {school.state}</p>
                  <dl>
                    <div><dt>Four-year direct cost</dt><dd>{money.format(directCost(school))}</dd></div>
                    <div><dt>2025 average GPA</dt><dd>{school.enteringClass?.averageGpa ?? "N/A"}</dd></div>
                    <div><dt>2025 OAT AA / TS</dt><dd>{school.enteringClass?.oatAcademicAverage ?? "N/A"} / {school.enteringClass?.oatTotalScience ?? "N/A"}</dd></div>
                    <div><dt>Ultimate board rate</dt><dd>{school.boardPerformance ? `${school.boardPerformance.ultimatePassRate}%` : "No cohort"}</dd></div>
                    <div><dt>Students leaving</dt><dd>{school.departureRate.value === null ? "N/A" : `${school.departureRate.value}%`}</dd></div>
                  </dl>
                  <button className="remove-favorite-button" type="button" onClick={() => toggleFavorite(school.id)}>
                    Remove from favorites
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
