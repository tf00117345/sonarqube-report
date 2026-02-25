/**
 * SonarQube / SonarCloud Web API client for report data collection.
 * TypeScript port of sonar_client.py.
 */

import axios, { type AxiosInstance } from 'axios';

// ---------------------------------------------------------------------------
// Types (server-side mirrors of frontend models)
// ---------------------------------------------------------------------------

interface ProjectInfo {
  key: string;
  name: string;
  qualifier: string;
  branch: string;
  version: string;
  last_analysis: string | null;
}

interface QualityGate {
  status: 'OK' | 'ERROR' | 'NONE';
  conditions: Record<string, unknown>[];
}

interface ProjectMetrics {
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

interface Issue {
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

interface SeverityDistribution {
  blocker: number;
  critical: number;
  major: number;
  minor: number;
  info: number;
}

interface SeverityTypeMatrix {
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

interface OWASPDistribution {
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

interface TrendPoint {
  date: string;
  value: number;
}

interface MetricTrends {
  bugs: TrendPoint[];
  vulnerabilities: TrendPoint[];
  code_smells: TrendPoint[];
  coverage: TrendPoint[];
  security_hotspots: TrendPoint[];
}

interface ReportData {
  project: ProjectInfo;
  quality_gate: QualityGate;
  metrics: ProjectMetrics;
  severity_dist: SeverityDistribution;
  severity_type_matrix: SeverityTypeMatrix;
  owasp_dist: OWASPDistribution;
  trends: MetricTrends;
  all_issues: Issue[];
  generated_at: string;
}

// ---------------------------------------------------------------------------
// Metric keys
// ---------------------------------------------------------------------------

const OVERALL_METRIC_KEYS = [
  'bugs', 'vulnerabilities', 'code_smells', 'coverage',
  'duplicated_lines_density', 'ncloc', 'sqale_index', 'sqale_debt_ratio',
  'reliability_rating', 'security_rating', 'sqale_rating', 'security_hotspots',
  'cognitive_complexity', 'complexity', 'duplicated_blocks', 'duplicated_files',
  'duplicated_lines', 'lines', 'statements', 'functions', 'classes', 'files',
  'comment_lines_density',
];

const NEW_CODE_METRIC_KEYS = [
  'new_bugs', 'new_vulnerabilities', 'new_code_smells', 'new_coverage',
  'new_duplicated_lines_density', 'new_security_hotspots',
  'new_reliability_rating', 'new_security_rating', 'new_maintainability_rating',
  'new_sqale_debt_ratio', 'tests',
];

const ALL_METRIC_KEYS = [...OVERALL_METRIC_KEYS, ...NEW_CODE_METRIC_KEYS].join(',');

// OWASP tag mappings
const OWASP_TAGS: Record<string, keyof OWASPDistribution> = {
  'owaspTop10-2021:a01': 'a01_broken_access_control',
  'owaspTop10-2021:a02': 'a02_cryptographic_failures',
  'owaspTop10-2021:a03': 'a03_injection',
  'owaspTop10-2021:a04': 'a04_insecure_design',
  'owaspTop10-2021:a05': 'a05_security_misconfiguration',
  'owaspTop10-2021:a06': 'a06_vulnerable_components',
  'owaspTop10-2021:a07': 'a07_auth_failures',
  'owaspTop10-2021:a08': 'a08_data_integrity_failures',
  'owaspTop10-2021:a09': 'a09_logging_failures',
  'owaspTop10-2021:a10': 'a10_ssrf',
};

const OWASP_TAGS_LEGACY: Record<string, keyof OWASPDistribution> = {
  'owasp-a1': 'a01_broken_access_control',
  'owasp-a2': 'a02_cryptographic_failures',
  'owasp-a3': 'a03_injection',
  'owasp-a4': 'a04_insecure_design',
  'owasp-a5': 'a05_security_misconfiguration',
  'owasp-a6': 'a06_vulnerable_components',
  'owasp-a7': 'a07_auth_failures',
  'owasp-a8': 'a08_data_integrity_failures',
  'owasp-a9': 'a09_logging_failures',
  'owasp-a10': 'a10_ssrf',
};

const SEVERITIES = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'] as const;
const ISSUE_TYPES = ['BUG', 'VULNERABILITY', 'CODE_SMELL'] as const;
const API_MAX_TOTAL = 10_000;
const PAGE_SIZE = 500;

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class SonarQubeClient {
  private baseUrl: string;
  private token: string;
  private projectKey: string;
  private organization: string | undefined;
  private isCloud: boolean;
  private http: AxiosInstance;

  constructor(config: {
    baseUrl: string;
    token: string;
    projectKey: string;
    organization?: string;
    password?: string;
  }) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.token = config.token;
    this.projectKey = config.projectKey;
    this.organization = config.organization;
    this.isCloud = !!config.organization;

    const headers: Record<string, string> = { Accept: 'application/json' };

    let auth: { username: string; password: string } | undefined;

    if (this.isCloud) {
      headers['Authorization'] = `Bearer ${this.token}`;
    } else if (config.password) {
      auth = { username: this.token, password: config.password };
    } else {
      auth = { username: this.token, password: '' };
    }

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers,
      auth,
      timeout: 30_000,
    });
  }

  private orgParams(params: Record<string, unknown> = {}): Record<string, unknown> {
    const p = { ...params };
    if (this.isCloud && this.organization) {
      p.organization ??= this.organization;
    }
    return p;
  }

  private async get<T = Record<string, unknown>>(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const resp = await this.http.get<T>(endpoint, { params });
    return resp.data;
  }

  // ------------------------------------------------------------------
  // Project information
  // ------------------------------------------------------------------

  async getProjectInfo(): Promise<ProjectInfo> {
    const data = await this.get<{ component: Record<string, string> }>(
      '/api/components/show',
      this.orgParams({ component: this.projectKey }),
    );
    const comp = data.component;

    let branch = '';
    let version = '';
    let lastAnalysis: string | null = null;

    if (this.isCloud) {
      try {
        const branchData = await this.get<{ branches: Record<string, unknown>[] }>(
          '/api/project_branches/list',
          this.orgParams({ project: this.projectKey }),
        );
        for (const br of branchData.branches || []) {
          if ((br as Record<string, unknown>).isMain) {
            branch = (br as Record<string, string>).name ?? '';
            const ad = (br as Record<string, string>).analysisDate;
            if (ad) lastAnalysis = ad;
            break;
          }
        }
      } catch {
        console.warn('Could not fetch branch info from SonarCloud');
      }
    }

    try {
      const analyses = await this.get<{ analyses: Record<string, string>[] }>(
        '/api/project_analyses/search',
        this.orgParams({ project: this.projectKey, ps: 1 }),
      );
      if (analyses.analyses?.length) {
        const first = analyses.analyses[0];
        if (!lastAnalysis) lastAnalysis = first.date ?? null;
        version = first.projectVersion ?? '';
      }
    } catch {
      console.warn('Could not fetch last analysis date/version');
    }

    if (!branch) branch = comp.branch ?? '';

    return {
      key: comp.key,
      name: comp.name,
      qualifier: comp.qualifier ?? 'TRK',
      branch,
      version,
      last_analysis: lastAnalysis,
    };
  }

  // ------------------------------------------------------------------
  // Quality Gate
  // ------------------------------------------------------------------

  async getQualityGate(): Promise<QualityGate> {
    const data = await this.get<{
      projectStatus: { status: string; conditions?: Record<string, unknown>[] };
    }>(
      '/api/qualitygates/project_status',
      this.orgParams({ projectKey: this.projectKey }),
    );
    return {
      status: data.projectStatus.status as QualityGate['status'],
      conditions: data.projectStatus.conditions ?? [],
    };
  }

  // ------------------------------------------------------------------
  // Metrics
  // ------------------------------------------------------------------

  async getMetrics(): Promise<ProjectMetrics> {
    const data = await this.get<{
      component: {
        measures: {
          metric: string;
          value?: string;
          period?: { value?: string };
        }[];
      };
    }>(
      '/api/measures/component',
      this.orgParams({ component: this.projectKey, metricKeys: ALL_METRIC_KEYS }),
    );

    const overall: Record<string, string> = {};
    const period: Record<string, string> = {};

    for (const m of data.component.measures) {
      if (m.value !== undefined) overall[m.metric] = m.value;
      if (m.period?.value !== undefined) period[m.metric] = m.period.value;
    }

    const toInt = (src: Record<string, string>, key: string, def = 0): number => {
      const v = src[key];
      if (v === undefined) return def;
      const n = parseInt(v, 10);
      return isNaN(n) ? def : n;
    };

    const toFloat = (src: Record<string, string>, key: string, def = 0): number => {
      const v = src[key];
      if (v === undefined) return def;
      const n = parseFloat(v);
      return isNaN(n) ? def : n;
    };

    return {
      bugs: toInt(overall, 'bugs'),
      vulnerabilities: toInt(overall, 'vulnerabilities'),
      code_smells: toInt(overall, 'code_smells'),
      coverage: toFloat(overall, 'coverage'),
      duplicated_lines_density: toFloat(overall, 'duplicated_lines_density'),
      ncloc: toInt(overall, 'ncloc'),
      sqale_index: toInt(overall, 'sqale_index'),
      sqale_debt_ratio: toFloat(overall, 'sqale_debt_ratio'),
      reliability_rating: toFloat(overall, 'reliability_rating', 1),
      security_rating: toFloat(overall, 'security_rating', 1),
      sqale_rating: toFloat(overall, 'sqale_rating', 1),
      security_hotspots: toInt(overall, 'security_hotspots'),
      cognitive_complexity: toInt(overall, 'cognitive_complexity'),
      complexity: toInt(overall, 'complexity'),
      duplicated_blocks: toInt(overall, 'duplicated_blocks'),
      duplicated_files: toInt(overall, 'duplicated_files'),
      duplicated_lines: toInt(overall, 'duplicated_lines'),
      lines: toInt(overall, 'lines'),
      statements: toInt(overall, 'statements'),
      functions: toInt(overall, 'functions'),
      classes: toInt(overall, 'classes'),
      files: toInt(overall, 'files'),
      comment_lines_density: toFloat(overall, 'comment_lines_density'),
      new_bugs: toInt(period, 'new_bugs'),
      new_vulnerabilities: toInt(period, 'new_vulnerabilities'),
      new_code_smells: toInt(period, 'new_code_smells'),
      new_coverage: toFloat(period, 'new_coverage'),
      new_duplicated_lines_density: toFloat(period, 'new_duplicated_lines_density'),
      new_security_hotspots: toInt(period, 'new_security_hotspots'),
      new_reliability_rating: toFloat(period, 'new_reliability_rating'),
      new_security_rating: toFloat(period, 'new_security_rating'),
      new_sqale_rating: toFloat(period, 'new_maintainability_rating'),
      new_sqale_debt_ratio: toFloat(period, 'new_sqale_debt_ratio'),
      tests: toInt(overall, 'tests'),
    };
  }

  // ------------------------------------------------------------------
  // Severity distribution
  // ------------------------------------------------------------------

  async getSeverityDistribution(): Promise<SeverityDistribution> {
    const data = await this.get<{
      facets: { property: string; values: { val: string; count: number }[] }[];
    }>(
      '/api/issues/search',
      this.orgParams({
        componentKeys: this.projectKey,
        ps: 1,
        facets: 'severities',
        statuses: 'OPEN,CONFIRMED,REOPENED',
      }),
    );

    const facetMap: Record<string, number> = {};
    for (const facet of data.facets ?? []) {
      if (facet.property === 'severities') {
        for (const v of facet.values) facetMap[v.val] = v.count;
      }
    }

    return {
      blocker: facetMap['BLOCKER'] ?? 0,
      critical: facetMap['CRITICAL'] ?? 0,
      major: facetMap['MAJOR'] ?? 0,
      minor: facetMap['MINOR'] ?? 0,
      info: facetMap['INFO'] ?? 0,
    };
  }

  // ------------------------------------------------------------------
  // Severity x Type matrix
  // ------------------------------------------------------------------

  async getSeverityTypeMatrix(): Promise<SeverityTypeMatrix> {
    const counts: Record<string, Record<string, number>> = {};

    for (const issueType of ISSUE_TYPES) {
      const data = await this.get<{
        facets: { property: string; values: { val: string; count: number }[] }[];
      }>(
        '/api/issues/search',
        this.orgParams({
          componentKeys: this.projectKey,
          types: issueType,
          ps: 1,
          facets: 'severities',
          statuses: 'OPEN,CONFIRMED,REOPENED',
        }),
      );

      const sevMap: Record<string, number> = {};
      for (const facet of data.facets ?? []) {
        if (facet.property === 'severities') {
          for (const v of facet.values) sevMap[v.val] = v.count;
        }
      }
      counts[issueType] = sevMap;
    }

    const c = (type: string, sev: string) => counts[type]?.[sev] ?? 0;

    return {
      blocker_bug: c('BUG', 'BLOCKER'),
      blocker_vulnerability: c('VULNERABILITY', 'BLOCKER'),
      blocker_code_smell: c('CODE_SMELL', 'BLOCKER'),
      critical_bug: c('BUG', 'CRITICAL'),
      critical_vulnerability: c('VULNERABILITY', 'CRITICAL'),
      critical_code_smell: c('CODE_SMELL', 'CRITICAL'),
      major_bug: c('BUG', 'MAJOR'),
      major_vulnerability: c('VULNERABILITY', 'MAJOR'),
      major_code_smell: c('CODE_SMELL', 'MAJOR'),
      minor_bug: c('BUG', 'MINOR'),
      minor_vulnerability: c('VULNERABILITY', 'MINOR'),
      minor_code_smell: c('CODE_SMELL', 'MINOR'),
      info_bug: c('BUG', 'INFO'),
      info_vulnerability: c('VULNERABILITY', 'INFO'),
      info_code_smell: c('CODE_SMELL', 'INFO'),
    };
  }

  // ------------------------------------------------------------------
  // All issues (paginated)
  // ------------------------------------------------------------------

  async getAllIssues(): Promise<Issue[]> {
    const allIssues: Issue[] = [];
    let page = 1;

    while (true) {
      const data = await this.get<{
        issues: Record<string, unknown>[];
        total: number;
      }>(
        '/api/issues/search',
        this.orgParams({
          componentKeys: this.projectKey,
          ps: PAGE_SIZE,
          p: page,
          s: 'SEVERITY',
          asc: 'false',
          statuses: 'OPEN,CONFIRMED,REOPENED',
        }),
      );

      const rawIssues = data.issues ?? [];
      for (const raw of rawIssues) {
        allIssues.push({
          key: raw.key as string,
          severity: (raw.severity as string) ?? 'UNKNOWN',
          type: (raw.type as string) ?? 'UNKNOWN',
          message: (raw.message as string) ?? '',
          component: ((raw.component as string) ?? '').replace(`${this.projectKey}:`, ''),
          line: (raw.line as number) ?? null,
          rule: (raw.rule as string) ?? '',
          effort: (raw.effort as string) ?? null,
          tags: (raw.tags as string[]) ?? [],
          creation_date: (raw.creationDate as string) ?? null,
          status: (raw.status as string) ?? 'OPEN',
        });
      }

      const total = data.total ?? 0;
      const fetchedSoFar = page * PAGE_SIZE;

      if (fetchedSoFar >= total || fetchedSoFar >= API_MAX_TOTAL) break;
      if (!rawIssues.length) break;

      page++;
    }

    console.log(`Fetched ${allIssues.length} issues in ${page} page(s)`);
    return allIssues;
  }

  // ------------------------------------------------------------------
  // OWASP Top 10 distribution
  // ------------------------------------------------------------------

  async getOwaspDistribution(): Promise<OWASPDistribution> {
    const dist: OWASPDistribution = {
      a01_broken_access_control: 0,
      a02_cryptographic_failures: 0,
      a03_injection: 0,
      a04_insecure_design: 0,
      a05_security_misconfiguration: 0,
      a06_vulnerable_components: 0,
      a07_auth_failures: 0,
      a08_data_integrity_failures: 0,
      a09_logging_failures: 0,
      a10_ssrf: 0,
    };

    for (const tagsMap of [OWASP_TAGS, OWASP_TAGS_LEGACY]) {
      let hasResults = false;
      for (const [tag, fieldName] of Object.entries(tagsMap)) {
        try {
          const data = await this.get<{ total: number }>(
            '/api/issues/search',
            this.orgParams({
              componentKeys: this.projectKey,
              tags: tag,
              ps: 1,
            }),
          );
          const count = data.total ?? 0;
          if (count > 0) hasResults = true;
          dist[fieldName] = Math.max(dist[fieldName], count);
        } catch {
          console.warn(`Failed to fetch OWASP tag: ${tag}`);
        }
      }
      if (hasResults) break;
    }

    return dist;
  }

  // ------------------------------------------------------------------
  // Metric trends (history)
  // ------------------------------------------------------------------

  async getTrends(
    metrics = 'bugs,vulnerabilities,code_smells,coverage,security_hotspots',
  ): Promise<MetricTrends> {
    const trends: MetricTrends = {
      bugs: [],
      vulnerabilities: [],
      code_smells: [],
      coverage: [],
      security_hotspots: [],
    };

    try {
      const data = await this.get<{
        measures: {
          metric: string;
          history: { date: string; value?: string }[];
        }[];
      }>(
        '/api/measures/search_history',
        this.orgParams({
          component: this.projectKey,
          metrics,
          ps: 30,
        }),
      );

      for (const measure of data.measures ?? []) {
        const points: TrendPoint[] = (measure.history ?? [])
          .filter((h) => h.value !== undefined)
          .map((h) => ({ date: h.date, value: parseFloat(h.value!) }));

        const key = measure.metric as keyof MetricTrends;
        if (key in trends) {
          trends[key] = points;
        }
      }
    } catch {
      console.warn('Failed to fetch metric trends');
    }

    return trends;
  }

  // ------------------------------------------------------------------
  // Aggregate
  // ------------------------------------------------------------------

  async collectReportData(): Promise<ReportData> {
    const mode = this.isCloud ? 'SonarCloud' : 'SonarQube';
    console.log(`Collecting report data for project '${this.projectKey}' (${mode})`);

    const project = await this.getProjectInfo();
    console.log(`Project: ${project.name} (branch: ${project.branch}, version: ${project.version})`);

    const qualityGate = await this.getQualityGate();
    console.log(`Quality gate: ${qualityGate.status}`);

    const metrics = await this.getMetrics();
    console.log(
      `Metrics: ${metrics.bugs} bugs, ${metrics.vulnerabilities} vulns, ` +
        `${metrics.code_smells} smells, ${metrics.coverage.toFixed(1)}% coverage`,
    );

    const severityDist = await this.getSeverityDistribution();
    const severityTypeMatrix = await this.getSeverityTypeMatrix();
    const owaspDist = await this.getOwaspDistribution();
    const trends = await this.getTrends();
    const allIssues = await this.getAllIssues();

    console.log(`Total issues collected: ${allIssues.length}`);

    return {
      project,
      quality_gate: qualityGate,
      metrics,
      severity_dist: severityDist,
      severity_type_matrix: severityTypeMatrix,
      owasp_dist: owaspDist,
      trends,
      all_issues: allIssues,
      generated_at: new Date().toISOString(),
    };
  }
}
