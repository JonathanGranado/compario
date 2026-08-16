export type MetricSource = {
  label: string;
  url: string;
  reportingPeriod: string;
  retrievedAt: string;
  status: "pending" | "verified";
  note?: string;
};

export type SchoolMetric = {
  value: number | null;
  source: MetricSource;
};

export type TuitionMetric = {
  resident: number;
  nonResident: number;
  source: MetricSource;
};

export type DirectExpensesMetric = {
  resident: [number, number, number, number];
  nonResident: [number, number, number, number];
  source: MetricSource;
};

export type BoardPerformance = {
  candidates: number;
  partOneFirstTime: number;
  partTwoFirstTime: number;
  partThreeFirstTime: number;
  ultimatePassRate: number;
  source: MetricSource;
};

export type RemediationPolicy = {
  summary: string;
  allowsCourseRemediation: boolean | null;
  allowsRepeatYear: boolean | null;
  source: MetricSource;
};

export type OptometrySchool = {
  id: string;
  ascoCode: string;
  name: string;
  city: string;
  state: string;
  programUrl: string;
  accreditationStatus: string;
  tuition: TuitionMetric;
  directExpenses: DirectExpensesMetric;
  departureRate: SchoolMetric;
  nineMonthLivingExpenses: SchoolMetric;
  averageGraduateDebt: SchoolMetric;
  boardPerformance: BoardPerformance | null;
  remediation: RemediationPolicy;
  admissions: AdmissionsProfile;
};

export type ComparisonWeights = {
  tuition: number;
  boardPassRate: number;
  departures: number;
  livingExpenses: number;
};

const reportUrl =
  "https://optometriceducation.org/wp-content/uploads/2026/05/2025-26-ASCO-Annual-Student-Data-Report.pdf";

const ascoSource = (
  table: string,
  reportingPeriod: string,
  note?: string,
): MetricSource => ({
  label: `ASCO Annual Student Data Report, table ${table}`,
  url: reportUrl,
  reportingPeriod,
  retrievedAt: "2026-08-14",
  status: "verified",
  note,
});

const pendingSource = (label: string, url: string): MetricSource => ({
  label,
  url,
  reportingPeriod: "Pending collection",
  retrievedAt: "2026-08-14",
  status: "pending",
});

type SchoolSeed = {
  code: string;
  name: string;
  city: string;
  state: string;
  url: string;
  residentTuition: number;
  nonResidentTuition: number;
  departureRate: number | null;
  livingExpenses: number | null;
  debt: number | null;
};

const seeds: SchoolSeed[] = [
  { code: "AZCOPT", name: "Arizona College of Optometry, Midwestern University", city: "Glendale", state: "AZ", url: "https://www.midwestern.edu/academics/degrees-programs/doctor-optometry-program/arizona-college-optometry", residentTuition: 50037, nonResidentTuition: 50037, departureRate: 1.1, livingExpenses: 36036, debt: 185753 },
  { code: "CCO", name: "Chicago College of Optometry, Midwestern University", city: "Downers Grove", state: "IL", url: "https://www.midwestern.edu/cco", residentTuition: 49634, nonResidentTuition: 49634, departureRate: 1.3, livingExpenses: 29275, debt: 265473 },
  { code: "IAUPR", name: "Inter American University of Puerto Rico School of Optometry", city: "Bayamon", state: "PR", url: "https://optonet.inter.edu", residentTuition: 31000, nonResidentTuition: 33000, departureRate: 3.9, livingExpenses: 21541, debt: 135628 },
  { code: "ICO", name: "Illinois College of Optometry", city: "Chicago", state: "IL", url: "https://www.ico.edu", residentTuition: 51651, nonResidentTuition: 51651, departureRate: 2.8, livingExpenses: 25290, debt: 229018 },
  { code: "IUSO", name: "Indiana University School of Optometry", city: "Bloomington", state: "IN", url: "https://optometry.iu.edu", residentTuition: 35278, nonResidentTuition: 47814, departureRate: 4.2, livingExpenses: 27337, debt: 158067 },
  { code: "KYCO", name: "University of Pikeville Kentucky College of Optometry", city: "Pikeville", state: "KY", url: "https://www.upike.edu/optometry", residentTuition: 48750, nonResidentTuition: 48750, departureRate: 3.0, livingExpenses: 29138, debt: 153141 },
  { code: "MCO", name: "Michigan College of Optometry at Ferris State University", city: "Big Rapids", state: "MI", url: "https://www.ferris.edu/optometry", residentTuition: 37544, nonResidentTuition: 37544, departureRate: 0, livingExpenses: 13989, debt: 109532 },
  { code: "MCPHS", name: "MCPHS School of Optometry", city: "Worcester", state: "MA", url: "https://www.mcphs.edu/academics/school-of-optometry/optometry", residentTuition: 53760, nonResidentTuition: 53760, departureRate: 3.1, livingExpenses: 23764, debt: 180330 },
  { code: "NECO", name: "New England College of Optometry", city: "Boston", state: "MA", url: "https://www.neco.edu", residentTuition: 49852, nonResidentTuition: 49852, departureRate: 1.6, livingExpenses: 28190, debt: 144327 },
  { code: "NOVA", name: "Nova Southeastern University College of Optometry", city: "Fort Lauderdale", state: "FL", url: "https://optometry.nova.edu", residentTuition: 43212, nonResidentTuition: 43212, departureRate: 1.2, livingExpenses: 38731, debt: 209872 },
  { code: "NSUOCO", name: "Northeastern State University Oklahoma College of Optometry", city: "Tahlequah", state: "OK", url: "https://optometry.nsuok.edu", residentTuition: 22196, nonResidentTuition: 43156, departureRate: 0.9, livingExpenses: 24741, debt: 141568 },
  { code: "OSU", name: "The Ohio State University College of Optometry", city: "Columbus", state: "OH", url: "https://optometry.osu.edu", residentTuition: 29442, nonResidentTuition: 50498, departureRate: 1.1, livingExpenses: 20498, debt: 134971 },
  { code: "PCO-DREXEL", name: "Pennsylvania College of Optometry at Drexel University", city: "Elkins Park", state: "PA", url: "https://drexel.edu/medicine/academics/graduate-school/optometry", residentTuition: 50058, nonResidentTuition: 50058, departureRate: 3.9, livingExpenses: 25580, debt: 185242 },
  { code: "PUCO", name: "Pacific University College of Optometry", city: "Forest Grove", state: "OR", url: "https://www.pacificu.edu/optometry", residentTuition: 51780, nonResidentTuition: 51780, departureRate: 2.7, livingExpenses: 21067, debt: 137411 },
  { code: "RMUCOM", name: "Rocky Mountain University College of Optometric Medicine", city: "Provo", state: "UT", url: "https://rm.edu/optometry", residentTuition: 33792, nonResidentTuition: 33792, departureRate: 0.8, livingExpenses: 22134, debt: null },
  { code: "SCCOMBKU", name: "Southern California College of Optometry at Marshall B. Ketchum University", city: "Fullerton", state: "CA", url: "https://www.ketchum.edu/optometry/od-admissions", residentTuition: 53250, nonResidentTuition: 53250, departureRate: 0, livingExpenses: 28350, debt: 162575 },
  { code: "SCO", name: "Southern College of Optometry", city: "Memphis", state: "TN", url: "https://www.sco.edu", residentTuition: 32832, nonResidentTuition: 45902, departureRate: 1.1, livingExpenses: 22922, debt: 136449 },
  { code: "SUNY", name: "State University of New York College of Optometry", city: "New York", state: "NY", url: "https://www.sunyopt.edu", residentTuition: 32200, nonResidentTuition: 52700, departureRate: 1.8, livingExpenses: 24650, debt: 100107 },
  { code: "UABSO", name: "University of Alabama at Birmingham School of Optometry", city: "Birmingham", state: "AL", url: "https://www.uab.edu/optometry", residentTuition: 31656, nonResidentTuition: 54012, departureRate: 0.5, livingExpenses: 26692, debt: 151459 },
  { code: "UCB", name: "UC Berkeley Herbert Wertheim School of Optometry and Vision Science", city: "Berkeley", state: "CA", url: "https://optometry.berkeley.edu", residentTuition: 38832, nonResidentTuition: 50877, departureRate: 1.6, livingExpenses: 34698, debt: 103413 },
  { code: "UDMSO", name: "University of Detroit Mercy School of Optometry", city: "Novi", state: "MI", url: "https://optometry.udmercy.edu", residentTuition: 45500, nonResidentTuition: 45500, departureRate: null, livingExpenses: 30893, debt: null },
  { code: "UHCO", name: "University of Houston College of Optometry", city: "Houston", state: "TX", url: "https://www.opt.uh.edu", residentTuition: 26075, nonResidentTuition: 46355, departureRate: 3.0, livingExpenses: 24250, debt: 128300 },
  { code: "UIWRSO", name: "University of the Incarnate Word Rosenberg School of Optometry", city: "San Antonio", state: "TX", url: "https://optometry.uiw.edu", residentTuition: 42900, nonResidentTuition: 42900, departureRate: 19.1, livingExpenses: 31090, debt: 225911 },
  { code: "UMSL", name: "University of Missouri-St. Louis College of Optometry", city: "St. Louis", state: "MO", url: "https://www.umsl.edu/divisions/optometry", residentTuition: 30560, nonResidentTuition: 50464, departureRate: 1.1, livingExpenses: 19979, debt: 181479 },
  { code: "WUCO", name: "Western University of Health Sciences College of Optometry", city: "Pomona", state: "CA", url: "https://www.westernu.edu/optometry", residentTuition: 48618, nonResidentTuition: 48618, departureRate: 6.7, livingExpenses: null, debt: 235713 },
];

const directExpenses: Record<
  string,
  {
    resident: [number, number, number, number];
    nonResident: [number, number, number, number];
  }
> = {
  AZCOPT: { resident: [58610, 52422, 51939, 51237], nonResident: [58610, 52422, 51939, 51237] },
  CCO: { resident: [57348, 55057, 51482, 50682], nonResident: [57348, 55057, 51482, 50682] },
  IAUPR: { resident: [33668, 33580, 32523, 30740], nonResident: [35668, 34580, 32523, 30740] },
  ICO: { resident: [57347, 76536, 65436, 40033], nonResident: [57347, 76536, 65436, 40033] },
  IUSO: { resident: [45246, 40780, 35306, 31758], nonResident: [57782, 53316, 47842, 44294] },
  KYCO: { resident: [48750, 48750, 48750, 48750], nonResident: [48750, 48750, 48750, 48750] },
  MCO: { resident: [42912, 45496, 54762, 44743], nonResident: [42912, 45496, 54762, 44743] },
  MCPHS: { resident: [61777, 61167, 56367, 55873], nonResident: [61777, 61167, 56367, 55873] },
  NECO: { resident: [52047, 50337, 50227, 50227], nonResident: [52047, 50337, 50227, 50227] },
  NOVA: { resident: [55009, 45159, 47461, 45234], nonResident: [55009, 45159, 47461, 45234] },
  NSUOCO: { resident: [31731, 39118, 37814, 29411], nonResident: [52691, 66620, 65316, 50371] },
  OSU: { resident: [40141, 34976, 43480, 42950], nonResident: [61197, 34986, 43495, 42965] },
  "PCO-DREXEL": { resident: [57239, 57189, 52469, 52124], nonResident: [57239, 57189, 52469, 52124] },
  PUCO: { resident: [60018, 54283, 54023, 52353], nonResident: [60018, 54283, 54023, 52353] },
  RMUCOM: { resident: [39102, 54726, 56512, 55545], nonResident: [39102, 54726, 56512, 55545] },
  SCCOMBKU: { resident: [61175, 55274, 53448, 53575], nonResident: [61175, 55274, 53448, 53575] },
  SCO: { resident: [37733, 39895, 29915, 28411], nonResident: [50803, 51884, 46894, 46142] },
  SUNY: { resident: [37538, 37538, 34038, 34038], nonResident: [58038, 58038, 54538, 54538] },
  UABSO: { resident: [43552, 35402, 33662, 22888], nonResident: [65908, 57758, 56018, 37792] },
  UCB: { resident: [51352, 49929, 49032, 42605], nonResident: [63397, 61974, 61077, 54650] },
  UDMSO: { resident: [51930, 52748, 46860, 46200], nonResident: [51930, 52748, 46860, 46200] },
  UHCO: { resident: [29601, 28433, 35280, 35617], nonResident: [49881, 48193, 60760, 62137] },
  UIWRSO: { resident: [49950, 66287, 44579, 29413], nonResident: [49950, 66287, 44579, 29413] },
  UMSL: { resident: [36860, 46300, 40750, 32360], nonResident: [56764, 71180, 65580, 52264] },
  WUCO: { resident: [50458, 49133, 49108, 49438], nonResident: [50458, 49133, 49108, 49438] },
};

const boardSource: MetricSource = {
  label: "NBEO Institutional Yearly Performance Report",
  url: "https://optometriceducation.org/wp-content/uploads/2026/02/Institutional-Report-2025-final.pdf",
  reportingPeriod: "October 1, 2024-September 30, 2025",
  retrievedAt: "2026-08-15",
  status: "verified",
  note:
    "Rates include graduates in the reporting period who attempted all three parts at least once. Ultimate rate is the percentage who passed all three exams.",
};

const boardPerformance: Record<
  string,
  Omit<BoardPerformance, "source">
> = {
  AZCOPT: { candidates: 60, partOneFirstTime: 70, partTwoFirstTime: 90, partThreeFirstTime: 80, ultimatePassRate: 85 },
  CCO: { candidates: 46, partOneFirstTime: 56.52, partTwoFirstTime: 86.96, partThreeFirstTime: 78.26, ultimatePassRate: 80.43 },
  UCB: { candidates: 64, partOneFirstTime: 73.44, partTwoFirstTime: 100, partThreeFirstTime: 73.44, ultimatePassRate: 92.19 },
  ICO: { candidates: 99, partOneFirstTime: 71.72, partTwoFirstTime: 91.92, partThreeFirstTime: 80.81, ultimatePassRate: 86.87 },
  IUSO: { candidates: 77, partOneFirstTime: 51.95, partTwoFirstTime: 83.12, partThreeFirstTime: 58.44, ultimatePassRate: 72.73 },
  IAUPR: { candidates: 24, partOneFirstTime: 25, partTwoFirstTime: 37.5, partThreeFirstTime: 37.5, ultimatePassRate: 79.17 },
  MCPHS: { candidates: 47, partOneFirstTime: 61.7, partTwoFirstTime: 85.11, partThreeFirstTime: 78.72, ultimatePassRate: 74.47 },
  MCO: { candidates: 33, partOneFirstTime: 63.64, partTwoFirstTime: 87.88, partThreeFirstTime: 57.58, ultimatePassRate: 72.73 },
  NECO: { candidates: 116, partOneFirstTime: 64.66, partTwoFirstTime: 87.93, partThreeFirstTime: 65.52, ultimatePassRate: 79.31 },
  NSUOCO: { candidates: 21, partOneFirstTime: 76.19, partTwoFirstTime: 95.24, partThreeFirstTime: 66.67, ultimatePassRate: 71.43 },
  NOVA: { candidates: 96, partOneFirstTime: 64.58, partTwoFirstTime: 89.58, partThreeFirstTime: 75, ultimatePassRate: 80.21 },
  PUCO: { candidates: 71, partOneFirstTime: 76.06, partTwoFirstTime: 85.92, partThreeFirstTime: 71.83, ultimatePassRate: 84.51 },
  "PCO-DREXEL": { candidates: 130, partOneFirstTime: 59.23, partTwoFirstTime: 82.31, partThreeFirstTime: 73.85, ultimatePassRate: 81.54 },
  SCCOMBKU: { candidates: 90, partOneFirstTime: 74.44, partTwoFirstTime: 93.33, partThreeFirstTime: 72.22, ultimatePassRate: 93.33 },
  SCO: { candidates: 128, partOneFirstTime: 86.72, partTwoFirstTime: 97.66, partThreeFirstTime: 74.22, ultimatePassRate: 95.31 },
  SUNY: { candidates: 99, partOneFirstTime: 67.68, partTwoFirstTime: 91.92, partThreeFirstTime: 68.69, ultimatePassRate: 89.9 },
  OSU: { candidates: 60, partOneFirstTime: 95, partTwoFirstTime: 100, partThreeFirstTime: 86.67, ultimatePassRate: 98.33 },
  UABSO: { candidates: 55, partOneFirstTime: 76.36, partTwoFirstTime: 92.73, partThreeFirstTime: 78.18, ultimatePassRate: 89.09 },
  UHCO: { candidates: 94, partOneFirstTime: 60.64, partTwoFirstTime: 87.23, partThreeFirstTime: 60.64, ultimatePassRate: 84.04 },
  UMSL: { candidates: 43, partOneFirstTime: 72.09, partTwoFirstTime: 90.7, partThreeFirstTime: 65.12, ultimatePassRate: 83.72 },
  KYCO: { candidates: 55, partOneFirstTime: 72.73, partTwoFirstTime: 87.27, partThreeFirstTime: 50.91, ultimatePassRate: 74.55 },
  UIWRSO: { candidates: 63, partOneFirstTime: 52.38, partTwoFirstTime: 79.37, partThreeFirstTime: 53.97, ultimatePassRate: 63.49 },
  WUCO: { candidates: 57, partOneFirstTime: 29.82, partTwoFirstTime: 61.4, partThreeFirstTime: 71.93, ultimatePassRate: 47.37 },
};

const remediationSource = pendingSource(
  "School student handbook review",
  "https://theacoe.org/program-directories",
);

export const schools: OptometrySchool[] = seeds.map((school) => ({
  id: school.code.toLowerCase(),
  ascoCode: school.code,
  name: school.name,
  city: school.city,
  state: school.state,
  programUrl: school.url,
  accreditationStatus: "ASCO member; verify current status with ACOE",
  tuition: {
    resident: school.residentTuition,
    nonResident: school.nonResidentTuition,
    source: ascoSource("3.5", "AY 2025-2026", "First-year tuition; figures are subject to change."),
  },
  directExpenses: {
    ...directExpenses[school.code],
    source: ascoSource(
      "3.7",
      "AY 2025-2026",
      "Tuition, required fees, books, and instruments by academic year; figures are subject to change.",
    ),
  },
  departureRate: {
    value: school.departureRate,
    source: ascoSource(
      "2.8",
      "AY 2024-2025",
      "ASCO reports students leaving for all reasons; this is not a cohort attrition rate.",
    ),
  },
  nineMonthLivingExpenses: {
    value: school.livingExpenses,
    source: ascoSource(
      "3.8",
      "AY 2025-2026",
      "School-reported nine-month budget; categories and insurance treatment vary.",
    ),
  },
  averageGraduateDebt: {
    value: school.debt,
    source: ascoSource(
      "3.10",
      "AY 2024-2025",
      "Average optometric educational debt across all graduates; excludes undergraduate debt.",
    ),
  },
  boardPerformance: boardPerformance[school.code]
    ? { ...boardPerformance[school.code], source: boardSource }
    : null,
  remediation: {
    summary: "Pending manual review of the current student handbook.",
    allowsCourseRemediation: null,
    allowsRepeatYear: null,
    source: remediationSource,
  },
  admissions: admissionsProfiles[school.code],
}));

const normalize = (value: number, values: number[], higherIsBetter: boolean) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 100;
  const position = (value - min) / (max - min);
  return (higherIsBetter ? position : 1 - position) * 100;
};

export function scoreSchool(
  school: OptometrySchool,
  allSchools: OptometrySchool[],
  weights: ComparisonWeights,
  residency: "resident" | "nonResident",
): number | null {
  const fourYearDirectCost = (candidate: OptometrySchool) =>
    candidate.directExpenses[residency].reduce((total, amount) => total + amount, 0);

  const metrics = [
    {
      value: fourYearDirectCost(school),
      values: allSchools.map(fourYearDirectCost),
      weight: weights.tuition,
      higher: false,
    },
    {
      value: school.boardPerformance?.ultimatePassRate ?? null,
      values: allSchools.flatMap((candidate) =>
        candidate.boardPerformance === null ? [] : [candidate.boardPerformance.ultimatePassRate],
      ),
      weight: weights.boardPassRate,
      higher: true,
    },
    {
      value: school.departureRate.value,
      values: allSchools.flatMap((candidate) =>
        candidate.departureRate.value === null ? [] : [candidate.departureRate.value],
      ),
      weight: weights.departures,
      higher: false,
    },
    {
      value: school.nineMonthLivingExpenses.value,
      values: allSchools.flatMap((candidate) =>
        candidate.nineMonthLivingExpenses.value === null
          ? []
          : [candidate.nineMonthLivingExpenses.value],
      ),
      weight: weights.livingExpenses,
      higher: false,
    },
  ].filter((metric) => metric.value !== null && metric.weight > 0);

  const totalWeight = metrics.reduce((sum, metric) => sum + metric.weight, 0);
  if (totalWeight === 0) return null;

  const score = metrics.reduce(
    (sum, metric) =>
      sum + normalize(metric.value!, metric.values, metric.higher) * metric.weight,
    0,
  );

  return Math.round(score / totalWeight);
}
import { admissionsProfiles, type AdmissionsProfile } from "./admissions";

export { admissionsProfiles, type AdmissionsProfile } from "./admissions";
