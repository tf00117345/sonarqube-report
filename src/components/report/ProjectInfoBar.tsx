import type { ProjectInfo } from '../../types/models';
import { formatDate } from '../../utils/formatters';

interface Props {
  project: ProjectInfo;
}

export default function ProjectInfoBar({ project }: Props) {
  return (
    <div className="project-info-bar">
      <div className="project-info-bar__item">
        <span className="project-info-bar__label">Project</span>
        <span className="project-info-bar__value">{project.name}</span>
      </div>
      <div className="project-info-bar__item">
        <span className="project-info-bar__label">Branch:</span>
        <span className="project-info-bar__value">{project.branch || 'main'}</span>
      </div>
      <div className="project-info-bar__item">
        <span className="project-info-bar__label">Analysis Date:</span>
        <span className="project-info-bar__value">{formatDate(project.last_analysis)}</span>
      </div>
    </div>
  );
}
