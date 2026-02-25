import type { ProjectInfo } from "../../types/models";

interface Props {
  project: ProjectInfo;
}

export default function ProjectInfoBar({ project }: Props) {
  const analysisDate = project.last_analysis
    ? new Date(project.last_analysis).toISOString().slice(0, 10)
    : "N/A";

  return (
    <div className="project-info-bar">
      <div className="project-info-bar__item">
        <span className="project-info-bar__label">Project Name</span>
        <span className="project-info-bar__value">{project.name}</span>
      </div>
      <div className="project-info-bar__item project-info-bar__item--center">
        <span className="project-info-bar__label">Branch</span>
        <span className="project-info-bar__value">
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
      <div className="project-info-bar__item project-info-bar__item--center">
        <span className="project-info-bar__label">Version</span>
        <span className="project-info-bar__value">
          {project.version || "v1.0.6"}
        </span>
      </div>
      <div className="project-info-bar__item project-info-bar__item--right">
        <span className="project-info-bar__label">Analysis Date</span>
        <span className="project-info-bar__value">{analysisDate}</span>
      </div>
    </div>
  );
}
