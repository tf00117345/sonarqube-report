import type { ReportData } from "../../types/models";
import { fmtNumber, safePct } from "../../utils/formatters";
import CoverageCard from "./CoverageCard";
import DuplicationCard from "./DuplicationCard";
import MetricCard from "./MetricCard";
import MetricsInfoBar from "./MetricsInfoBar";
import ProjectInfoBar from "./ProjectInfoBar";
import ReportFooter from "./ReportFooter";
import ReportHeader from "./ReportHeader";
import SeverityMatrix from "./SeverityMatrix";

interface Props {
  data: ReportData;
  isCloud: boolean;
}

export default function ExecutivePage({ data, isCloud }: Props) {
  const m = data.metrics;
  const stm = data.severity_type_matrix;

  // Recalculate issue counts from the (possibly severity-filtered) matrix
  const bugs =
    stm.blocker_bug +
    stm.critical_bug +
    stm.major_bug +
    stm.minor_bug +
    stm.info_bug;
  const vulns =
    stm.blocker_vulnerability +
    stm.critical_vulnerability +
    stm.major_vulnerability +
    stm.minor_vulnerability +
    stm.info_vulnerability;
  const smells =
    stm.blocker_code_smell +
    stm.critical_code_smell +
    stm.major_code_smell +
    stm.minor_code_smell +
    stm.info_code_smell;

  return (
    <div className="report-page">
      <ReportHeader isCloud={isCloud} title="Executive Report" />
      <ProjectInfoBar project={data.project} />
      <MetricsInfoBar
        metrics={m}
        qualityGate={data.quality_gate}
        version={data.project.version}
      />

      <div className="metric-cards-row">
        <MetricCard
          title="Reliability"
          rating={m.reliability_rating}
          rows={[{ label: "Bugs", value: fmtNumber(bugs) }]}
          newCodeLabel="Reliability on new code"
          newCodeRows={[{ label: "New Bugs", value: fmtNumber(m.new_bugs) }]}
        />
        <MetricCard
          title="Security"
          rating={m.security_rating}
          rows={[
            { label: "Vulnerabilities", value: fmtNumber(vulns) },
            {
              label: "Security Hotspots",
              value: fmtNumber(m.security_hotspots),
            },
          ]}
          newCodeLabel="Security on new code"
          newCodeRows={[
            {
              label: "New Vulnerabilities",
              value: fmtNumber(m.new_vulnerabilities),
            },
            {
              label: "New Security Hotspots",
              value: fmtNumber(m.new_security_hotspots),
            },
          ]}
        />
        <MetricCard
          title="Maintainability"
          rating={m.sqale_rating}
          rows={[
            { label: "Code Smells", value: fmtNumber(smells) },
            { label: "Debt Ratio", value: safePct(m.sqale_debt_ratio) },
          ]}
          newCodeLabel="Maintainability on new code"
          newCodeRows={[
            { label: "New Code Smells", value: fmtNumber(m.new_code_smells) },
            {
              label: "Debt Ratio on New Code",
              value: safePct(m.new_sqale_debt_ratio),
            },
          ]}
        />
      </div>

      <div className="bottom-row">
        <SeverityMatrix matrix={data.severity_type_matrix} />
        <CoverageCard metrics={m} />
        <DuplicationCard metrics={m} />
      </div>

      <ReportFooter pageNumber={1} />
    </div>
  );
}
