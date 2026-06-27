
const TYPE_CONFIG = {
  technical: { label: 'Technical', color: '#6C63FF', emoji: '⚙️' },
  behavioral: { label: 'Behavioral', color: '#FFB547', emoji: '🤝' },
  systemDesign: { label: 'System Design', color: '#00D9A3', emoji: '🏗️' },
};

const QuestionTypeStats = ({ overview }) => {
  if (!overview) return null;

  const {
    totalTechnical = 0,
    totalBehavioral = 0,
    totalSystemDesign = 0
  } = overview;

  const total = totalTechnical + totalBehavioral + totalSystemDesign;

  const types = [
    { key: 'technical', count: totalTechnical },
    { key: 'behavioral', count: totalBehavioral },
    { key: 'systemDesign', count: totalSystemDesign },
  ];

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
        Questions by Type
      </h3>
      <p style={{ fontSize: '12px', color: '#6B6A7D', marginBottom: '20px' }}>
        {total} total questions answered
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {types.map(({ key, count }) => {
          const config = TYPE_CONFIG[key];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={key}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <span style={{ fontSize: '13px', color: '#F0EFF8' }}>
                  {config.emoji} {config.label}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#6B6A7D' }}>
                    {pct}%
                  </span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    fontFamily: 'monospace',
                    color: config.color,
                  }}>
                    {count}
                  </span>
                </div>
              </div>

              <div style={{
                height: '6px',
                background: '#1E1E2E',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  borderRadius: '3px',
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${config.color}60, ${config.color})`,
                  transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTypeStats;