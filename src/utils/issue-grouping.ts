import type { Issue, RuleGroup } from '../types/models';

export interface RuleSummary {
  rule: string;
  ruleName: string;
  severity: string;
  type: string;
  count: number;
  hasMixedSeverity: boolean;
}

function getRuleLanguage(rule: string, component: string): string {
  if (rule.startsWith('external_roslyn:')) return '-';
  if (component.endsWith('.cs')) return 'cs';
  if (component.endsWith('.sql')) return 'plsql';
  if (component.endsWith('.ts') || component.endsWith('.tsx')) return 'ts';
  if (component.endsWith('.js') || component.endsWith('.jsx')) return 'js';
  if (component.endsWith('.java')) return 'java';
  if (component.endsWith('.py')) return 'py';
  return '';
}

export function buildRuleSummaries(issues: Issue[]): RuleSummary[] {
  const ruleMap = new Map<string, { messages: Set<string>; severities: Set<string>; types: Set<string>; count: number; component: string }>();

  for (const issue of issues) {
    const existing = ruleMap.get(issue.rule);
    if (existing) {
      existing.count++;
      existing.severities.add(issue.severity);
      existing.types.add(issue.type);
      if (!existing.messages.has(issue.message)) {
        existing.messages.add(issue.message);
      }
    } else {
      ruleMap.set(issue.rule, {
        messages: new Set([issue.message]),
        severities: new Set([issue.severity]),
        types: new Set([issue.type]),
        count: 1,
        component: issue.component,
      });
    }
  }

  const summaries: RuleSummary[] = [];
  for (const [rule, data] of ruleMap) {
    const firstMessage = data.messages.values().next().value ?? rule;
    const lang = getRuleLanguage(rule, data.component);
    const displayName = rule.startsWith('external_')
      ? `${rule} (-)`
      : `${firstMessage}${lang ? ` (${lang})` : ''}`;

    summaries.push({
      rule,
      ruleName: displayName,
      severity: data.severities.size === 1 ? data.severities.values().next().value! : 'MIXED',
      type: data.types.values().next().value!,
      count: data.count,
      hasMixedSeverity: data.severities.size > 1,
    });
  }

  return summaries;
}

function getRuleDetailLanguage(rule: string, issues: Issue[]): string {
  if (rule.startsWith('external_roslyn:')) return 'roslyn';
  const prefix = rule.split(':')[0];
  const langMap: Record<string, string> = {
    csharpsquid: 'cs',
    plsql: 'plsql',
    typescript: 'ts',
    javascript: 'js',
    java: 'java',
    python: 'py',
  };
  if (langMap[prefix]) return langMap[prefix];
  if (issues.length > 0) {
    const comp = issues[0].component;
    if (comp.endsWith('.cs')) return 'cs';
    if (comp.endsWith('.sql')) return 'plsql';
    if (comp.endsWith('.ts') || comp.endsWith('.tsx')) return 'ts';
    if (comp.endsWith('.js') || comp.endsWith('.jsx')) return 'js';
  }
  return '-';
}

function getRuleDetailName(rule: string, issues: Issue[]): string {
  if (rule.startsWith('external_')) {
    return `${rule.split(':')[0]?.replace('external_', '')}:${rule.split(':').pop()}`;
  }
  if (issues.length > 0) {
    return issues[0].message;
  }
  return rule;
}

export function groupIssuesByRule(issues: Issue[]): RuleGroup[] {
  const ruleMap = new Map<string, Issue[]>();

  for (const issue of issues) {
    const existing = ruleMap.get(issue.rule);
    if (existing) {
      existing.push(issue);
    } else {
      ruleMap.set(issue.rule, [issue]);
    }
  }

  const groups: RuleGroup[] = [];
  for (const [rule, ruleIssues] of ruleMap) {
    const sevCounts = new Map<string, number>();
    for (const iss of ruleIssues) {
      sevCounts.set(iss.severity, (sevCounts.get(iss.severity) ?? 0) + 1);
    }
    let primarySev = ruleIssues[0].severity;
    let maxCount = 0;
    for (const [sev, count] of sevCounts) {
      if (count > maxCount) {
        maxCount = count;
        primarySev = sev;
      }
    }

    groups.push({
      rule,
      ruleName: getRuleDetailName(rule, ruleIssues),
      severity: primarySev,
      type: ruleIssues[0].type,
      language: getRuleDetailLanguage(rule, ruleIssues),
      description: '',
      tags: ruleIssues[0].tags ?? [],
      issueCount: ruleIssues.length,
      issues: ruleIssues,
    });
  }

  const sevOrder = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'];
  groups.sort((a, b) => {
    const sevDiff = sevOrder.indexOf(a.severity) - sevOrder.indexOf(b.severity);
    if (sevDiff !== 0) return sevDiff;
    return b.issueCount - a.issueCount;
  });

  return groups;
}
