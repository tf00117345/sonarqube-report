import type { Issue, ProjectInfo, RuleGroup } from '../../types/models';
import { groupIssuesByRule } from '../../utils/issue-grouping';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import SeverityDot from '../ui/SeverityDot';

interface Props {
  issues: Issue[];
  isCloud: boolean;
  project: ProjectInfo;
  startPage: number;
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  BUG: 'Bug',
  VULNERABILITY: 'Vulnerability',
  CODE_SMELL: 'Code Smell',
};

function getRuleId(rule: string): string {
  const parts = rule.split(':');
  return parts.length > 1 ? parts[parts.length - 1] : rule;
}

/** Max issue rows per page for rule detail */
const ISSUES_PER_PAGE = 22;

interface RulePage {
  ruleGroup: RuleGroup;
  issues: Issue[];
  isFirstPage: boolean;
}

function paginateRuleGroups(groups: RuleGroup[]): RulePage[] {
  const pages: RulePage[] = [];

  for (const group of groups) {
    const firstPageMax = ISSUES_PER_PAGE - 4;
    const firstPageIssues = group.issues.slice(0, firstPageMax);
    pages.push({ ruleGroup: group, issues: firstPageIssues, isFirstPage: true });

    let offset = firstPageMax;
    while (offset < group.issues.length) {
      const pageIssues = group.issues.slice(offset, offset + ISSUES_PER_PAGE);
      pages.push({ ruleGroup: group, issues: pageIssues, isFirstPage: false });
      offset += ISSUES_PER_PAGE;
    }
  }

  return pages;
}

export default function RuleDetailPages({ issues, isCloud, project, startPage }: Props) {
  const groups = groupIssuesByRule(issues);
  const rulePages = paginateRuleGroups(groups);

  if (rulePages.length === 0) return null;

  return (
    <>
      {rulePages.map((page, idx) => (
        <div className="report-page" key={idx}>
          <ReportHeader
            isCloud={isCloud}
            rightLabel={ISSUE_TYPE_LABELS[page.ruleGroup.type] ?? page.ruleGroup.type}
            rightSubLabel={getRuleId(page.ruleGroup.rule)}
            project={project}
          />

          {page.isFirstPage && (
            <RuleInfoBox group={page.ruleGroup} />
          )}

          {!page.isFirstPage && (
            <div className="rule-detail__continued">{getRuleId(page.ruleGroup.rule)}</div>
          )}

          <div className="rule-detail__section-title">Issues Breakdown</div>

          <div className="rule-detail__file-list">
            {page.issues.map((issue, i) => (
              <div className="rule-detail__file-row" key={i}>
                <div className="rule-detail__file-info">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="#757575" style={{ flexShrink: 0, marginRight: 4 }}>
                    <path d="M2 2a2 2 0 0 1 2-2h4l6 6v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm5 0v5h5L8 2H7z" />
                  </svg>
                  <span className="rule-detail__filename">{issue.component}</span>
                </div>
                <div className="rule-detail__file-message">{issue.message}</div>
                <div className="rule-detail__file-line">
                  {issue.line ? `L${issue.line}` : ''}
                </div>
              </div>
            ))}
          </div>

          <ReportFooter pageNumber={startPage + idx} />
        </div>
      ))}
    </>
  );
}

function RuleInfoBox({ group }: { group: RuleGroup }) {
  return (
    <div className="rule-info-box">
      <div className="rule-info-box__header">
        <div className="rule-info-box__left">
          <SeverityDot severity={group.severity} diameter={14} />
          <div>
            <div className="rule-info-box__label">Rule</div>
            <div className="rule-info-box__name">{group.ruleName}</div>
          </div>
        </div>
        <div className="rule-info-box__right">
          <div className="rule-info-box__meta">
            <span className="rule-info-box__meta-label">Language</span>
            <span className="rule-info-box__meta-value">
              <IssueTypeIcon type={group.type} />
              {' '}{group.language}
            </span>
          </div>
          <div className="rule-info-box__meta">
            <span className="rule-info-box__meta-label">Issues</span>
            <span className="rule-info-box__meta-value">{group.issueCount}</span>
          </div>
        </div>
      </div>
      {group.description && (
        <div className="rule-info-box__description">{group.description}</div>
      )}
      {group.tags.length > 0 && (
        <div className="rule-info-box__tags">
          {group.tags.map((tag, i) => (
            <span key={i} className="rule-info-box__tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function IssueTypeIcon({ type }: { type: string }) {
  const size = 14;
  if (type === 'BUG') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="#D32F2F" style={{ verticalAlign: 'middle' }}>
        <path d="M8 1a3 3 0 0 0-3 3v1H3.5a.5.5 0 0 0 0 1H5v1.5H3a.5.5 0 0 0 0 1h2V10H3.5a.5.5 0 0 0 0 1H5a3 3 0 0 0 6 0h1.5a.5.5 0 0 0 0-1H11V8.5h2a.5.5 0 0 0 0-1h-2V6h1.5a.5.5 0 0 0 0-1H11V4a3 3 0 0 0-3-3Z" />
      </svg>
    );
  }
  if (type === 'VULNERABILITY') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="#FF9800" style={{ verticalAlign: 'middle' }}>
        <path d="M8 1C5.2 1 3 3.2 3 6v2.5L1 12h14l-2-3.5V6c0-2.8-2.2-5-5-5zm0 14c1.1 0 2-.9 2-2H6c0 1.1.9 2 2 2z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="#4CAF50" style={{ verticalAlign: 'middle' }}>
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1Z" />
    </svg>
  );
}
