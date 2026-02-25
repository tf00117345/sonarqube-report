interface Props {
  isCloud: boolean;
  title?: string;
}

export default function ReportHeader({ isCloud, title = 'Executive Report' }: Props) {
  const logo = isCloud ? '/sonarqube-cloud.png' : '/sonarqube-community.png';

  return (
    <div className="report-header">
      <img src={logo} alt="SonarQube" className="report-header__logo" />
      <span className="report-header__title">{title}</span>
    </div>
  );
}
