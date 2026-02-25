import type { ProjectInfo } from "../../types/models";

interface Props {
  isCloud: boolean;
  title?: string;
  titleIcon?: "magnifier" | "none";
  rightLabel?: string;
  rightSubLabel?: string;
  project?: ProjectInfo;
}

export default function ReportHeader({
  isCloud,
  title = "Executive Report",
  titleIcon = "none",
  rightLabel,
  rightSubLabel,
  project,
}: Props) {
  const logo = isCloud ? "/sonarqube-cloud.png" : "/sonarqube-community.png";

  return (
    <>
      <div className="report-header">
        <img src={logo} alt="SonarQube" className="report-header__logo" />
        <div className="report-header__right">
          {rightLabel && (
            <div className="report-header__right-label">
              <span className="report-header__right-type">{rightLabel}</span>
              {rightSubLabel && (
                <span className="report-header__right-id">{rightSubLabel}</span>
              )}
            </div>
          )}
          {!rightLabel && (
            <div className="report-header__title-area">
              <span className="report-header__title">{title}</span>
              {titleIcon === "magnifier" && (
                <svg
                  className="report-header__icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8A951"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
      {project && (
        <div className="report-header__project-bar">
          <div className="report-header__project-item">
            <span className="report-header__project-label">Project Name</span>
            <span className="report-header__project-value">{project.name}</span>
          </div>
          <div className="report-header__project-item">
            <span className="report-header__project-label">Branch</span>
            <span className="report-header__project-value">
              <svg
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="#757575"
                style={{ marginRight: 3, verticalAlign: "middle" }}
              >
                <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm2.122 1.482a2.25 2.25 0 1 0-1.372 0A2.253 2.253 0 0 0 4 6.75v5.5a2.25 2.25 0 1 0 1.5 0V8.372a3.75 3.75 0 0 0 3.872-1.14Zm-.872 8.018a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3.5-9.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {project.branch || "main"}
            </span>
          </div>
          <div
            className="report-header__project-item"
            style={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <span className="report-header__project-label">Version</span>
            <span className="report-header__project-value">
              {project.version || "v1.0.6"}
            </span>
          </div>
          <div className="report-header__project-item">
            <span className="report-header__project-label">Analysis Date</span>
            <span className="report-header__project-value">
              {project.last_analysis
                ? new Date(project.last_analysis).toISOString().slice(0, 10)
                : "N/A"}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
