import Link from "next/link";
import { notFound } from "next/navigation";
import { schools } from "@compario/data";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function generateStaticParams() {
  return schools.map((school) => ({ id: school.id }));
}

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const school = schools.find((candidate) => candidate.id === id);
  if (!school) notFound();

  const directCost = (status: "resident" | "nonResident") =>
    school.directExpenses[status].reduce((sum, amount) => sum + amount, 0);
  const demographics = [
    ["Asian", school.deepDive.demographics.asian],
    ["Black or African American", school.deepDive.demographics.black],
    ["Hispanic or Latino", school.deepDive.demographics.hispanic],
    ["American Indian or Alaska Native", school.deepDive.demographics.nativeAmerican],
    ["Native Hawaiian or Pacific Islander", school.deepDive.demographics.pacificIslander],
    ["White", school.deepDive.demographics.white],
    ["Two or more races", school.deepDive.demographics.multiracial],
    ["Unknown", school.deepDive.demographics.unknown],
  ] as const;
  const enteringClass = school.enteringClass;
  const percent = (value: number, total: number) =>
    `${((value / total) * 100).toFixed(1)}%`;

  return (
    <main className="detail-page">
      <Link className="back-link" href="/">Back to all schools</Link>
      <header className="detail-hero">
        <p className="eyebrow">{school.ascoCode} / {school.city}, {school.state}</p>
        <h1>{school.name}</h1>
        <p className="lede">
          A source-labeled view of enrollment, student population, costs, board performance,
          and admissions.
        </p>
        <a className="external-button" href={school.programUrl}>Visit official program site</a>
      </header>

      <section className="stat-grid" aria-label="Enrollment overview">
        <article><strong>{school.deepDive.enrollment.total}</strong><span>Total OD enrollment</span></article>
        <article><strong>{school.deepDive.enrollment.fullTime}</strong><span>Full-time</span></article>
        <article><strong>{school.deepDive.enrollment.partTime}</strong><span>Part-time</span></article>
        <article><strong>{school.deepDive.enrollment.specialPrograms}</strong><span>Special/alternate</span></article>
      </section>

      <section className="detail-section">
        <div className="section-heading">
          <p className="eyebrow">Student population</p>
          <h2>Full-time student demographics</h2>
          <p>Percent of AY 2025-26 full-time regular-program enrollment.</p>
        </div>
        <div className="demographic-list">
          {demographics.map(([label, value]) => (
            <div className="demographic-row" key={label}>
              <span>{label}</span>
              <div className="bar-track"><span style={{ width: `${value}%` }} /></div>
              <strong>{value}%</strong>
            </div>
          ))}
        </div>
        <a className="source" href={school.deepDive.source.url}>{school.deepDive.source.label}</a>
      </section>

      <section className="detail-section entering-class-section">
        <div className="section-heading">
          <p className="eyebrow">Standardized cohort</p>
          <h2>2024 entering class</h2>
          <p>ASCO uses the same definitions across participating schools.</p>
        </div>
        {enteringClass ? (
          <>
            <div className="residency-grid">
              <article>
                <strong>{enteringClass.inState}</strong>
                <span>In-state matriculants</span>
                <small>{percent(enteringClass.inState, enteringClass.matriculants)}</small>
              </article>
              <article>
                <strong>{enteringClass.outOfState}</strong>
                <span>Out-of-state domestic</span>
                <small>{percent(enteringClass.outOfState, enteringClass.matriculants)}</small>
              </article>
              <article>
                <strong>{enteringClass.international}</strong>
                <span>Foreign country</span>
                <small>{percent(enteringClass.international, enteringClass.matriculants)}</small>
              </article>
            </div>
            <dl>
              <div><dt>First-year slots</dt><dd>{enteringClass.slots}</dd></div>
              <div><dt>Matriculants</dt><dd>{enteringClass.matriculants}</dd></div>
              <div><dt>States represented</dt><dd>{enteringClass.statesRepresented}</dd></div>
              <div><dt>Average GPA</dt><dd>{enteringClass.averageGpa}</dd></div>
              <div><dt>Bachelor&apos;s degree</dt><dd>{enteringClass.bachelorsDegreePercent}%</dd></div>
              <div><dt>OAT Academic Average</dt><dd>{enteringClass.oatAcademicAverage ?? "Not reported"}</dd></div>
              <div><dt>OAT Total Science</dt><dd>{enteringClass.oatTotalScience ?? "Not reported"}</dd></div>
            </dl>
            <p className="data-caveat">
              These are matriculant residence percentages, not acceptance rates by residence.
              ASCO does not report accepted in-state and out-of-state counts in this table.
            </p>
            <a className="source" href={enteringClass.source.url}>{enteringClass.source.label}</a>
          </>
        ) : (
          <p>No standardized 2024 entering-class profile was available for this new program.</p>
        )}
      </section>

      <section className="detail-columns">
        <article className="detail-section">
          <div className="section-heading">
            <p className="eyebrow">Residency</p>
            <h2>Tuition status</h2>
          </div>
          <dl>
            <div><dt>Different in-state tuition?</dt><dd>{school.deepDive.residencyPolicy.differentiatesTuition ? "Yes" : "No"}</dd></div>
            <div><dt>Can status change?</dt><dd>{school.deepDive.residencyPolicy.canChangeAfterEnrollment === null ? "Not applicable" : school.deepDive.residencyPolicy.canChangeAfterEnrollment ? "Yes" : "No"}</dd></div>
          </dl>
          <p>{school.deepDive.residencyPolicy.explanation}</p>
          <p className="data-caveat">This describes tuition classification, not the percentage of accepted students from each state.</p>
        </article>

        <article className="detail-section">
          <div className="section-heading">
            <p className="eyebrow">Admissions</p>
            <h2>Entering profile</h2>
          </div>
          <dl>
            <div><dt>Minimum GPA</dt><dd>{school.admissions.minimumGpa}</dd></div>
            <div><dt>Average cumulative GPA</dt><dd>{school.admissions.averageGpa}</dd></div>
            <div><dt>Average science GPA</dt><dd>{school.admissions.scienceGpa ?? "Not published"}</dd></div>
            <div><dt>OAT Academic Average</dt><dd>{school.admissions.averageOat}</dd></div>
            <div><dt>OAT Total Science</dt><dd>{school.admissions.scienceOat ?? "Not published"}</dd></div>
            <div><dt>Class size</dt><dd>{school.admissions.classSize}</dd></div>
            <div><dt>Acceptance / enrollment</dt><dd>{school.admissions.acceptance}</dd></div>
            <div><dt>Deadline</dt><dd>{school.admissions.deadline}</dd></div>
            <div><dt>Interview</dt><dd>{school.admissions.interview}</dd></div>
            <div><dt>Shadowing</dt><dd>{school.admissions.shadowing}</dd></div>
          </dl>
          <a className="source" href={school.admissions.sourceUrl}>Official admissions source</a>
        </article>
      </section>

      <section className="detail-columns">
        <article className="detail-section">
          <div className="section-heading">
            <p className="eyebrow">Cost</p>
            <h2>Four-year direct expenses</h2>
          </div>
          <dl>
            {school.directExpenses.resident.map((amount, index) => (
              <div key={index}><dt>Year {index + 1} resident</dt><dd>{money.format(amount)}</dd></div>
            ))}
            <div className="total-row"><dt>Resident total</dt><dd>{money.format(directCost("resident"))}</dd></div>
            <div className="total-row"><dt>Non-resident total</dt><dd>{money.format(directCost("nonResident"))}</dd></div>
            <div><dt>Nine-month living budget</dt><dd>{school.nineMonthLivingExpenses.value === null ? "Not reported" : money.format(school.nineMonthLivingExpenses.value)}</dd></div>
            <div><dt>Average graduate debt</dt><dd>{school.averageGraduateDebt.value === null ? "Not available" : money.format(school.averageGraduateDebt.value)}</dd></div>
          </dl>
          <a className="source" href={school.directExpenses.source.url}>{school.directExpenses.source.label}</a>
        </article>

        <article className="detail-section">
          <div className="section-heading">
            <p className="eyebrow">Licensure</p>
            <h2>NBEO performance</h2>
          </div>
          {school.boardPerformance ? (
            <dl>
              <div><dt>Reporting candidates</dt><dd>{school.boardPerformance.candidates}</dd></div>
              <div><dt>Part I first-time</dt><dd>{school.boardPerformance.partOneFirstTime}%</dd></div>
              <div><dt>Part II first-time</dt><dd>{school.boardPerformance.partTwoFirstTime}%</dd></div>
              <div><dt>Part III first-time</dt><dd>{school.boardPerformance.partThreeFirstTime}%</dd></div>
              <div className="total-row"><dt>Ultimate all-parts</dt><dd>{school.boardPerformance.ultimatePassRate}%</dd></div>
            </dl>
          ) : <p>No graduating cohort appeared in the latest report.</p>}
          {school.boardPerformance && <a className="source" href={school.boardPerformance.source.url}>{school.boardPerformance.source.label}</a>}
          <dl>
            <div><dt>Students leaving</dt><dd>{school.departureRate.value === null ? "Not available" : `${school.departureRate.value}%`}</dd></div>
            <div><dt>Remediation policy</dt><dd className="pending">{school.remediation.summary}</dd></div>
          </dl>
        </article>
      </section>

      <section className="detail-section">
        <div className="section-heading">
          <p className="eyebrow">Requirements</p>
          <h2>Prerequisite overview</h2>
        </div>
        <p>{school.admissions.prerequisites}</p>
      </section>
    </main>
  );
}
