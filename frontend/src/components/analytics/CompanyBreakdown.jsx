 import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6C63FF', '#00D9A3', '#FFB547', '#FF5757', '#7B73FF', '#00A87E'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div style={{
      background: '#1A1A24',
      border: '1px solid #1E1E2E',
      borderRadius: '10px',
      padding: '10px 14px',
    }}>
      <p style={{
        fontSize: '13px',
        fontWeight: '600',
        color: '#F0EFF8',
        marginBottom: '4px'
      }}>
        {d.company}
      </p>
      <p style={{ fontSize: '12px', color: '#6B6A7D' }}>
        {d.sessions} session{d.sessions !== 1 ? 's' : ''}
      </p>
      <p style={{
        fontSize: '12px',
        color: '#00D9A3',
        fontFamily: 'monospace'
      }}>
        Avg: {d.avgScore}/10
      </p>
    </div>
  );
};

const CompanyBreakdown = ({ companies }) => {
  if (!companies?.length) {
    return (
      <div style={{
        background: '#111118',
        border: '1px solid #1E1E2E',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#6B6A7D', fontSize: '14px' }}>
          Interview at multiple companies to see the breakdown
        </p>
      </div>
    );
  }

  const top6 = companies.slice(0, 6);
  const others = companies.slice(6);

  const chartData = others.length
    ? [...top6, { company: 'Others', sessions: others.reduce((s, c) => s + c.sessions, 0), avgScore: 0 }]
    : top6;

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
        By Company
      </h3>
      <p style={{ fontSize: '12px', color: '#6B6A7D', marginBottom: '20px' }}>
        Interview distribution
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '140px', height: '140px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="sessions"
                nameKey="company"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                strokeWidth={0}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {chartData.map((c, i) => (
            <div
              key={c.company}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: i < chartData.length - 1 ? '1px solid #1E1E2E' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: COLORS[i % COLORS.length],
                }} />
                <span style={{
                  fontSize: '13px',
                  color: '#F0EFF8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {c.company}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexShrink: 0, marginLeft: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6B6A7D' }}>
                  {c.sessions}×
                </span>
                {c.avgScore > 0 && (
                  <span style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: COLORS[i % COLORS.length]
                  }}>
                    {c.avgScore}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyBreakdown;