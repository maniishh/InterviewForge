 
const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: '#00D9A3', order: 1 },
  medium: { label: 'Medium', color: '#6C63FF', order: 2 },
  hard: { label: 'Hard', color: '#FFB547', order: 3 },
};

const DimensionRow = ({ label, value, color, max = 10 }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '4px'
    }}>
      <span style={{ fontSize: '11px', color: '#6B6A7D' }}>{label}</span>
      <span style={{
        fontSize: '11px',
        fontFamily: 'monospace',
        fontWeight: '600',
        color
      }}>
        {value || 0}
      </span>
    </div>
    <div style={{
      height: '4px',
      background: '#1E1E2E',
      borderRadius: '2px',
      overflow: 'hidden'
    }}>
      <div style={{
        height: '100%',
        borderRadius: '2px',
        width: `${((value || 0) / max) * 100}%`,
        background: color,
        transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} />
    </div>
  </div>
);

const DifficultyCard = ({ data }) => {
  const config = DIFFICULTY_CONFIG[data.difficulty] || DIFFICULTY_CONFIG.medium;

  return (
    <div style={{
      background: '#0A0A0F',
      border: `1px solid ${config.color}30`,
      borderRadius: '14px',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: config.color,
          }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#F0EFF8' }}>
            {config.label}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: '22px',
            fontWeight: '700',
            fontFamily: 'monospace',
            color: config.color,
            lineHeight: 1
          }}>
            {data.avgOverallScore || 0}
          </p>
          <p style={{ fontSize: '10px', color: '#6B6A7D' }}>
            {data.sessions} session{data.sessions !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <DimensionRow label="Technical" value={data.avgTechnicalScore} color={config.color} />
      <DimensionRow label="Communication" value={data.avgCommunicationScore} color={config.color} />
      <DimensionRow label="Depth" value={data.avgDepthScore} color={config.color} />
    </div>
  );
};

const DifficultyStats = ({ breakdown }) => {
  if (!breakdown?.length) {
    return (
      <div style={{
        background: '#111118',
        border: '1px solid #1E1E2E',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#6B6A7D', fontSize: '14px' }}>
          Try different difficulty levels to see comparison
        </p>
      </div>
    );
  }

  const sorted = [...breakdown].sort(
    (a, b) =>
      (DIFFICULTY_CONFIG[a.difficulty]?.order || 0) -
      (DIFFICULTY_CONFIG[b.difficulty]?.order || 0)
  );

  return (
    <div style={{
      background: '#111118',
      border: '1px solid #1E1E2E',
      borderRadius: '16px',
      padding: '24px',
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '700',
        color: '#F0EFF8',
        marginBottom: '4px'
      }}>
        By Difficulty
      </h3>
      <p style={{ fontSize: '12px', color: '#6B6A7D', marginBottom: '20px' }}>
        Score comparison across levels
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${sorted.length}, 1fr)`,
        gap: '12px',
      }}>
        {sorted.map(d => (
          <DifficultyCard key={d.difficulty} data={d} />
        ))}
      </div>
    </div>
  );
};

export default DifficultyStats;