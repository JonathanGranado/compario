"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ComparisonWeights, schools, scoreSchool } from "@compario/data";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const initialWeights: ComparisonWeights = {
  tuition: 5,
  boardPassRate: 5,
  departures: 4,
  livingExpenses: 3,
};

const boardRows = [
  ["Part I first-time", "partOneFirstTime"],
  ["Part II first-time", "partTwoFirstTime"],
  ["Part III first-time", "partThreeFirstTime"],
  ["Ultimate all-parts", "ultimatePassRate"],
] as const;

type SortOption =
  | "fit"
  | "partOne"
  | "partTwo"
  | "partThree"
  | "ultimate"
  | "gpa"
  | "oatAcademic"
  | "oatScience"
  | "directCost"
  | "departures";

const sortOptions: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "fit", label: "Overall fit score" },
  { value: "partOne", label: "Highest Part I first-time pass rate" },
  { value: "partTwo", label: "Highest Part II first-time pass rate" },
  { value: "partThree", label: "Highest Part III first-time pass rate" },
  { value: "ultimate", label: "Highest ultimate all-parts pass rate" },
  { value: "gpa", label: "Lowest entering-class average GPA" },
  { value: "oatAcademic", label: "Lowest entering-class OAT AA" },
  { value: "oatScience", label: "Lowest entering-class OAT TS" },
  { value: "directCost", label: "Lowest four-year direct cost" },
  { value: "departures", label: "Lowest students-leaving rate" },
];

type ThemeOption =
  | "botanical"
  | "moonlight"
  | "sherbet"
  | "cozy-witch-cafe"
  | "moonlit-cottage"
  | "autumn-stardust";

const themeOptions: ReadonlyArray<{ value: ThemeOption; label: string; description: string }> = [
  { value: "botanical", label: "Botanical", description: "Leafy and calm" },
  { value: "moonlight", label: "Moonlight", description: "Lavender and dreamy" },
  { value: "sherbet", label: "Sherbet", description: "Peachy and bright" },
  { value: "cozy-witch-cafe", label: "Cozy Witch Cafe", description: "Cinnamon and candlelight" },
  { value: "moonlit-cottage", label: "Moonlit Cottage", description: "Dark forest and potions" },
  { value: "autumn-stardust", label: "Autumn Stardust", description: "Dreamy rose and gold" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [residency, setResidency] = useState<"resident" | "nonResident">("nonResident");
  const [weights, setWeights] = useState(initialWeights);
  const [selectedIds, setSelectedIds] = useState(["sccombku", "ucb"]);
  const [sortBy, setSortBy] = useState<SortOption>("fit");
  const [secondarySortBy, setSecondarySortBy] = useState<SortOption | "none">("none");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<ThemeOption>("botanical");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage
      .getItem("compario-favorites")
      ?.split(",")
      .filter((id) => schools.some((school) => school.id === id)) ?? [];
    const savedTheme = localStorage.getItem("compario-theme");

    setFavoriteIds([...new Set(savedFavorites)]);
    if (themeOptions.some((option) => option.value === savedTheme)) {
      setTheme(savedTheme as ThemeOption);
    }
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("compario-theme", theme);
  }, [preferencesLoaded, theme]);

  useEffect(() => {
    if (preferencesLoaded) {
      localStorage.setItem("compario-favorites", favoriteIds.join(","));
    }
  }, [favoriteIds, preferencesLoaded]);

  const ranked = useMemo(() => {
    const candidates = schools
        .filter((school) =>
          `${school.ascoCode} ${school.name} ${school.city} ${school.state}`.toLowerCase().includes(query.toLowerCase()),
        )
        .map((school) => ({
          ...school,
          score: scoreSchool(school, schools, weights, residency),
        }));
    type RankedSchool = (typeof candidates)[number];

    const metricValue = (school: RankedSchool, option: SortOption): number | null => {
      if (option === "fit") return school.score;
      if (option === "partOne") return school.boardPerformance?.partOneFirstTime ?? null;
      if (option === "partTwo") return school.boardPerformance?.partTwoFirstTime ?? null;
      if (option === "partThree") return school.boardPerformance?.partThreeFirstTime ?? null;
      if (option === "ultimate") return school.boardPerformance?.ultimatePassRate ?? null;
      if (option === "gpa") return school.enteringClass?.averageGpa ?? null;
      if (option === "oatAcademic") return school.enteringClass?.oatAcademicAverage ?? null;
      if (option === "oatScience") return school.enteringClass?.oatTotalScience ?? null;
      if (option === "departures") return school.departureRate.value;
      return school.directExpenses[residency].reduce((total, amount) => total + amount, 0);
    };
    const lowerIsBetter = (option: SortOption) =>
      option === "oatAcademic" ||
      option === "oatScience" ||
      option === "gpa" ||
      option === "directCost" ||
      option === "departures";
    const desirability = (school: RankedSchool, option: SortOption) => {
      const value = metricValue(school, option);
      if (value === null) return null;
      const values = candidates.flatMap((candidate) => {
        const candidateValue = metricValue(candidate, option);
        return candidateValue === null ? [] : [candidateValue];
      });
      const minimum = Math.min(...values);
      const maximum = Math.max(...values);
      if (minimum === maximum) return 1;
      return lowerIsBetter(option)
        ? (maximum - value) / (maximum - minimum)
        : (value - minimum) / (maximum - minimum);
    };

    return candidates.sort((a, b) => {
      const primaryA = desirability(a, sortBy);
      const primaryB = desirability(b, sortBy);
      if (secondarySortBy === "none") {
        if (primaryA === null) return primaryB === null ? a.name.localeCompare(b.name) : 1;
        if (primaryB === null) return -1;
        return primaryB - primaryA || a.name.localeCompare(b.name);
      }

      const secondaryA = desirability(a, secondarySortBy);
      const secondaryB = desirability(b, secondarySortBy);
      const combinedA = primaryA === null || secondaryA === null ? null : primaryA + secondaryA;
      const combinedB = primaryB === null || secondaryB === null ? null : primaryB + secondaryB;
      if (combinedA === null) return combinedB === null ? a.name.localeCompare(b.name) : 1;
      if (combinedB === null) return -1;
      const primaryDifference =
        primaryA === null || primaryB === null ? 0 : primaryB - primaryA;
      return combinedB - combinedA || primaryDifference || a.name.localeCompare(b.name);
    });
  }, [query, residency, secondarySortBy, sortBy, weights]);

  const updateWeight = (key: keyof ComparisonWeights, value: string) =>
    setWeights((current) => ({ ...current, [key]: Number(value) }));

  const selectedSchools = selectedIds.flatMap((id) => {
    const school = schools.find((candidate) => candidate.id === id);
    return school ? [school] : [];
  });

  const toggleSchool = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : current.length < 3
          ? [...current, id]
          : current,
    );

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

  const fourYearDirectCost = (school: (typeof schools)[number]) =>
    school.directExpenses[residency].reduce((total, amount) => total + amount, 0);

  const estimatedCostWithLiving = (school: (typeof schools)[number]) => {
    const living = school.nineMonthLivingExpenses.value;
    return living === null ? null : fourYearDirectCost(school) + living * 4;
  };

  return (
    <div className="app-shell">
    <main>
      <header className="hero">
        <p className="eyebrow">Evidence before rankings</p>
        <h1>Find the optometry program that fits your priorities.</h1>
        <p className="lede">
          Compare all 25 programs in the 2025-26 ASCO report. Every populated number links to
          its reporting period and source.
        </p>
        <nav className="jump-nav" aria-label="Page sections">
          <a href="#comparison">Compare schools</a>
          <a href="#programs">Browse programs</a>
        </nav>
      </header>

      <section className="notice">
        <strong>Costs expanded:</strong> Four years of tuition, required fees, books, and
        instruments are loaded from ASCO table 3.7. Living-inclusive totals are estimates using
        the current nine-month budget for each of four years.
      </section>

      <section className="controls" aria-label="Comparison controls">
        <label className="search">
          Search programs or locations
          <input
            type="search"
            placeholder="Try California or Boston"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
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

      <section className="comparison" id="comparison" aria-labelledby="comparison-title">
        <div className="comparison-heading">
          <div>
            <p className="eyebrow">Side by side</p>
            <h2 id="comparison-title">Compare up to three schools</h2>
          </div>
          <div className="comparison-actions">
            <span>{selectedSchools.length}/3 selected</span>
            <button type="button" onClick={() => setSelectedIds([])}>Clear</button>
          </div>
        </div>
        {selectedSchools.length === 0 ? (
          <p className="empty-comparison">Choose schools from the program cards below.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  {selectedSchools.map((school) => (
                    <th scope="col" key={school.id}>
                      <span className="code">{school.ascoCode}</span>
                      {school.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Location</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.city}, {school.state}</td>)}
                </tr>
                {["Year 1", "Year 2", "Year 3", "Year 4"].map((label, year) => (
                  <tr key={label}>
                    <th scope="row">{label} direct expenses</th>
                    {selectedSchools.map((school) => <td key={school.id}>{money.format(school.directExpenses[residency][year])}</td>)}
                  </tr>
                ))}
                <tr className="total-row">
                  <th scope="row">Four-year direct cost</th>
                  {selectedSchools.map((school) => <td key={school.id}>{money.format(fourYearDirectCost(school))}</td>)}
                </tr>
                <tr>
                  <th scope="row">Est. four-year cost with living</th>
                  {selectedSchools.map((school) => {
                    const total = estimatedCostWithLiving(school);
                    return <td key={school.id}>{total === null ? "Not available" : money.format(total)}</td>;
                  })}
                </tr>
                <tr>
                  <th scope="row">Students leaving</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.departureRate.value === null ? "N/A" : `${school.departureRate.value}%`}</td>)}
                </tr>
                <tr>
                  <th scope="row">Average graduate debt</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.averageGraduateDebt.value === null ? "N/A" : money.format(school.averageGraduateDebt.value)}</td>)}
                </tr>
                {boardRows.map(([label, field]) => (
                  <tr key={field}>
                    <th scope="row">{label}</th>
                    {selectedSchools.map((school) => (
                      <td key={school.id}>
                        {school.boardPerformance === null
                          ? "No graduating cohort"
                          : `${school.boardPerformance[field]}%`}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">Remediation policy</th>
                  {selectedSchools.map((school) => <td className="pending" key={school.id}>Pending handbook review</td>)}
                </tr>
                <tr className="section-row">
                  <th scope="row">Admissions</th>
                  {selectedSchools.map((school) => <td key={school.id}></td>)}
                </tr>
                <tr>
                  <th scope="row">Minimum GPA</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.minimumGpa}</td>)}
                </tr>
                <tr>
                  <th scope="row">School-profile cumulative GPA</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.averageGpa}</td>)}
                </tr>
                <tr>
                  <th scope="row">School-profile science GPA</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.scienceGpa ?? "Not published"}</td>)}
                </tr>
                <tr>
                  <th scope="row">2025 ASCO entering-class average GPA</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.enteringClass?.averageGpa ?? "Not reported"}</td>)}
                </tr>
                <tr>
                  <th scope="row">OAT policy</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.oatPolicy}</td>)}
                </tr>
                <tr>
                  <th scope="row">School-profile OAT Academic Average (AA)</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.averageOat}</td>)}
                </tr>
                <tr>
                  <th scope="row">School-profile OAT Total Science (TS)</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.scienceOat ?? "Not published"}</td>)}
                </tr>
                <tr>
                  <th scope="row">2025 ASCO entering-class OAT AA</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.enteringClass?.oatAcademicAverage ?? "Not reported"}</td>)}
                </tr>
                <tr>
                  <th scope="row">2025 ASCO entering-class OAT TS</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.enteringClass?.oatTotalScience ?? "Not reported"}</td>)}
                </tr>
                <tr>
                  <th scope="row">Application deadline</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.deadline}</td>)}
                </tr>
                <tr>
                  <th scope="row">Class size</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.classSize}</td>)}
                </tr>
                <tr>
                  <th scope="row">Acceptance / enrollment</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.acceptance}</td>)}
                </tr>
                <tr>
                  <th scope="row">Interview</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.interview}</td>)}
                </tr>
                <tr>
                  <th scope="row">Shadowing</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.shadowing}</td>)}
                </tr>
                <tr>
                  <th scope="row">Prerequisites</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.prerequisites}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <p className="comparison-note">
          Direct expenses are school-reported and exclude living costs. The living estimate is
          not inflation-adjusted and does not include financing costs.
        </p>
      </section>

      <div className="results-heading" id="programs">
        <div>
          <h2>{ranked.length} programs</h2>
          <p>Fit scores only use available metrics with a non-zero weight.</p>
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
          {secondarySortBy !== "none" && (
            <p className="sort-note">Both criteria are balanced equally; schools missing either value rank last.</p>
          )}
        </div>
      </div>

      <section className="grid">
        {ranked.map((school, index) => (
          <article className="card" key={school.id}>
            <div className="rank"><span>#{index + 1}</span><strong>{school.score ?? "--"}</strong><small>fit score</small></div>
            <div className="card-main">
              <div className="card-toolbar">
                <p className="code">{school.ascoCode}</p>
                <div className="card-actions">
                  <button
                    type="button"
                    className={favoriteIds.includes(school.id) ? "favorite-button selected" : "favorite-button"}
                    onClick={() => toggleFavorite(school.id)}
                    aria-pressed={favoriteIds.includes(school.id)}
                    disabled={!preferencesLoaded}
                  >
                    {favoriteIds.includes(school.id) ? "Favorited" : "Favorite"}
                  </button>
                  <button
                    type="button"
                    className={selectedIds.includes(school.id) ? "compare-button selected" : "compare-button"}
                    onClick={() => toggleSchool(school.id)}
                    disabled={!selectedIds.includes(school.id) && selectedIds.length === 3}
                  >
                    {selectedIds.includes(school.id) ? "Selected" : "Compare"}
                  </button>
                </div>
              </div>
              <h3><Link href={`/schools/${school.id}`}>{school.name}</Link></h3>
              <p>{school.city}, {school.state}</p>
              <dl>
                <div><dt>Four-year direct cost</dt><dd>{money.format(fourYearDirectCost(school))}</dd></div>
                <div><dt>Est. with living</dt><dd>{estimatedCostWithLiving(school) === null ? "Not available" : money.format(estimatedCostWithLiving(school)!)}</dd></div>
                <div><dt>9-month living budget</dt><dd>{school.nineMonthLivingExpenses.value === null ? "Not reported" : money.format(school.nineMonthLivingExpenses.value)}</dd></div>
                <div><dt>Students leaving</dt><dd>{school.departureRate.value === null ? "Not available" : `${school.departureRate.value}%`}</dd></div>
                <div><dt>Average graduate debt</dt><dd>{school.averageGraduateDebt.value === null ? "Not available" : money.format(school.averageGraduateDebt.value)}</dd></div>
                {school.boardPerformance === null ? (
                  <div><dt>Board performance</dt><dd>No graduating cohort</dd></div>
                ) : (
                  <>
                    <div><dt>Part I first-time</dt><dd>{school.boardPerformance.partOneFirstTime}%</dd></div>
                    <div><dt>Part II first-time</dt><dd>{school.boardPerformance.partTwoFirstTime}%</dd></div>
                    <div><dt>Part III first-time</dt><dd>{school.boardPerformance.partThreeFirstTime}%</dd></div>
                    <div><dt>Ultimate all-parts</dt><dd>{school.boardPerformance.ultimatePassRate}%</dd></div>
                  </>
                )}
                <div><dt>Admissions deadline</dt><dd>{school.admissions.deadline}</dd></div>
                <div><dt>Class size</dt><dd>{school.admissions.classSize}</dd></div>
                <div><dt>Acceptance / enrollment</dt><dd>{school.admissions.acceptance}</dd></div>
                <div><dt>School-profile GPA</dt><dd>{school.admissions.averageGpa}</dd></div>
                <div><dt>School-profile science GPA</dt><dd>{school.admissions.scienceGpa ?? "Not published"}</dd></div>
                <div><dt>2025 ASCO average GPA</dt><dd>{school.enteringClass?.averageGpa ?? "Not reported"}</dd></div>
                <div><dt>School-profile OAT AA</dt><dd>{school.admissions.averageOat}</dd></div>
                <div><dt>School-profile OAT TS</dt><dd>{school.admissions.scienceOat ?? "Not published"}</dd></div>
                <div><dt>2025 ASCO OAT AA</dt><dd>{school.enteringClass?.oatAcademicAverage ?? "Not reported"}</dd></div>
                <div><dt>2025 ASCO OAT TS</dt><dd>{school.enteringClass?.oatTotalScience ?? "Not reported"}</dd></div>
                <div><dt>Remediation</dt><dd className="pending">Handbook review pending</dd></div>
              </dl>
              <a className="source" href={school.tuition.source.url}>ASCO costs and outcomes</a>
              {school.boardPerformance && <>{" | "}<a className="source" href={school.boardPerformance.source.url}>NBEO 2024-25 report</a></>}
              {" | "}<a className="source" href={school.admissions.sourceUrl}>Official admissions source</a>
            </div>
          </article>
        ))}
      </section>
    </main>
      <aside className="favorites-panel" aria-label="Favorites and appearance">
        <section>
          <p className="eyebrow">Your shortlist</p>
          <div className="favorites-heading">
            <h2>Favorites</h2>
            <span>{favoriteSchools.length}</span>
          </div>
          {favoriteSchools.length === 0 ? (
            <p className="favorites-empty">Favorite schools from any card to keep them close.</p>
          ) : (
            <ul className="favorites-list">
              {favoriteSchools.map((school) => (
                <li key={school.id}>
                  <Link href={`/schools/${school.id}`}>
                    <span className="code">{school.ascoCode}</span>
                    <strong>{school.name}</strong>
                    <small>{school.city}, {school.state}</small>
                  </Link>
                  <button type="button" onClick={() => toggleFavorite(school.id)} aria-label={`Remove ${school.name} from favorites`}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="theme-picker">
          <p className="eyebrow">Make it yours</p>
          <h2>Theme</h2>
          <div className="theme-options">
            {themeOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={theme === option.value ? "selected" : ""}
                onClick={() => setTheme(option.value)}
                aria-pressed={theme === option.value}
                disabled={!preferencesLoaded}
              >
                <span className={`theme-swatch ${option.value}`} />
                <span><strong>{option.label}</strong><small>{option.description}</small></span>
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
