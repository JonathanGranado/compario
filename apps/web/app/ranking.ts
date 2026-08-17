import {
  type ComparisonWeights,
  type OptometrySchool,
  schools,
  scoreSchool,
} from "@compario/data";

export type SortOption =
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

export const sortOptions: ReadonlyArray<{ value: SortOption; label: string }> = [
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

export const initialWeights: ComparisonWeights = {
  tuition: 5,
  boardPassRate: 5,
  departures: 4,
  livingExpenses: 3,
};

export type RankedSchool = OptometrySchool & { score: number | null };

export function rankSchools(
  candidates: OptometrySchool[],
  weights: ComparisonWeights,
  residency: "resident" | "nonResident",
  sortBy: SortOption,
  secondarySortBy: SortOption | "none",
): RankedSchool[] {
  const rankedCandidates = candidates.map((school) => ({
    ...school,
    score: scoreSchool(school, schools, weights, residency),
  }));

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
    const values = rankedCandidates.flatMap((candidate) => {
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

  return rankedCandidates.sort((a, b) => {
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
}
