# Data collection plan

## What the ASCO 2025-26 report gives us

The attached 83-page report is the best initial bulk source. It states that
all 25 U.S. professional O.D. programs with enrolled students responded.

| Product field | ASCO table | Important interpretation |
| --- | --- | --- |
| Program registry | i-ii | ASCO members, not a substitute for current ACOE accreditation status |
| Enrollment and class size | 1.1-1.21 | Current academic-year snapshots |
| Students leaving | 2.8 | Annual departures by reason and year, not cohort attrition |
| Tuition | 3.5 | By school, class year, and resident status |
| Fees/books/instruments | 3.6 | School-reported; definitions can vary |
| Direct expenses | 3.7 | Tuition plus fees, books, and instruments |
| Living expenses | 3.8 | Nine- and twelve-month school budgets; categories vary |
| Aid and scholarships | 3.1-3.4, 3.9 | Prior academic-year awards |
| Graduate debt | 3.10 | Optometric debt; excludes undergraduate debt |

The starter has loaded the 25-program registry plus first-year tuition,
nine-month living budget, annual departure percentage, and average debt for all
graduates. Nulls remain null where ASCO reports no value.

## Missing sources

| Field | Primary source | Collection method |
| --- | --- | --- |
| Accreditation | ACOE program directory | Scheduled import plus change review |
| Board performance | ASCO/NBEO yearly performance report | Import school/part/cohort tables |
| True cohort attrition and completion | ACOE student achievement links and school disclosures | School-specific import |
| Remediation and dismissal | Current student handbooks | Manual structured review with quoted page citation |
| Admissions prerequisites | School admissions pages; BoosterPrep as a discovery aid | Verify against each school |
| Local cost index | BEA Regional Price Parities and MIT Living Wage | Join by metro/county and reporting year |

BoosterPrep is helpful for discovering school pages and understanding the
applicant experience. A value should not be marked verified until it matches an
official school, ASCO, ACOE, NBEO, or government source.

## Remediation policy fields

Store both the concise comparison and the original citation:

- minimum GPA and course-grade thresholds
- exam or course remediation allowed
- maximum remediations
- repeat-course and repeat-year rules
- academic probation trigger and duration
- dismissal trigger
- appeal process
- extra tuition/fees and schedule delay
- handbook edition, page number, URL, and retrieval date

## Ingestion workflow

1. Save the original document URL, retrieval time, reporting period, and hash.
2. Extract rows into staging tables without overwriting prior years.
3. Validate school codes, numeric ranges, totals, and footnotes.
4. Compare new observations with the previous year and flag large changes.
5. Human-review flagged rows and every narrative policy.
6. Publish only verified observations; show missing values as unknown.

## Next milestones

1. Import all remaining ASCO tables into PostgreSQL.
2. Add the current ACOE accreditation directory.
3. Load the latest school-level NBEO report.
4. Review one handbook end-to-end (SCCO is a good pilot), finalize the policy rubric, then process the remaining schools.
5. Add saved shortlists, side-by-side comparison, authentication, and deploy.

