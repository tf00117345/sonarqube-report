import { useState } from 'react';
import type { ReportConfig } from '../types/models';

interface Props {
  onGenerate: (config: ReportConfig) => void;
  loading: boolean;
}

const PRESETS: Record<string, ReportConfig> = {
  local: {
    url: 'http://localhost:9000',
    projectKey: 'TeraLinkaECGReport-Backend',
    token: 'admin',
    password: 'Admin123456!',
  },
  cloud: {
    url: 'https://sonarcloud.io',
    projectKey: 'teramed-limit_TeraLinkaECGReport-Backend',
    token: '',
    organization: 'teramed-limit',
  },
};

export default function ConfigPanel({ onGenerate, loading }: Props) {
  const [profile, setProfile] = useState<'local' | 'cloud' | 'custom'>('local');
  const [config, setConfig] = useState<ReportConfig>(PRESETS.local);

  const handleProfileChange = (p: 'local' | 'cloud' | 'custom') => {
    setProfile(p);
    if (p !== 'custom') setConfig(PRESETS[p]);
  };

  const update = (field: keyof ReportConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="config-panel" style={{
      maxWidth: 600,
      margin: '20px auto',
      padding: 24,
      background: 'white',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ marginBottom: 16, color: '#1B2A4A' }}>SonarQube Report Generator</h2>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Profile</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['local', 'cloud', 'custom'] as const).map((p) => (
            <button
              key={p}
              onClick={() => handleProfileChange(p)}
              style={{
                padding: '6px 16px',
                background: profile === p ? '#1565C0' : '#E0E0E0',
                color: profile === p ? 'white' : '#212121',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <Field label="Server URL" value={config.url} onChange={(v) => update('url', v)} />
        <Field label="Project Key" value={config.projectKey} onChange={(v) => update('projectKey', v)} />
        <Field label="Token" value={config.token} onChange={(v) => update('token', v)} type="password" />
        {profile === 'local' && (
          <Field label="Password" value={config.password ?? ''} onChange={(v) => update('password', v)} type="password" />
        )}
        {(profile === 'cloud' || profile === 'custom') && (
          <Field label="Organization" value={config.organization ?? ''} onChange={(v) => update('organization', v)} />
        )}
      </div>

      <button
        onClick={() => onGenerate(config)}
        disabled={loading || !config.url || !config.projectKey || !config.token}
        style={{
          marginTop: 16,
          padding: '10px 32px',
          background: loading ? '#9E9E9E' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          fontSize: '11pt',
          fontWeight: 600,
          cursor: loading ? 'default' : 'pointer',
          width: '100%',
        }}
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: '9pt', color: '#757575', display: 'block', marginBottom: 2 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 10px',
          border: '1px solid #E0E0E0',
          borderRadius: 4,
          fontSize: '10pt',
        }}
      />
    </div>
  );
}
