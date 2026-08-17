import type { MetricSource } from "./index";

export type EnrollmentProfile = {
  fullTime: number;
  partTime: number;
  specialPrograms: number;
  total: number;
};

export type DemographicProfile = {
  asian: number;
  black: number;
  hispanic: number;
  nativeAmerican: number;
  pacificIslander: number;
  white: number;
  multiracial: number;
  unknown: number;
};

export type ResidencyPolicy = {
  differentiatesTuition: boolean;
  canChangeAfterEnrollment: boolean | null;
  explanation: string;
};

export type SchoolDeepDive = {
  enrollment: EnrollmentProfile;
  demographics: DemographicProfile;
  residencyPolicy: ResidencyPolicy;
  source: MetricSource;
};

const codes = [
  "AZCOPT", "CCO", "IAUPR", "ICO", "IUSO", "KYCO", "MCO", "MCPHS", "NECO",
  "NOVA", "NSUOCO", "OSU", "PCO-DREXEL", "PUCO", "RMUCOM", "SCCOMBKU", "SCO",
  "SUNY", "UABSO", "UCB", "UDMSO", "UHCO", "UIWRSO", "UMSL", "WUCO",
] as const;

const enrollment: EnrollmentProfile[] = [
  { fullTime: 270, partTime: 0, specialPrograms: 0, total: 270 },
  { fullTime: 242, partTime: 0, specialPrograms: 0, total: 242 },
  { fullTime: 207, partTime: 7, specialPrograms: 0, total: 214 },
  { fullTime: 471, partTime: 17, specialPrograms: 0, total: 488 },
  { fullTime: 329, partTime: 0, specialPrograms: 0, total: 329 },
  { fullTime: 231, partTime: 0, specialPrograms: 0, total: 231 },
  { fullTime: 146, partTime: 0, specialPrograms: 0, total: 146 },
  { fullTime: 221, partTime: 2, specialPrograms: 0, total: 223 },
  { fullTime: 517, partTime: 0, specialPrograms: 26, total: 543 },
  { fullTime: 398, partTime: 0, specialPrograms: 57, total: 455 },
  { fullTime: 110, partTime: 0, specialPrograms: 0, total: 110 },
  { fullTime: 272, partTime: 0, specialPrograms: 0, total: 272 },
  { fullTime: 503, partTime: 0, specialPrograms: 59, total: 562 },
  { fullTime: 335, partTime: 5, specialPrograms: 0, total: 340 },
  { fullTime: 189, partTime: 0, specialPrograms: 0, total: 189 },
  { fullTime: 416, partTime: 0, specialPrograms: 0, total: 416 },
  { fullTime: 535, partTime: 0, specialPrograms: 0, total: 535 },
  { fullTime: 369, partTime: 1, specialPrograms: 0, total: 370 },
  { fullTime: 216, partTime: 0, specialPrograms: 6, total: 222 },
  { fullTime: 252, partTime: 0, specialPrograms: 0, total: 252 },
  { fullTime: 35, partTime: 0, specialPrograms: 0, total: 35 },
  { fullTime: 391, partTime: 0, specialPrograms: 0, total: 391 },
  { fullTime: 270, partTime: 0, specialPrograms: 0, total: 270 },
  { fullTime: 182, partTime: 0, specialPrograms: 0, total: 182 },
  { fullTime: 261, partTime: 0, specialPrograms: 0, total: 261 },
];

const black = [1.5, 1.7, 4.8, 4.5, 4.6, 4.3, 1.4, 5.4, 3.5, 5, 2.7, 2.9, 7, 0, 2.1, 1.9, 3.7, 3, 6, 6.7, 2.9, 5.1, 3, 4.9, 2.7];
const hispanic = [12.2, .8, 71, 5.5, 2.7, 4.3, 0, 6.3, 5.8, 26.1, 3.6, 2.9, 9.5, 8.1, 4.8, 7.2, 4.5, 8.9, 1.9, 4.8, 2.9, 13.3, 0, 4.4, 19.5];
const nativeAmerican = [.7, 0, 0, 0, .3, .4, .7, .5, 0, .3, 15.5, 0, 1, .3, 1.6, .2, 0, 0, .5, .8, 2.9, .5, 0, 1.6, .4];
const asian = [15.6, 21.5, 4.3, 37.8, 8.8, 10.8, 5.5, 31.2, 40, 26.4, 11.8, 12.5, 35.2, 29, 15.3, 66.6, 15.5, 46.9, 16.7, 65.1, 20, 52.7, 0, 19.2, 50.2];
const pacificIslander = [.4, 0, 5.3, 0, 0, 1.3, 0, 0, 0, 0, 0, 0, .2, .9, .5, 0, .6, .3, 0, .4, 0, .3, 0, 0, 0];
const white = [62.6, 21.9, 13.5, 42.9, 80.2, 77.1, 84.2, 56.1, 42.9, 37.4, 66.4, 72.8, 45.7, 36.4, 57.7, 13, 71.2, 33.3, 72.2, 15.9, 60, 27.1, 33, 69.2, 21.1];
const multiracial = [5.2, 1.7, 0, 5.5, 2.4, .9, 4.8, .5, 4.1, 3.3, 0, 2.6, 0, 4.8, 14.3, 5.8, 1.3, 1.9, .9, 3.6, 2.9, 0, 61.9, 0, 2.3];
const unknown = [1.9, 52.5, 1, 3.8, .9, .9, 3.4, 0, 3.7, 1.5, 0, 6.3, 1.4, 20.6, 3.7, 5.3, 3.2, 5.7, 1.9, 2.8, 8.6, 1, 2.2, .5, 3.8];

const noDifference: ResidencyPolicy = {
  differentiatesTuition: false,
  canChangeAfterEnrollment: null,
  explanation: "The school does not differentiate resident and non-resident tuition.",
};

const residencyPolicies: Partial<Record<(typeof codes)[number], ResidencyPolicy>> = {
  IAUPR: { differentiatesTuition: true, canChangeAfterEnrollment: false, explanation: "Residency status cannot change after enrollment." },
  IUSO: { differentiatesTuition: true, canChangeAfterEnrollment: true, explanation: "Students may appeal to the IU Office of the Registrar for tuition residency." },
  NSUOCO: { differentiatesTuition: true, canChangeAfterEnrollment: true, explanation: "Students who meet Oklahoma residency criteria may change to in-state status." },
  OSU: { differentiatesTuition: true, canChangeAfterEnrollment: true, explanation: "The non-resident fee falls to $5 per semester in years 2-4; limited first-year residency exceptions also exist." },
  SUNY: { differentiatesTuition: true, canChangeAfterEnrollment: true, explanation: "After living in New York for one year, students may apply for in-state residency." },
  UABSO: { differentiatesTuition: true, canChangeAfterEnrollment: true, explanation: "Students may apply for reclassification based on a spouse's employment status." },
  UCB: { differentiatesTuition: true, canChangeAfterEnrollment: true, explanation: "After year one, U.S. citizens and permanent residents may apply for in-state residency." },
  UHCO: { differentiatesTuition: true, canChangeAfterEnrollment: true, explanation: "ASCO reports that status may change after enrollment; consult UH for current criteria." },
  UMSL: { differentiatesTuition: true, canChangeAfterEnrollment: true, explanation: "Students may petition after living and working in Missouri for 12 months and meeting the school's employment criteria." },
};

const source: MetricSource = {
  label: "ASCO Annual Student Data Report, tables 1.5, 1.16, and 1.17",
  url: "https://optometriceducation.org/wp-content/uploads/2026/05/2025-26-ASCO-Annual-Student-Data-Report.pdf",
  reportingPeriod: "AY 2025-2026",
  retrievedAt: "2026-08-16",
  status: "verified",
  note: "Demographics cover full-time regular-program students. Enrollment totals include part-time, alternate, and special programs.",
};

export const schoolDeepDives: Record<string, SchoolDeepDive> = Object.fromEntries(
  codes.map((code, index) => [
    code,
    {
      enrollment: enrollment[index],
      demographics: {
        asian: asian[index],
        black: black[index],
        hispanic: hispanic[index],
        nativeAmerican: nativeAmerican[index],
        pacificIslander: pacificIslander[index],
        white: white[index],
        multiracial: multiracial[index],
        unknown: unknown[index],
      },
      residencyPolicy: residencyPolicies[code] ?? noDifference,
      source,
    },
  ]),
);

