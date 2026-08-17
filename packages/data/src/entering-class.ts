import type { MetricSource } from "./index";

export type EnteringClassProfile = {
  slots: number;
  matriculants: number;
  inState: number;
  outOfState: number;
  international: number;
  statesRepresented: number;
  averageGpa: number;
  bachelorsDegreePercent: number;
  oatAcademicAverage: number | null;
  oatTotalScience: number | null;
  source: MetricSource;
};

const source: MetricSource = {
  label: "ASCO Profile of the 2024 Optometry Entering Class",
  url: "https://optometriceducation.org/wp-content/uploads/2024/10/ProfEnteringClass2024upd10-14.pdf",
  reportingPeriod: "2024 entering class",
  retrievedAt: "2026-08-16",
  status: "verified",
  note: "Residence describes matriculants, not applicants or accepted students. Counts exclude transfers and repeat students.",
};

const row = (
  slots: number,
  matriculants: number,
  inState: number,
  outOfState: number,
  international: number,
  statesRepresented: number,
  averageGpa: number,
  bachelorsDegreePercent: number,
  oatAcademicAverage: number | null,
  oatTotalScience: number | null,
): EnteringClassProfile => ({
  slots,
  matriculants,
  inState,
  outOfState,
  international,
  statesRepresented,
  averageGpa,
  bachelorsDegreePercent,
  oatAcademicAverage,
  oatTotalScience,
  source,
});

export const enteringClassProfiles: Record<string, EnteringClassProfile> = {
  UABSO: row(58, 58, 15, 42, 1, 13, 3.73, 100, 328, 315),
  AZCOPT: row(70, 70, 9, 54, 7, 25, 3.62, 100, 316, 306),
  SCCOMBKU: row(106, 106, 97, 7, 2, 5, 3.57, 98, 342, 335),
  UCB: row(62, 62, 44, 14, 4, 10, 3.75, 100, 360, 360),
  WUCO: row(69, 69, 54, 13, 2, 13, 3.22, 94, 300, 290),
  NOVA: row(107, 107, 60, 36, 11, 23, 3.58, 95, 327, 321),
  CCO: row(62, 62, 18, 38, 6, 21, 3.5, 100, 319, 308),
  ICO: row(124, 124, 18, 62, 44, 24, 3.52, 94, 330, 325),
  IUSO: row(80, 80, 18, 61, 1, 24, 3.8, 98, null, null),
  KYCO: row(59, 59, 17, 40, 2, 23, 3.47, 93, 309, 292),
  MCPHS: row(65, 65, 9, 36, 20, 21, 3.27, 91, 310, 301),
  NECO: row(128, 128, 10, 79, 39, 24, 3.53, 95, 329, 321),
  MCO: row(37, 37, 22, 6, 9, 8, 3.7, 65, 334, 330),
  UMSL: row(50, 50, 19, 31, 0, 18, 3.52, 92, 311, 292),
  SUNY: row(97, 97, 36, 51, 10, 18, 3.7, 98, 344, 342),
  OSU: row(68, 68, 33, 31, 4, 17, 3.72, 94, 352, 351),
  NSUOCO: row(28, 28, 15, 13, 0, 7, 3.8, 93, 319, 304),
  PUCO: row(89, 89, 7, 56, 26, 17, 3.52, 89, 323, 317),
  "PCO-DREXEL": row(136, 136, 33, 92, 11, 25, 3.37, 93, 306, 293),
  IAUPR: row(60, 57, 32, 22, 3, 12, 3.37, 88, 280, 263),
  SCO: row(136, 140, 24, 111, 5, 35, 3.68, 100, 339, 332),
  UIWRSO: row(68, 62, 35, 25, 2, 17, 3.37, 100, 299, 281),
  UHCO: row(99, 99, 81, 18, 0, 12, 3.63, 100, 335, 335),
  RMUCOM: row(64, 65, 17, 48, 0, 26, 3.45, 100, 311, 299),
};

