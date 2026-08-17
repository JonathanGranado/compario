import type { MetricSource } from "./index";

export type SchoolPublishedClassProfile = {
  overallGpa: string;
  scienceGpa: string;
  oatAcademicAverage: string;
  oatTotalScience: string;
  cohort: string;
  source: MetricSource;
};

const source = (
  label: string,
  url: string,
  reportingPeriod: string,
  note?: string,
): MetricSource => ({
  label,
  url,
  reportingPeriod,
  retrievedAt: "2026-08-16",
  status: "verified",
  note,
});

export const schoolPublishedClassProfiles: Record<string, SchoolPublishedClassProfile> = {
  AZCOPT: {
    overallGpa: "3.69 average",
    scienceGpa: "Not published",
    oatAcademicAverage: "Not published",
    oatTotalScience: "Not published",
    cohort: "72 matriculants",
    source: source(
      "Midwestern University AZCOPT class profiles",
      "https://www.midwestern.edu/academics/degrees-programs/doctor-optometry-program/arizona-college-optometry/class-profiles",
      "2025 entering class",
    ),
  },
  CCO: {
    overallGpa: "3.44 entering GPA",
    scienceGpa: "Not published",
    oatAcademicAverage: "315 entering OAT score",
    oatTotalScience: "Not specified",
    cohort: "63 matriculants",
    source: source(
      "Midwestern University CCO class profiles",
      "https://www.midwestern.edu/academics/degrees-programs/doctor-optometry-program/chicago-college-optometry/class-profiles-cco",
      "2025 entering class",
      "The school labels 315 as an entering OAT score without specifying AA or TS.",
    ),
  },
  SCCOMBKU: {
    overallGpa: "3.54 average",
    scienceGpa: "3.43 BCP average",
    oatAcademicAverage: "344 average",
    oatTotalScience: "339 average",
    cohort: "106 entering students",
    source: source(
      "SCCO Incoming Class Fall 2025 profile",
      "https://www.ketchum.edu/sites/default/files/ESS1016%20-%20SCCO%20Class%20Profile%202025_REV2.pdf",
      "Fall 2025 incoming class",
    ),
  },
  UCB: {
    overallGpa: "Not published",
    scienceGpa: "3.15-4.0 BCP range",
    oatAcademicAverage: "310-400 OAT range",
    oatTotalScience: "Not published",
    cohort: "67 enrolled students",
    source: source(
      "UC Berkeley recent applicants",
      "https://optometry.berkeley.edu/about-us/our-students/our-applicants/",
      "2026 enrolled students",
      "Berkeley publishes ranges, not average GPA or OAT values.",
    ),
  },
  ICO: {
    overallGpa: "Distribution only; 38% at 3.70+",
    scienceGpa: "Not published",
    oatAcademicAverage: "Not published",
    oatTotalScience: "331 mean",
    cohort: "125 enrolled students",
    source: source(
      "Illinois College of Optometry entering class profile",
      "https://www.ico.edu/entering-class-profile",
      "Class of 2029",
      "The current profile is an image and reports a GPA distribution rather than an average.",
    ),
  },
  MCO: {
    overallGpa: "3.71 mean",
    scienceGpa: "Not published",
    oatAcademicAverage: "333 mean",
    oatTotalScience: "325 mean",
    cohort: "37 matriculants",
    source: source(
      "Michigan College of Optometry class profile",
      "https://www.ferris.edu/optometry/admissions/class-profile.htm",
      "2025 entering class",
    ),
  },
  NECO: {
    overallGpa: "3.56 average",
    scienceGpa: "3.42 average",
    oatAcademicAverage: "331 average",
    oatTotalScience: "327 average",
    cohort: "140 enrolled students",
    source: source(
      "NECO Class Profile & Statistics",
      "https://www.neco.edu/admissions/class-profile-statistics/",
      "Class of 2029",
    ),
  },
};
