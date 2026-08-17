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
  label: "ASCO Profile of the 2025 Optometry Entering Class",
  url: "https://optometriceducation.org/wp-content/uploads/2025/10/ProfEnteringClass2025.pdf",
  reportingPeriod: "2025 entering class",
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
  UABSO: row(56, 55, 11, 44, 0, 15, 3.71, 98, 329, 319),
  AZCOPT: row(72, 72, 14, 53, 5, 25, 3.69, 100, 333, 327),
  SCCOMBKU: row(103, 103, 92, 10, 1, 10, 3.54, 98, 343, 340),
  UCB: row(69, 69, 45, 23, 1, 14, 3.76, 100, 360, 360),
  WUCO: row(70, 52, 41, 5, 6, 5, 3.27, 92, 303.33, 298),
  NOVA: row(106, 106, 54, 41, 11, 21, 3.54, 96, 325, 319),
  CCO: row(63, 63, 19, 36, 8, 20, 3.54, 100, 324, 317),
  ICO: row(125, 125, 30, 55, 40, 22, 3.59, 93, 334, 331),
  IUSO: row(92, 92, 25, 65, 2, 25, 3.78, 95, null, null),
  KYCO: row(60, 60, 13, 43, 4, 21, 3.52, 98, 301, 288),
  MCPHS: row(64, 59, 7, 33, 19, 19, 3.28, 88, 310, 302),
  NECO: row(140, 140, 21, 83, 36, 25, 3.56, 96, 331, 327),
  MCO: row(40, 37, 22, 10, 5, 11, 3.71, 70, 334, 328),
  UDMSO: row(44, 35, 23, 10, 2, 9, 3.46, 100, 303, 291.5),
  UMSL: row(45, 46, 17, 29, 0, 17, 3.5, 99, 318, 304),
  SUNY: row(96, 96, 49, 44, 3, 15, 3.67, 95, 350, 350),
  OSU: row(69, 69, 28, 40, 1, 20, 3.86, 91, 358, 359),
  NSUOCO: row(28, 28, 18, 10, 0, 7, 3.68, 99, 323, 315),
  PUCO: row(90, 90, 12, 55, 23, 18, 3.49, 84, 321, 313),
  "PCO-DREXEL": row(126, 126, 41, 82, 3, 23, 3.38, 88, 306, 295),
  IAUPR: row(50, 49, 31, 18, 0, 11, 3.4, 94, 280, 261),
  SCO: row(136, 140, 20, 113, 7, 38, 3.68, 98, 332, 323),
  UIWRSO: row(68, 74, 42, 28, 4, 14, 3.36, 100, 300, 280),
  UHCO: row(100, 100, 84, 15, 1, 13, 3.61, 100, 337, 332),
  RMUCOM: row(68, 70, 19, 48, 3, 22, 3.5, 70, 307, 293),
};
