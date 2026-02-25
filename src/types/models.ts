/** Data models for SonarQube/SonarCloud report data. */

export type Severity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
export type IssueType = 'BUG' | 'VULNERABILITY' | 'CODE_SMELL';
export type SecurityHotspotType = 'SECURITY_HOTSPOT';
export type QualityGateStatus = 'OK' | 'ERROR' | 'NONE';

export interface QualityGate {
  status: QualityGateStatus;
  conditions: Record<string, unknown>[];
}

export interface ProjectMetrics {
  bugs: number;
  vulnerabilities: number;
  code_smells: number;
  coverage: number;
  duplicated_lines_density: number;
  ncloc: number;
  sqale_index: number;
  sqale_debt_ratio: number;
  reliability_rating: number;
  security_rating: number;
  sqale_rating: number;
  security_hotspots: number;
  cognitive_complexity: number;
  complexity: number;
  duplicated_blocks: number;
  duplicated_files: number;
  duplicated_lines: number;
  lines: number;
  statements: number;
  functions: number;
  classes: number;
  files: number;
  comment_lines_density: number;
  lines_to_cover: number;
  uncovered_lines: number;
  // New code metrics (leak period)
  new_bugs: number;
  new_vulnerabilities: number;
  new_code_smells: number;
  new_coverage: number;
  new_duplicated_lines_density: number;
  new_security_hotspots: number;
  new_reliability_rating: number;
  new_security_rating: number;
  new_sqale_rating: number;
  new_sqale_debt_ratio: number;
  tests: number;
}

export interface Issue {
  key: string;
  severity: string;
  type: string;
  message: string;
  component: string;
  line: number | null;
  rule: string;
  effort: string | null;
  tags: string[];
  creation_date: string | null;
  status: string;
}

export interface SecurityHotspot {
  key: string;
  message: string;
  component: string;
  line: number | null;
  rule: string;
  severity: string;
  status: string;
  resolution: string | null;
}

/** A rule with its aggregated issues, used for per-rule detail pages. */
export interface RuleGroup {
  rule: string;
  ruleName: string;
  severity: string;
  type: string;
  language: string;
  description: string;
  tags: string[];
  issueCount: number;
  issues: Issue[];
}

export interface SeverityDistribution {
  blocker: number;
  critical: number;
  major: number;
  minor: number;
  info: number;
}

export interface SeverityTypeMatrix {
  blocker_bug: number;
  blocker_vulnerability: number;
  blocker_code_smell: number;
  critical_bug: number;
  critical_vulnerability: number;
  critical_code_smell: number;
  major_bug: number;
  major_vulnerability: number;
  major_code_smell: number;
  minor_bug: number;
  minor_vulnerability: number;
  minor_code_smell: number;
  info_bug: number;
  info_vulnerability: number;
  info_code_smell: number;
}

export interface OWASPDistribution {
  a01_broken_access_control: number;
  a02_cryptographic_failures: number;
  a03_injection: number;
  a04_insecure_design: number;
  a05_security_misconfiguration: number;
  a06_vulnerable_components: number;
  a07_auth_failures: number;
  a08_data_integrity_failures: number;
  a09_logging_failures: number;
  a10_ssrf: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface DualTrendPoint {
  date: string;
  value1: number;
  value2: number;
}

export interface MetricTrends {
  bugs: TrendPoint[];
  vulnerabilities: TrendPoint[];
  code_smells: TrendPoint[];
  coverage: TrendPoint[];
  security_hotspots: TrendPoint[];
  duplicated_lines: DualTrendPoint[];
  duplicated_lines_density: TrendPoint[];
  coverage_lines: DualTrendPoint[];
}

export interface ProjectInfo {
  key: string;
  name: string;
  qualifier: string;
  branch: string;
  version: string;
  last_analysis: string | null;
}

export interface ReportData {
  project: ProjectInfo;
  quality_gate: QualityGate;
  metrics: ProjectMetrics;
  severity_dist: SeverityDistribution;
  severity_type_matrix: SeverityTypeMatrix;
  owasp_dist: OWASPDistribution;
  trends: MetricTrends;
  all_issues: Issue[];
  security_hotspots: SecurityHotspot[];
  generated_at: string;
}

export interface ReportConfig {
  url: string;
  token: string;
  projectKey: string;
  organization?: string;
  password?: string;
}
