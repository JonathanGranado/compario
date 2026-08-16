"use client";

import { useMemo, useState } from "react";
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
  | "directCost"
  | "departures";

export default function Home() {
  const [query, setQuery] = useState("");
  const [residency, setResidency] = useState<"resident" | "nonResident">("nonResident");
  const [weights, setWeights] = useState(initialWeights);
  const [selectedIds, setSelectedIds] = useState(["sccombku", "ucb"]);
  const [sortBy, setSortBy] = useState<SortOption>("fit");

  const ranked = useMemo(
    () =>
      schools
        .filter((school) =>
          `${school.name} ${school.city} ${school.state}`.toLowerCase().includes(query.toLowerCase()),
        )
        .map((school) => ({
          ...school,
          score: scoreSchool(school, schools, weights, residency),
        }))
        .sort((a, b) => {
          const boardValue = (
            school: typeof a,
            field: "partOneFirstTime" | "partTwoFirstTime" | "partThreeFirstTime" | "ultimatePassRate",
          ) => school.boardPerformance?.[field] ?? -1;
          const directCost = (school: typeof a) =>
            school.directExpenses[residency].reduce((total, amount) => total + amount, 0);

          if (sortBy === "partOne") return boardValue(b, "partOneFirstTime") - boardValue(a, "partOneFirstTime");
          if (sortBy === "partTwo") return boardValue(b, "partTwoFirstTime") - boardValue(a, "partTwoFirstTime");
          if (sortBy === "partThree") return boardValue(b, "partThreeFirstTime") - boardValue(a, "partThreeFirstTime");
          if (sortBy === "ultimate") return boardValue(b, "ultimatePassRate") - boardValue(a, "ultimatePassRate");
          if (sortBy === "directCost") return directCost(a) - directCost(b);
          if (sortBy === "departures") return (a.departureRate.value ?? Number.POSITIVE_INFINITY) - (b.departureRate.value ?? Number.POSITIVE_INFINITY);
          return (b.score ?? -1) - (a.score ?? -1);
        }),
    [query, residency, sortBy, weights],
  );

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

  const fourYearDirectCost = (school: (typeof schools)[number]) =>
    school.directExpenses[residency].reduce((total, amount) => total + amount, 0);

  const estimatedCostWithLiving = (school: (typeof schools)[number]) => {
    const living = school.nineMonthLivingExpenses.value;
    return living === null ? null : fourYearDirectCost(school) + living * 4;
  };

  return (
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
                  <th scope="row">Average cumulative GPA</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.averageGpa}</td>)}
                </tr>
                <tr>
                  <th scope="row">Average science GPA</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.scienceGpa ?? "Not published"}</td>)}
                </tr>
                <tr>
                  <th scope="row">OAT policy</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.oatPolicy}</td>)}
                </tr>
                <tr>
                  <th scope="row">Average OAT</th>
                  {selectedSchools.map((school) => <td key={school.id}>{school.admissions.averageOat}</td>)}
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
        <label className="sort-control">
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
            <option value="fit">Overall fit score</option>
            <option value="partOne">Part I first-time pass rate</option>
            <option value="partTwo">Part II first-time pass rate</option>
            <option value="partThree">Part III first-time pass rate</option>
            <option value="ultimate">Ultimate all-parts pass rate</option>
            <option value="directCost">Lowest four-year direct cost</option>
            <option value="departures">Lowest students-leaving rate</option>
          </select>
        </label>
      </div>

      <section className="grid">
        {ranked.map((school, index) => (
          <article className="card" key={school.id}>
            <div className="rank"><span>#{index + 1}</span><strong>{school.score ?? "--"}</strong><small>fit score</small></div>
            <div className="card-main">
              <div className="card-toolbar">
                <p className="code">{school.ascoCode}</p>
                <button
                  type="button"
                  className={selectedIds.includes(school.id) ? "compare-button selected" : "compare-button"}
                  onClick={() => toggleSchool(school.id)}
                  disabled={!selectedIds.includes(school.id) && selectedIds.length === 3}
                >
                  {selectedIds.includes(school.id) ? "Selected" : "Compare"}
                </button>
              </div>
              <h3><a href={school.programUrl}>{school.name}</a></h3>
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
                <div><dt>Avg. cumulative GPA</dt><dd>{school.admissions.averageGpa}</dd></div>
                <div><dt>Avg. science GPA</dt><dd>{school.admissions.scienceGpa ?? "Not published"}</dd></div>
                <div><dt>Average OAT</dt><dd>{school.admissions.averageOat}</dd></div>
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
  );
}
